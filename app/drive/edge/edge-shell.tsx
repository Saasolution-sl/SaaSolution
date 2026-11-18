import Image from 'next/image';
import Link from 'next/link';
import { DriveLanguageSwitcher } from '../../i18n/language-provider';

export function EdgeIcon({ size = 34 }: { size?: number }) {
  return <Image className="drive-app-icon" src="/windows-app-icon.png" alt="" width={size} height={size} aria-hidden="true" />;
}

export function EdgeHeader({ active = 'overview' }: { active?: 'overview' | 'install' | 'beta' }) {
  return (
    <header className="edge-header">
      <Link className="wordmark drive-wordmark" href="/drive" aria-label="Back to SaaSolution Drive">
        <EdgeIcon /><span>SaaSolution Drive</span>
      </Link>
      <nav className="edge-nav-links" aria-label="SaaSolution Drive Edge navigation">
        <Link className={active === 'overview' ? 'active' : ''} href="/drive/edge">Edge overview</Link>
        <Link className={active === 'beta' ? 'active' : ''} href="/drive/edge/beta">Free beta</Link>
        <Link className={active === 'install' ? 'active' : ''} href="/drive/edge/install">Installation</Link>
        <Link href="/drive/edge#platforms">Platforms</Link>
        <Link href="/drive/edge#security">Security</Link>
        <Link href="/drive/edge#faq">FAQ</Link>
      </nav>
      <div className="edge-header-actions">
        <DriveLanguageSwitcher compact />
        <Link className="edge-header-cta" href="/drive/edge/beta">Join free beta <span>↗</span></Link>
      </div>
    </header>
  );
}

export function EdgeFooter() {
  return (
    <footer className="edge-footer">
      <div className="edge-footer-lead">
        <Link className="wordmark drive-wordmark" href="/drive/edge"><EdgeIcon /><span>SaaSolution Drive Edge</span></Link>
        <p>Local network storage that keeps working when the internet does not.</p>
      </div>
      <div className="edge-footer-links">
        <section><h3>Product</h3><Link href="/drive">SaaSolution Drive</Link><Link href="/drive/edge">Edge overview</Link><Link href="/drive/edge/beta">Free 30-day beta</Link><Link href="/drive/edge/install">Installation guide</Link><Link href="/drive/edge#platforms">Supported platforms</Link></section>
        <section><h3>Learn</h3><Link href="/drive/edge#how-it-works">How it works</Link><Link href="/drive/edge#conflicts">Conflict resolution</Link><Link href="/drive/edge#security">Security</Link><Link href="/drive/edge#faq">Frequently asked questions</Link></section>
        <section><h3>Company</h3><Link href="/">SaaSolutions home</Link><a href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20enterprise%20deployment">Enterprise enquiry</a><a href="mailto:hello@saasolution.es">Contact SaaSolution</a><Link href="/drive/privacy">Privacy</Link></section>
      </div>
      <div className="edge-footer-bottom">
        <small>© 2026 SaaSolutions SL · Ceuta, Spain</small>
        <span>Edge v0.2.0-beta.1 is a limited technical beta. It is not a production backup service and has no uptime or recovery SLA.</span>
      </div>
    </footer>
  );
}
