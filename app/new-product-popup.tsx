'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Bump the key when the featured product changes so returning visitors see the new one once.
const STORAGE_KEY = 'saasolution-new-product-rsvip-online';
const SHOW_DELAY_MS = 1500;

export function NewProductPopup() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage blocked: still show it once per page load.
    }
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="np-overlay" onClick={dismiss}>
      <div className="np-card" role="dialog" aria-modal="true" aria-labelledby="np-title" onClick={(event) => event.stopPropagation()}>
        <div className="np-image">
          <span className="np-badge">New product</span>
          <button type="button" className="np-close" onClick={dismiss} aria-label="Close" ref={closeButton}>×</button>
          <Image src="/rsvip/og.png" alt="RSViP Online" fill sizes="460px" style={{ objectFit: 'cover' }} />
        </div>
        <div className="np-body">
          <small>Just launched by SaaSolutions</small>
          <h2 id="np-title">RSViP Online</h2>
          <p>Scheduling software that stays yours. Booking pages, calendar sync, video rooms and automated emails, built and run by SaaSolutions.</p>
          <div className="np-actions">
            <a href="https://rsviponline.com" target="_blank" rel="noopener" onClick={dismiss}>Visit RSViP Online ↗</a>
            <button type="button" onClick={dismiss}>Maybe later</button>
          </div>
        </div>
      </div>
    </div>
  );
}
