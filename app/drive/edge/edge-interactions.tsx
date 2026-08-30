'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { troubleshootingEntries } from './edge-data';

export type InstallPlatform = {
  id: string;
  name: string;
  status: 'Planned' | 'Not yet supported';
  introduction: string;
  steps: string[];
  note?: string;
};

export function InstallTabs({ platforms }: { platforms: InstallPlatform[] }) {
  const [active, setActive] = useState(platforms[0]?.id ?? '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  function moveFocus(index: number) {
    const normalized = (index + platforms.length) % platforms.length;
    const platform = platforms[normalized];
    if (!platform) return;
    setActive(platform.id);
    tabRefs.current[normalized]?.focus();
  }

  return (
    <div className="install-tabs">
      <div className="install-tablist" role="tablist" aria-label="Edge installation platforms">
        {platforms.map((platform, index) => (
          <button
            key={platform.id}
            ref={(node) => { tabRefs.current[index] = node; }}
            id={`${baseId}-tab-${platform.id}`}
            type="button"
            role="tab"
            aria-selected={active === platform.id}
            aria-controls={`${baseId}-panel-${platform.id}`}
            tabIndex={active === platform.id ? 0 : -1}
            onClick={() => setActive(platform.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') { event.preventDefault(); moveFocus(index + 1); }
              if (event.key === 'ArrowLeft') { event.preventDefault(); moveFocus(index - 1); }
              if (event.key === 'Home') { event.preventDefault(); moveFocus(0); }
              if (event.key === 'End') { event.preventDefault(); moveFocus(platforms.length - 1); }
            }}
          >
            <span>{platform.name}</span><small>{platform.status}</small>
          </button>
        ))}
      </div>
      <div className="install-tabpanels">
        {platforms.map((platform) => (
          <section
            key={platform.id}
            id={`${baseId}-panel-${platform.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${platform.id}`}
            hidden={active !== platform.id}
            tabIndex={0}
          >
            <div className="install-panel-heading">
              <div><p>Platform guide</p><h2>{platform.name}</h2></div>
              <span className={`edge-status ${platform.status === 'Planned' ? 'planned' : 'unsupported'}`}>{platform.status}</span>
            </div>
            <p className="install-panel-intro">{platform.introduction}</p>
            <ol className="install-steps">
              {platform.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}
            </ol>
            {platform.note && <p className="install-note"><b>Release boundary</b>{platform.note}</p>}
            <a className="edge-inline-cta" href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20platform%20access">Request platform access <span>↗</span></a>
          </section>
        ))}
      </div>
    </div>
  );
}

export function CopyBlock({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="edge-code-block" data-i18n-skip>
      <span>{label}</span>
      <pre dir="ltr"><code>{value}</code></pre>
      <button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy command'}</button>
    </div>
  );
}

export function TroubleshootingSearch() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return troubleshootingEntries;
    return troubleshootingEntries.filter(([title, body]) => `${title} ${body}`.toLocaleLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="troubleshooting-tool">
      <label htmlFor="edge-troubleshooting-search">Search troubleshooting</label>
      <input
        id="edge-troubleshooting-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try “pairing”, “permissions” or “pending”"
      />
      <p className="troubleshooting-count" aria-live="polite">{filtered.length} guidance entries</p>
      <div className="troubleshooting-results">
        {filtered.map(([title, body]) => <details key={title}><summary>{title}<span>+</span></summary><p>{body}</p></details>)}
        {filtered.length === 0 && <p className="troubleshooting-empty">No matching guidance. Contact SaaSolution without including secrets, access keys, encryption keys or recovery codes.</p>}
      </div>
    </div>
  );
}
