import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock3, Download, HardDrive, ShieldAlert, TerminalSquare } from 'lucide-react';
import { EdgeFooter, EdgeHeader } from '../edge-shell';

export const metadata: Metadata = {
  title: 'SaaSolution Drive Edge Free Beta | 30-Day Guided Pilot',
  description: 'Apply for a free 30-day SaaSolution Drive Edge beta on Linux x86-64, ARM64 or Raspberry Pi OS 64-bit. No card and no automatic charge.',
  alternates: { canonical: '/drive/edge/beta' },
  openGraph: {
    title: 'SaaSolution Drive Edge Free Beta',
    description: 'A guided 30-day pilot for local-first multi-site synchronization through Cubbit.',
    url: '/drive/edge/beta',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SaaSolution Drive product preview' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaSolution Drive Edge Free Beta',
    description: 'A guided 30-day pilot for local-first multi-site synchronization through Cubbit.',
    images: ['/og.png'],
  },
};

const releaseBase = '/drive/edge/beta/0.2.0-beta.1';
const applicationHref = 'mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%2030-day%20beta&body=Organization%3A%0AContact%20name%3A%0ATest%20platform%20and%20architecture%3A%0ANumber%20of%20locations%3A%0AApproximate%20test%20data%20size%3A%0ACubbit%20DS3%20project%20available%3A%20Yes%2FNo%0A%0AI%20understand%20this%20is%20a%20beta%20and%20I%20will%20keep%20an%20independent%20backup%3A%20Yes';

const downloads = [
  {
    architecture: 'Linux x86-64',
    detail: 'Intel and AMD 64-bit servers, mini-PCs and compatible NAS test hosts.',
    file: 'saasolution-drive-edge_0.2.0-beta.1_linux_amd64.tar.gz',
    sha256: 'b96016ecc37f9002b1c7ba5bcbaf4760a8361baac01cc84b309ebd1af783a4dd',
  },
  {
    architecture: 'Linux ARM64',
    detail: '64-bit ARM servers and Raspberry Pi OS 64-bit with reliable external storage.',
    file: 'saasolution-drive-edge_0.2.0-beta.1_linux_arm64.tar.gz',
    sha256: 'ab62842a78a47b1ebe1a281098ec4bb4e3f39bb57090434e8a34e28a4874db33',
  },
] as const;

export default function EdgeBetaPage() {
  return (
    <main className="edge-site edge-beta-site">
      <EdgeHeader active="beta" />

      <section className="edge-beta-hero">
        <div>
          <p className="edge-kicker"><span /> Limited beta · v0.2.0-beta.1</p>
          <h1>Test local-first sync.<em>Free for 30 days.</em></h1>
          <p>Run a guided SaaSolution Drive Edge pilot on Linux x86-64, ARM64 or Raspberry Pi OS 64-bit. No payment method, no automatic charge and no deletion of your local files when the cohort ends.</p>
          <div className="edge-beta-actions">
            <a className="primary-button" href={applicationHref}>Apply for the free beta <span>↗</span></a>
            <a className="text-link" href="#downloads">View signed downloads <span>↓</span></a>
          </div>
        </div>
        <aside className="edge-beta-offer" aria-label="Beta offer summary">
          <span>Guided cohort</span>
          <strong>30</strong><small>days free</small>
          <ul><li><CheckCircle2 /> No card required</li><li><CheckCircle2 /> Manual onboarding</li><li><CheckCircle2 /> Best-effort beta support</li></ul>
        </aside>
      </section>

      <section className="edge-beta-safety">
        <div><ShieldAlert /><p><b>Use test data or keep a verified independent backup.</b> Edge beta is synchronization software, not an immutable backup and not yet covered by a production SLA.</p></div>
        <Link href="/drive/edge/install">Read the installation and recovery guide <span>→</span></Link>
      </section>

      <section className="edge-beta-fit">
        <div className="edge-section-heading"><p className="edge-kicker">Who this beta is for</p><h2>A real pilot.<br /><em>A controlled scope.</em></h2><span>We are accepting small technical cohorts so every installation has a named operator and a recoverable test plan.</span></div>
        <div className="edge-beta-fit-grid">
          <article><HardDrive /><h3>Two-site evaluation</h3><p>Organizations testing a dedicated share across one or two locations with a versioned Cubbit DS3 bucket.</p></article>
          <article><TerminalSquare /><h3>Technical operator</h3><p>A Linux-capable administrator who can manage service permissions, storage paths and privacy-safe diagnostics.</p></article>
          <article><Clock3 /><h3>Thirty-day feedback cycle</h3><p>Participants who can test outage recovery, conflict preservation and restart behavior during the cohort.</p></article>
        </div>
      </section>

      <section className="edge-beta-downloads" id="downloads">
        <div className="edge-section-heading light"><p className="edge-kicker">Signed beta packages</p><h2>Download the build.<br /><em>Onboard with us.</em></h2><span>The binaries are public for inspection. Synchronization requires accepted beta onboarding, a dedicated test bucket and node-specific credentials.</span></div>
        <div className="edge-beta-download-grid">
          {downloads.map((download) => (
            <article key={download.architecture}>
              <div><span>v0.2.0-beta.1</span><Download aria-hidden="true" /></div>
              <h3>{download.architecture}</h3>
              <p>{download.detail}</p>
              <code title={download.sha256}>SHA-256 · {download.sha256.slice(0, 16)}…</code>
              <a href={`${releaseBase}/${download.file}`} download>Download signed archive <span>↓</span></a>
            </article>
          ))}
        </div>
        <div className="edge-beta-verification">
          <div><h3>Verify before installation</h3><p>Download the checksum list, its Ed25519 signature and the public release key. The setup tool refuses to overwrite an existing installation and never accepts permanent secrets as command arguments.</p></div>
          <div><a href={`${releaseBase}/SHA256SUMS`} download>SHA256SUMS</a><a href={`${releaseBase}/SHA256SUMS.sig`} download>Signature</a><a href={`${releaseBase}/RELEASE-PUBLIC-KEY.txt`} download>Public key</a><a href={`${releaseBase}/release.json`} download>Release metadata</a></div>
        </div>
      </section>

      <section className="edge-beta-steps">
        <div><p className="edge-kicker">How access works</p><h2>Four steps to a<br /><em>measured beta.</em></h2></div>
        <ol>
          <li><span>01</span><div><h3>Apply</h3><p>Tell us your platform, locations, approximate test size and whether you already have a Cubbit DS3 project.</p></div></li>
          <li><span>02</span><div><h3>Plan the test</h3><p>We confirm the supported architecture, backup, authoritative first site and beta end date.</p></div></li>
          <li><span>03</span><div><h3>Onboard securely</h3><p>You receive node-scoped values. The local setup tool generates protected encryption and management secrets on your host.</p></div></li>
          <li><span>04</span><div><h3>Run and review</h3><p>Test outage recovery, restart, conflicts and offboarding. There is no automatic charge after day 30.</p></div></li>
        </ol>
      </section>

      <section className="edge-final-cta">
        <p>SaaSolution Drive Edge · Limited free beta</p><h2>Bring one safe test share.<br /><em>We’ll guide the pilot.</em></h2>
        <div><a className="light-button" href={applicationHref}>Apply for 30 days free <span>↗</span></a><Link href="/drive/edge">Review Edge first</Link></div>
      </section>
      <EdgeFooter />
    </main>
  );
}
