import Link from 'next/link';
import {
  ArchiveRestore,
  Building2,
  Cable,
  CloudCog,
  DatabaseZap,
  FolderSync,
  Gauge,
  History,
  Network,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { EdgeFooter, EdgeHeader } from './edge-shell';
import { edgeFaqs, edgePlatforms } from './edge-data';

const benefits = [
  [Gauge, 'Fast local access', 'People work from the local network drive instead of waiting on the internet for every file.'],
  [Cable, 'Outage continuity', 'Existing authorized local files remain available while the internet connection is interrupted.'],
  [CloudCog, 'Cubbit synchronization', 'Approved folders synchronize through Cubbit when the connection is available.'],
  [Building2, 'Multiple locations', 'Connect offices around one governed folder set while each site keeps its own operational copy.'],
  [FolderSync, 'Automatic recovery', 'Durably queued changes resume after connectivity returns, without clearing the local work queue.'],
  [History, 'Version history', 'Retained revisions support comparison, explicit conflict resolution and recovery workflows.'],
  [ShieldCheck, 'Safe conflicts', 'Concurrent edits are preserved and brought to an administrator instead of silently overwriting a file.'],
  [SlidersHorizontal, 'Selective folders', 'Assign only approved roots, with schedules and bandwidth controls designed for each location.'],
  [Network, 'x86-64 and ARM64 plan', 'The agent architecture targets both common server architectures; public builds are not released yet.'],
  [ServerCog, 'Central administration', 'The planned control plane shows node health, pending work, conflicts and revocable enrollment.'],
  [DatabaseZap, 'Durable local journal', 'Every local mutation is recorded before it is eligible for remote publication.'],
  [ArchiveRestore, 'Recovery support', 'Version retention and safeguards for large changes are designed to assist ransomware recovery.'],
] as const;

const flow = [
  ['01', 'Work locally', 'Employees open and save files on the NAS over the LAN.'],
  ['02', 'Record safely', 'The Edge Agent records changes in a durable local journal.'],
  ['03', 'Synchronize online', 'Approved changes synchronize securely through Cubbit when online.'],
  ['04', 'Update other sites', 'Other connected locations receive and validate the updated files.'],
  ['05', 'Continue offline', 'During an outage, each authorized local drive remains usable.'],
  ['06', 'Recover automatically', 'Pending journal operations resume after the connection returns.'],
  ['07', 'Resolve concurrency', 'Concurrent edits create a recoverable request for review.'],
];

export default function EdgePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: edgeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Product', 'SoftwareApplication'],
        name: 'SaaSolution Drive Edge',
        description: 'Local network storage for multiple locations that remains available during an internet outage, with planned synchronization through Cubbit.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'NAS platforms running Linux (planned)',
        brand: { '@type': 'Brand', name: 'SaaSolutions' },
        url: 'https://saasolution.es/drive/edge',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'SaaSolutions', item: 'https://saasolution.es/' },
          { '@type': 'ListItem', position: 2, name: 'SaaSolution Drive', item: 'https://saasolution.es/drive' },
          { '@type': 'ListItem', position: 3, name: 'SaaSolution Drive Edge', item: 'https://saasolution.es/drive/edge' },
        ],
      },
    ],
  };

  return (
    <main className="edge-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EdgeHeader />

      <section className="edge-hero" id="top">
        <div className="edge-hero-copy">
          <p className="edge-kicker"><span /> SaaSolution Drive Edge</p>
          <h1>Your files stay available.<em>Even when the internet doesn’t.</em></h1>
          <p className="edge-hero-lede">SaaSolution Drive Edge gives every office a local network drive that works at LAN speed. Connect multiple locations through Cubbit, continue working offline and synchronize changes automatically when the connection returns.</p>
          <p className="edge-release-note"><b>Engineering preview</b> Public installers and production enrollment are not available yet.</p>
          <div className="edge-hero-actions">
            <a className="primary-button" href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20early%20access">Request early access <span>↗</span></a>
            <a className="text-link" href="#how-it-works">See how locations stay in sync <span>↓</span></a>
          </div>
        </div>

        <div className="edge-network-visual" role="img" aria-label="Location A and Location B each keep a local NAS while Cubbit synchronizes approved changes; Location B remains locally available while its internet connection is offline">
          <div className="edge-network-backdrop"><i /><i /><i /></div>
          <article className="edge-site-node location-a">
            <div><span className="node-light online" />Location A <small>Connected</small></div>
            <b>Madrid office</b>
            <span className="nas-device"><i /><i /><i /><strong>Local NAS</strong></span>
            <p>12 local users · LAN access active</p>
          </article>
          <article className="edge-cubbit-node">
            <span>C</span><div><small>Secure sync layer</small><b>Cubbit</b><em>Approved folders</em></div>
          </article>
          <article className="edge-site-node location-b">
            <div><span className="node-light offline" />Location B <small>Internet offline</small></div>
            <b>Ceuta office</b>
            <span className="nas-device"><i /><i /><i /><strong>Local NAS</strong></span>
            <p>8 local users · LAN access active</p>
          </article>
          <div className="edge-sync-line line-a"><span>Changes sync when online</span></div>
          <div className="edge-sync-line line-b offline"><span>4 changes safely queued</span></div>
        </div>
      </section>

      <section className="edge-intro-band">
        <p>Local network storage for every location</p>
        <h2>Local speed for the working day.<br /><em>A governed path between offices.</em></h2>
        <div><span>Every office keeps a fast local network drive.</span><span>Synchronization resumes as soon as connectivity is available.</span></div>
      </section>

      <section className="edge-benefits" id="benefits">
        <div className="edge-section-heading"><p className="edge-kicker">Business continuity, made practical</p><h2>Built for the places<br /><em>where work happens.</em></h2><span>Plain business benefits first, with the implementation boundaries made visible.</span></div>
        <div className="edge-benefit-grid">
          {benefits.map(([Icon, title, description], index) => (
            <article key={title}><div><span>{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
      </section>

      <section className="edge-flow" id="how-it-works">
        <div className="edge-section-heading light"><p className="edge-kicker">How it works</p><h2>Online when possible.<br /><em>Operational either way.</em></h2><span>The synchronization flow remains understandable without motion or scripting.</span></div>
        <div className="edge-flow-grid">
          {flow.map(([number, title, description]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}
        </div>
      </section>

      <section className="edge-connection-compare" id="offline">
        <article className="online-card"><div><span className="node-light online" />Online</div><h2>Connected sites keep moving together.</h2><ul><li>Changes synchronize shortly after they happen</li><li>Advisory file locking</li><li>Changes uploaded through Cubbit</li><li>Other locations receive updates</li><li>Version history created</li></ul></article>
        <article className="offline-card"><div><span className="node-light offline" />Offline</div><h2>The local working day continues.</h2><ul><li>Local drive remains available</li><li>LAN access continues</li><li>Changes are safely queued</li><li>No cloud connection needed for existing local access</li><li>Synchronization resumes automatically later</li></ul></article>
      </section>

      <section className="edge-conflicts" id="conflicts">
        <div className="edge-section-heading"><p className="edge-kicker">Conflict resolution</p><h2>No silent<br /><em>overwrites.</em></h2><span>When two disconnected locations change the same file, Edge preserves both revisions and asks for an explicit decision.</span></div>
        <div className="conflict-card">
          <div className="conflict-card-top"><div><small>Conflict requires attention</small><h3>Customer-contract.docx</h3></div><span>2 versions preserved</span></div>
          <div className="conflict-versions">
            <article><span>A</span><div><b>Location A</b><p>Edited by Othman at 14:32</p><small>2.4 MB · Madrid office</small></div></article>
            <article><span>B</span><div><b>Location B</b><p>Edited by Yasmina at 14:41</p><small>2.5 MB · Ceuta office</small></div></article>
          </div>
          <div className="conflict-actions" aria-label="Conflict resolution preview"><button type="button">Keep A</button><button type="button">Keep B</button><button type="button">Keep both</button><button type="button">Download both</button></div>
          <p><b>Binary file safeguard</b> Word, Excel, PDF, image, video and other binary files are not automatically merged. Text files may be merged only when it is safe. Every resolution remains recoverable through version history.</p>
        </div>
      </section>

      <section className="edge-platforms" id="platforms">
        <div className="edge-section-heading light"><p className="edge-kicker">Supported systems</p><h2>Honest platform<br /><em>status.</em></h2><span>The codebase contains an early Go foundation, but no signed public package or production enrollment service. Nothing is labelled available or beta yet.</span></div>
        <div className="edge-platform-grid">
          {edgePlatforms.map((platform) => <article key={platform.id}><div><h3>{platform.name}</h3><span className={`edge-status ${platform.status === 'Planned' ? 'planned' : 'unsupported'}`}>{platform.status}</span></div><p>{platform.detail}</p></article>)}
        </div>
        <div className="edge-platform-actions"><Link className="light-button" href="/drive/edge/install">View installation guide <span>→</span></Link><a href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20platform%20notification">Notify me about platform releases</a></div>
      </section>

      <section className="edge-security" id="security">
        <div className="edge-security-heading">
          <p className="edge-kicker">Security and privacy</p>
          <h2>Access only where<br /><em>it belongs.</em></h2>
          <p>Data remains available at each authorized location. Planned synchronization uses Cubbit storage, encrypted connections, a separate identity for every node and folder permissions limited to the organization.</p>
        </div>
        <div className="edge-security-list">
          <article><span>01</span><div><h3>Separate node identities</h3><p>Every enrolled node receives its own revocable identity. Pairing codes expire quickly, and permanent secrets never belong in installation commands.</p></div></article>
          <article><span>02</span><div><h3>Clear audit history</h3><p>File changes, enrollment actions and conflict decisions remain attributable without exposing filenames or secrets in routine diagnostics.</p></div></article>
          <article><span>03</span><div><h3>Recovery with clear limits</h3><p>Version history helps with recovery, but synchronization is not an immutable backup. Optional retention controls depend on the selected deployment design.</p></div></article>
        </div>
      </section>

      <section className="edge-plans" id="plans">
        <div><p>Plans and licensing</p><h2>Deployment flexibility, without invented pricing.</h2></div>
        <div className="edge-plan-card"><span>Business &amp; Enterprise</span><h3>Edge node licence required</h3><p>Cloud synchronization · Works offline · Multiple locations · Edge hosted on your own systems · Enterprise support options</p><a href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20enterprise%20deployment">Request enterprise deployment assistance <span>↗</span></a></div>
      </section>

      <section className="edge-faq" id="faq">
        <div className="edge-section-heading"><p className="edge-kicker">Frequently asked questions</p><h2>Clear answers before<br /><em>deployment.</em></h2><span>Current product boundaries are part of the documentation, not hidden in a footnote.</span></div>
        <div className="edge-faq-list">{edgeFaqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <section className="edge-final-cta">
        <p>SaaSolution Drive Edge · Engineering preview</p><h2>Bring local continuity<br /><em>to every location.</em></h2>
        <div><Link className="light-button" href="/drive/edge/install">View installation guide <span>→</span></Link><a href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20early%20access">Join the Edge early access list <span>↗</span></a></div>
      </section>
      <EdgeFooter />
    </main>
  );
}
