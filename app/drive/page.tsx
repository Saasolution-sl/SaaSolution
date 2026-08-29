import Image from 'next/image';
import Link from 'next/link';
import { DriveLanguageSwitcher } from '../i18n/language-provider';
import { DownloadOptions } from './download-options';

function DriveIcon({ size = 34 }: { size?: number }) {
  return (
    <Image
      className="drive-app-icon"
      src="/windows-app-icon.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

function StoreBadges() {
  return (
    <div className="store-group" aria-label="Mobile app availability">
      <p>Mobile releases in preparation</p>
      <div className="store-badges">
        <span className="store-badge apple" aria-label="Coming to the Apple App Store">
          <Image src="/download-on-app-store.svg" alt="Download on the App Store" width={120} height={40} priority />
        </span>
        <span className="store-badge google" aria-label="Coming to Google Play">
          <Image src="/get-it-on-google-play.png" alt="Get it on Google Play" width={155} height={60} priority />
        </span>
        <span className="store-badge huawei" aria-label="Coming to Huawei AppGallery">
          <Image src="/huawei-appgallery-badge.png" alt="Explore it on Huawei AppGallery" width={800} height={240} priority />
        </span>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="product-preview" aria-label="SaaSolution Drive product preview">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="desktop-card">
        <div className="desktop-topbar">
          <div className="mini-brand"><DriveIcon size={25} /><span>SaaSolution Drive</span></div>
          <div className="avatar">OS</div>
        </div>
        <div className="desktop-body">
          <aside>
            <span className="side-active">Files</span>
            <span>Shared</span>
            <span>Activity</span>
          </aside>
          <div className="file-panel">
            <div className="panel-heading"><strong>My files</strong><span>12 items</span></div>
            <div className="storage-card">
              <div><small>Storage used</small><strong>18.4 GB</strong></div>
              <span>of 100 GB</span>
              <div className="progress"><i /></div>
            </div>
            <div className="files">
              <span><i className="file-icon mint" /><b>Documents</b><small>24 files</small></span>
              <span><i className="file-icon lime" /><b>Phone backups</b><small>8 files</small></span>
              <span><i className="file-icon blue" /><b>Photos</b><small>146 files</small></span>
            </div>
          </div>
        </div>
      </div>
      <div className="phone-card">
        <div className="phone-speaker" />
        <div className="phone-header">
          <div className="phone-brand"><DriveIcon size={20} /><b>SaaSolution Drive</b></div>
          <div className="phone-welcome"><span>Good morning</span><b>Olivia</b></div>
        </div>
        <div className="phone-usage"><small>Your storage</small><strong>18.4 <em>GB</em></strong><div className="progress"><i /></div><span>100 GB total</span></div>
        <div className="phone-section"><b>Recent</b><span>See all</span></div>
        <div className="phone-files">
          <div><i className="file-icon mint" /><span><b>Brand assets</b><small>Updated just now</small></span></div>
          <div><i className="file-icon lime" /><span><b>Signal backup</b><small>Today, 08:40</small></span></div>
          <div><i className="file-icon blue" /><span><b>Project notes</b><small>Yesterday</small></span></div>
        </div>
        <div className="phone-nav"><b>Files</b><span>Shared</span><span>Account</span></div>
      </div>
      <div className="sync-chip"><span>✓</span><div><b>Backup complete</b><small>Secured just now</small></div></div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="wordmark drive-wordmark" href="#top" aria-label="SaaSolution Drive home"><DriveIcon /><span>SaaSolution Drive</span></a>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <a href="#product">Product</a>
          <a href="#privacy">Privacy</a>
          <a href="#availability">Availability</a>
        </div>
        <div className="drive-nav-actions">
          <DriveLanguageSwitcher />
          <a className="nav-cta" href="#availability">Get the app <span>↗</span></a>
        </div>
      </nav>
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Product preview · SaaSolution Drive</div>
          <h1>Your files.<br /><em>Quietly protected.</em></h1>
          <p className="hero-lede">A private cloud-drive experience for files, photos and messaging backups—designed by SaaSolutions in Spain for the devices you use every day.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#product">Explore Drive <span>→</span></a>
            <a className="text-link" href="#privacy"><span className="play-dot">▶</span> See how privacy works</a>
          </div>
          <StoreBadges />
        </div>
        <ProductPreview />
      </section>

      <section className="trust-strip" aria-label="Product principles">
        <p>One calm place for the files that matter.</p>
        <div>
          <span><i>01</i> Provider-neutral</span>
          <span><i>02</i> Privacy-focused</span>
          <span><i>03</i> Built for every screen</span>
        </div>
      </section>

      <section className="product-section" id="product">
        <div className="section-intro">
          <p className="section-kicker">One drive. Less noise.</p>
          <h2>The cloud should feel<br /><em>this simple.</em></h2>
          <p>Files, device backups and everyday sharing brought into one uncluttered experience—with the storage layer kept flexible underneath.</p>
        </div>
        <div className="feature-stage">
          <article className="feature-card feature-main">
            <span className="feature-number">01</span>
            <div className="backup-art" aria-hidden="true">
              <div className="backup-ring ring-a" /><div className="backup-ring ring-b" />
              <div className="backup-phone"><div className="backup-phone-brand"><DriveIcon size={25} /><b>SaaSolution Drive</b></div><span>08:40</span><b>Backup complete</b><small>Signal · 2.4 GB</small><i>✓</i></div>
            </div>
            <div><p>Messaging backups</p><h3>Keep your exports<br />close, not complicated.</h3><span>Select app-created folders and keep scheduled snapshots organised in one place.</span></div>
          </article>
          <article className="feature-card feature-side">
            <span className="feature-number">02</span>
            <div className="provider-art" aria-hidden="true"><span>S3</span><i /><span>YOU</span><i /><span>DRIVE</span></div>
            <div><p>Storage freedom</p><h3>Your provider.<br />Your choice.</h3><span>A provider-neutral foundation designed to keep storage and the app experience independent.</span></div>
          </article>
        </div>
      </section>

      <section className="privacy-section" id="privacy">
        <div className="privacy-heading">
          <p className="section-kicker">Privacy without theatre</p>
          <h2>Built around what we<br /><em>don’t need to know.</em></h2>
        </div>
        <div className="privacy-grid">
          <article><span className="icon-box">⌁</span><h3>Credentials stay protected</h3><p>Storage credentials are designed for platform-protected vaults, not plain-text configuration.</p><small>Platform key protection</small></article>
          <article><span className="icon-box">◎</span><h3>Access on your terms</h3><p>Optional location-aware unlock is an extra authorization condition—not your encryption key.</p><small>Account recovery preserved</small></article>
          <article><span className="icon-box">↗</span><h3>Only the folder you choose</h3><p>Android’s system folder picker keeps consent explicit and limited to the folders you select.</p><small>No private app databases</small></article>
        </div>
      </section>

      <section className="availability-section" id="availability">
        <div className="availability-copy">
          <p className="section-kicker">Download SaaSolution Drive</p>
          <h2>One experience.<br /><em>Everywhere you work.</em></h2>
          <p>Choose your platform to see its download channel, minimum requirements and installation options. Mobile downloads include a QR code so you can continue directly on your phone or tablet.</p>
        </div>
        <DownloadOptions />
      </section>

      <section className="final-cta">
        <span className="cta-orbit" aria-hidden="true" />
        <p>Built by SaaSolutions SL · Ceuta, Spain</p>
        <h2>Private cloud storage.<br /><em>Made pleasantly simple.</em></h2>
        <a className="light-button" href="mailto:hello@saasolution.es">Talk to SaaSolutions <span>↗</span></a>
      </section>

      <footer className="drive-footer">
        <a className="wordmark drive-wordmark footer-brand" href="#top"><DriveIcon /><span>SaaSolution Drive</span></a>
        <p>SaaSolution Drive is a product preview. Store availability and production storage connections are in development. It is not an official Cubbit application and does not imply a commercial partnership.</p>
        <div><a href="/drive/privacy">Privacy</a><a href="/drive/terms">Terms &amp; Conditions</a><a href="https://www.saasolution.es/" target="_blank" rel="noreferrer">SaaSolution.es</a><a href="mailto:hello@saasolution.es">Contact</a></div>
        <small>Apple and the Apple logo are trademarks of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC. HUAWEI and AppGallery are trademarks of Huawei Technologies Co., Ltd.</small>
      </footer>
    </main>
  );
}
