import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const debuggerPort = process.env.EDGE_DEBUG_PORT ?? '9234';
const screenshotDirectory = process.env.EDGE_SCREENSHOT_DIR;
if (screenshotDirectory) mkdirSync(screenshotDirectory, { recursive: true });
const pages = await fetch(`http://localhost:${debuggerPort}/json/list`).then((response) => response.json());
const page = pages.find((item) => item.type === 'page');
if (!page) throw new Error('No Chromium page target was found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data.toString());
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});
function command(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}
async function navigate(path, width, height) {
  await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await command('Page.navigate', { url: `http://localhost:4173${path}` });
  await wait(1300);
}

await command('Page.enable');
await command('Runtime.enable');
const layouts = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 820, 1180], ['mobile', 390, 844]]) {
  await navigate('/drive/edge', width, height);
  const state = await evaluate(`({
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    h1Count: document.querySelectorAll('h1').length,
    title: document.title,
    viewport: [window.innerWidth, window.innerHeight],
    heroWidth: Math.round(document.querySelector('.edge-hero')?.getBoundingClientRect().width ?? 0),
    heroHeadingWidth: Math.round(document.querySelector('.edge-hero h1')?.getBoundingClientRect().width ?? 0),
    heroHeadingScrollWidth: document.querySelector('.edge-hero h1')?.scrollWidth ?? 0,
    loadMs: Math.round(performance.getEntriesByType('navigation')[0]?.duration ?? 0),
    transferredKb: Math.round(performance.getEntriesByType('resource').reduce((sum, item) => sum + (item.transferSize || 0), 0) / 1024)
  })`);
  if (state.overflow || state.h1Count !== 1) throw new Error(`${name} layout failed: ${JSON.stringify(state)}`);
  layouts.push({ name, ...state });
  if (screenshotDirectory && (name === 'desktop' || name === 'mobile')) {
    const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    writeFileSync(`${screenshotDirectory}/${name}.png`, Buffer.from(shot.data, 'base64'));
  }
}

await navigate('/drive/edge/install', 1440, 1000);
await evaluate(`document.querySelector('[role="tab"]').focus()`);
await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' });
await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight' });
await wait(150);
const tabState = await evaluate(`({ selected: document.querySelector('[role="tab"][aria-selected="true"]')?.textContent, panel: document.querySelector('[role="tabpanel"]:not([hidden]) h2')?.textContent })`);
if (!tabState.selected?.includes('Synology') || tabState.panel !== 'Synology DSM') throw new Error(`Keyboard tab check failed: ${JSON.stringify(tabState)}`);

const axeResults = [];
for (const path of ['/drive/edge', '/drive/edge/install']) {
  await navigate(path, 1440, 1000);
  const result = await evaluate(`(() => { ${axeSource}; return axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } }).then(r => ({ violations: r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, samples: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })) })); })()`);
  if (result.violations.length) throw new Error(`Accessibility violations on ${path}: ${JSON.stringify(result.violations)}`);
  axeResults.push({ path, violations: 0 });
}

await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await navigate('/drive/edge', 390, 844);
const reducedMotion = await evaluate(`matchMedia('(prefers-reduced-motion: reduce)').matches`);
if (!reducedMotion) throw new Error('Reduced-motion emulation was not applied');

await evaluate(`localStorage.setItem('saasolution-language','ar')`);
await navigate('/drive/edge', 390, 844);
await wait(500);
const arabic = await evaluate(`({ lang: document.documentElement.lang, dir: document.documentElement.dir, hero: document.querySelector('.edge-hero h1')?.innerText })`);
if (arabic.lang !== 'ar' || arabic.dir !== 'rtl' || arabic.hero?.includes('Your files stay available')) throw new Error(`Arabic check failed: ${JSON.stringify(arabic)}`);

await evaluate(`localStorage.setItem('saasolution-language','en')`);
await navigate('/drive/edge', 1440, 1000);
const structuredData = await evaluate(`Array.from(document.querySelectorAll('script[type="application/ld+json"]'), node => JSON.parse(node.textContent)).map(value => value['@type'] ?? value['@graph']?.map(item => item['@type']))`);
const links = await evaluate(`Array.from(document.querySelectorAll('a[href]'), link => link.getAttribute('href'))`);
const internalPaths = [...new Set(links.filter((href) => href?.startsWith('/')).map((href) => href.split('#')[0]))];
for (const path of internalPaths) {
  const response = await fetch(`http://localhost:4173${path}`);
  if (!response.ok) throw new Error(`Broken internal link: ${path} (${response.status})`);
}
if (links.some((href) => /download|releases/i.test(href ?? ''))) throw new Error('A download-like Edge link was found even though no installer is released');

console.log(JSON.stringify({ layouts, tabs: tabState, accessibility: axeResults, reducedMotion, arabic, structuredData, internalLinksChecked: internalPaths }, null, 2));
await command('Browser.close');
