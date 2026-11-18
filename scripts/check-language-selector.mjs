import WebSocket from 'ws';

const pages = await fetch('http://localhost:9233/json/list').then((response) => response.json());
const page = pages.find((item) => item.type === 'page' && item.url === 'http://localhost:4173/');
if (!page) throw new Error('SaaSolutions page was not found in the browser');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.once('open', resolve);
  socket.once('error', reject);
});

let sequence = 0;
const pending = new Map();
socket.on('message', (raw) => {
  const message = JSON.parse(raw.toString());
  if (!message.id) return;
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) {
    request.reject(new Error(message.error.message));
  } else {
    request.resolve(message.result);
  }
});

function command(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

await command('Runtime.enable');
await evaluate(`localStorage.setItem('saasolution-language', 'en'); location.reload()`);
await wait(1200);

const checks = [
  ['English', 'en', 'ltr', 'About'],
  ['Español', 'es', 'ltr', 'Acerca de'],
  ['Nederlands', 'nl', 'ltr', 'Info'],
  ['العربية', 'ar', 'rtl', 'من نحن'],
  ['Português', 'pt', 'ltr', 'Sobre'],
  ['Français', 'fr', 'ltr', 'À propos'],
  ['Deutsch', 'de', 'ltr', 'Über'],
];

const results = [];
for (const [title, locale, direction, expectedText] of checks) {
  const clicked = await evaluate(`(() => { const button = document.querySelector('.drive-language button[title=${JSON.stringify(title)}]'); if (!button) return false; button.click(); return true; })()`);
  if (!clicked) throw new Error(`Language button not found: ${title}`);
  await wait(500);
  const state = await evaluate(`(() => { const navText = document.querySelector('.company-nav nav')?.textContent ?? ''; return { lang: document.documentElement.lang, dir: document.documentElement.dir, translated: navText.includes(${JSON.stringify(expectedText)}), navText }; })()`);
  results.push({ locale, ...state });
  if (state.lang !== locale || state.dir !== direction || !state.translated) {
    throw new Error(`Language check failed: ${JSON.stringify({ locale, state })}`);
  }
}

await evaluate(`document.querySelector('.drive-language button[title="العربية"]').click()`);
await wait(500);
const arabic = await evaluate(`(() => { const text = document.querySelector('main').innerText; return {
  hasHero: text.includes('شركة برمجيات وأتمتة تعتمد الذكاء الاصطناعي أولاً'),
  hasProjects: text.includes('عرض المشاريع'),
  hasFooter: text.includes('ملفات تعريف الارتباط'),
  hasOldEnglish: text.includes('Project showcase') || text.includes('AI-first software & automation company')
}; })()`);
if (!arabic.hasHero || !arabic.hasProjects || !arabic.hasFooter || arabic.hasOldEnglish) {
  throw new Error(`Arabic page audit failed: ${JSON.stringify(arabic)}`);
}

console.log(JSON.stringify({ results, arabic }, null, 2));
await command('Browser.close');
