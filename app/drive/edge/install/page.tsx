import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyBlock, InstallTabs, TroubleshootingSearch, type InstallPlatform } from '../edge-interactions';
import { EdgeFooter, EdgeHeader } from '../edge-shell';

export const metadata: Metadata = {
  title: 'Install SaaSolution Drive Edge | Platform Guide',
  description: 'Prepare, pair and operate SaaSolution Drive Edge across Docker and planned NAS platforms. Current release boundaries are clearly identified.',
  alternates: { canonical: '/drive/edge/install' },
  openGraph: {
    title: 'Install SaaSolution Drive Edge | Platform Guide',
    description: 'Preparation, pairing, multi-site rollout and troubleshooting for SaaSolution Drive Edge.',
    url: '/drive/edge/install',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SaaSolution Drive product preview' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Install SaaSolution Drive Edge | Platform Guide',
    description: 'Preparation, pairing, multi-site rollout and troubleshooting for SaaSolution Drive Edge.',
    images: ['/og.png'],
  },
};

const dockerCompose = `services:
  edge:
    image: \${SAASOLUTION_EDGE_IMAGE:?Supplied to approved beta participants}
    restart: unless-stopped
    user: "\${EDGE_UID:-1000}:\${EDGE_GID:-1000}"
    volumes:
      - ./edge-data:/var/lib/saasolution-edge
      - /srv/company-share:/data/company
    ports:
      - "127.0.0.1:\${EDGE_SETUP_PORT:-8090}:8090"
    environment:
      EDGE_CONFIG: /var/lib/saasolution-edge/config.json`;

const platforms: InstallPlatform[] = [
  {
    id: 'docker', name: 'Docker', status: 'Planned',
    introduction: 'Docker is the first intended packaging route, but no signed public image reference is available. Approved testers will receive an image reference and checksum through the early-access programme.',
    steps: [
      'Install a supported Docker Engine and Compose release on a 64-bit x86 or ARM host. Final minimum versions will follow release validation.',
      'Create a dedicated non-root service account and an Edge data directory that is separate from the synchronized business folder.',
      'Mount the host’s approved SMB/NFS backing folder into the container. The NAS remains responsible for serving that folder to local users.',
      'Bind the local setup port to loopback or a trusted administration network only. Never expose an unauthenticated setup surface to the public internet.',
      'Place the beta image reference in an environment file supplied to the host administrator. Do not place Cubbit credentials or permanent node secrets in Compose.',
      'Start the container, open the local setup address shown in its logs and complete the short-lived pairing flow.',
      'Select the local synchronization root, run validation and start the first synchronization only after confirming which location is authoritative.',
      'Verify health, journal status, available disk reserve and a small test file before enabling production access at a new location.',
      'For an update, pause the node, verify the signed release reference, pull the approved image and recreate the container without deleting the Edge data volume.',
      'For a safe uninstall, pause and revoke the node, confirm all pending operations are resolved, remove the container and retain data until recovery requirements are confirmed.',
    ],
    note: 'The Compose pattern below intentionally requires an image reference supplied to approved testers. It is not a public download link.',
  },
  {
    id: 'synology', name: 'Synology DSM', status: 'Not yet supported',
    introduction: 'No DSM version or Synology package has been validated. These steps describe the planned Container Manager route and must not be treated as production support.',
    steps: [
      'Wait for SaaSolution to publish the tested DSM and Container Manager version matrix.',
      'Install Container Manager from Synology Package Center after checking the model’s architecture.',
      'Create or select a shared folder and preserve a verified backup before first synchronization.',
      'Grant the dedicated container account access only to the approved share and a separate Edge data folder.',
      'Deploy the signed Edge container image supplied through the approved release channel.',
      'Pair the node with a short-lived code and assign the approved Cubbit-backed folder.',
      'Configure SMB or NFS through DSM File Services; Edge does not replace Synology’s native sharing controls.',
      'Validate health, storage reserve, pending operations and a small test file.',
      'Use Container Manager to update only after pausing the node; keep the data volume during recreation.',
      'Before removal, revoke the node and verify that other sites hold the expected files and version history.',
    ],
  },
  {
    id: 'qnap', name: 'QNAP QTS/QuTS', status: 'Not yet supported',
    introduction: 'No QTS or QuTS hero version has been validated and no Container Station template has been released.',
    steps: [
      'Wait for a published QTS/QuTS and Container Station compatibility matrix.',
      'Install Container Station and confirm whether the NAS uses x86-64 or ARM64.',
      'Create or select the operational shared folder and take a verified backup.',
      'Grant a dedicated non-root container account the minimum required folder permissions.',
      'Deploy only the signed image reference supplied by SaaSolution early access.',
      'Pair the node, select the assigned Cubbit folder and confirm the local root.',
      'Configure SMB or NFS through QNAP’s native sharing controls.',
      'Validate the node and a small test file before enabling the share for users.',
      'Pause before image updates and preserve the Edge data volume.',
      'Revoke and drain the node before safe removal.',
    ],
  },
  {
    id: 'truenas', name: 'TrueNAS SCALE', status: 'Not yet supported',
    introduction: 'No TrueNAS SCALE release has been validated and no application chart is available.',
    steps: [
      'Wait for the published TrueNAS SCALE compatibility statement.',
      'Create separate datasets for operational files and Edge state, with a verified snapshot or backup.',
      'Set the service identity and ACLs before container deployment.',
      'Deploy the future signed container using the documented application or custom-app route.',
      'Map the operational dataset and Edge state dataset to their documented container paths.',
      'Pair the node and assign the organization and folder scope.',
      'Configure the SMB share with TrueNAS native sharing controls only after initialization.',
      'Validate health, permissions and a small end-to-end file update.',
      'Pause and snapshot state before updates; retain datasets during app recreation.',
      'Revoke the node and confirm retention requirements before removing datasets.',
    ],
  },
  {
    id: 'unraid', name: 'Unraid', status: 'Not yet supported',
    introduction: 'No Community Applications template or supported manual container definition has been released.',
    steps: [
      'Wait for the signed Community Applications template or approved manual container instructions.',
      'Create or select an Unraid share and verify its backup before synchronization.',
      'Create a separate persistent path for Edge state and restrict both mappings to a dedicated identity.',
      'Map the share to the documented container root without broad access to unrelated shares.',
      'Deploy the approved multi-architecture image and keep the setup port private.',
      'Pair the node and choose the assigned organization folder.',
      'Validate permissions, disk reserve and a small test file.',
      'Pause the node before updates and preserve its state mapping.',
      'Revoke and drain the node before container removal.',
    ],
  },
  {
    id: 'raspberry', name: 'Raspberry Pi', status: 'Not yet supported',
    introduction: 'Raspberry Pi 4 or later with 64-bit Raspberry Pi OS is the intended baseline, but performance, thermals and storage endurance have not been validated.',
    steps: [
      'Use a Raspberry Pi 4 or later with 64-bit Raspberry Pi OS only after ARM64 support is published.',
      'Use an external SSD for business files and Edge state. A microSD card should not be the primary business file store because of endurance and recovery risk.',
      'Mount the SSD persistently and verify a separate backup before initialization.',
      'Install the supported Docker and Compose versions from the future release matrix.',
      'Deploy the approved ARM64 image with non-root permissions and separate data mappings.',
      'Pair the node and choose the mounted synchronization folder.',
      'For a generic appliance configuration, publish the folder with Samba only after the initial dataset is validated.',
      'Check thermal stability, storage reserve and a small file transfer before production use.',
      'Pause and verify the signed ARM64 release before updates; preserve the state volume.',
      'Revoke the node before removal and keep the SSD until retention needs are confirmed.',
    ],
  },
  {
    id: 'linux', name: 'Generic Linux', status: 'Planned',
    introduction: 'The Go agent foundation targets Linux, but there is no complete service, public binary, Docker image or supported distribution matrix yet.',
    steps: [
      'Wait for the published distribution, kernel and architecture compatibility matrix.',
      'Choose the Docker route unless SaaSolution publishes a signed native systemd package for your distribution.',
      'Create a dedicated service user and group with minimum access to the approved folder.',
      'Keep agent state on a separate persistent filesystem path with sufficient reserve space.',
      'Integrate with an existing Samba or NFS service; Edge does not need to replace it.',
      'Pair using a short-lived code in the private local setup page.',
      'Validate the path, storage reserve, outbound connectivity and a small test file.',
      'Pause and drain before upgrades, then verify the signed package or image.',
      'Revoke the node before removal and retain state until recovery is confirmed.',
    ],
  },
  {
    id: 'windows', name: 'Windows Server', status: 'Not yet supported',
    introduction: 'The repository contains a separate Windows desktop backup preview, not a supported Windows Server Edge service. Installation instructions would be misleading, so no download or command is published.',
    steps: [
      'Do not install the Windows desktop preview as an Edge server service.',
      'Join the platform notification list if Windows Server is required for your environment.',
      'Share the Windows Server version, filesystem, architecture and expected folder scale with SaaSolution for planning.',
      'Continue using an independent verified backup while the platform is unsupported.',
    ],
    note: 'Windows Server remains not yet supported and untested for Edge. Contact SaaSolution for deployment planning.',
  },
];

const preparation = [
  ['Account and licence', 'Use an administrator-owned SaaSolution Drive organization. Edge is intended for Business and Enterprise and requires an Edge node licence; final pricing is not configured.'],
  ['Cubbit project', 'Prepare the approved Cubbit project and bucket design. Bucket versioning is required by the engineering plan; Object Lock is optional and must follow a reviewed retention decision.'],
  ['Host access', 'Use a supported 64-bit host with administrator access. Final minimum CPU and RAM are not validated; plan at least 2 CPU cores, 4 GB RAM and storage capacity for the full local dataset plus working reserve.'],
  ['Folders and permissions', 'Create the local synchronization root and a separate agent-state folder. Use a dedicated non-root identity and do not grant access to unrelated shares.'],
  ['Network', 'Allow outbound encrypted web connections to the approved SaaSolution and Cubbit endpoints. Keep the local setup surface private; exact endpoint allow-lists will be published with the release.'],
  ['Recovery point', 'Take and verify an independent backup before first synchronization. Synchronization and version history do not replace an immutable backup.'],
  ['Authoritative location', 'Write down which site contains the initial authoritative data. Do not combine unrelated non-empty folders before the reconciliation workflow has reviewed them.'],
];

export default function EdgeInstallPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SaaSolutions', item: 'https://saasolution.es/' },
      { '@type': 'ListItem', position: 2, name: 'SaaSolution Drive Edge', item: 'https://saasolution.es/drive/edge' },
      { '@type': 'ListItem', position: 3, name: 'Installation guide', item: 'https://saasolution.es/drive/edge/install' },
    ],
  };

  return (
    <main className="edge-site edge-docs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EdgeHeader active="install" />
      <section className="edge-docs-hero">
        <div><p className="edge-kicker"><span /> Installation and operations</p><h1>Deploy with clarity.<br /><em>Not guesswork.</em></h1></div>
        <div><span>Pre-release documentation</span><p>The Edge Agent foundation is in active engineering. These guides document the intended secure rollout while clearly separating preparation from currently unavailable installers.</p><a href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20early%20access">Request early access <b>↗</b></a></div>
      </section>

      <nav className="edge-docs-index" aria-label="Installation guide sections">
        <a href="#prepare">Prepare</a><a href="#platform-guide">Platforms</a><a href="#pair">Pairing</a><a href="#multi-site">Multi-site rollout</a><a href="#management">Management</a><a href="#troubleshooting">Troubleshooting</a>
      </nav>

      <section className="edge-preparation" id="prepare">
        <div className="edge-section-heading"><p className="edge-kicker">Universal preparation</p><h2>Decisions to make before<br /><em>the first sync.</em></h2><span>A release package will not remove the need for ownership, capacity, permission and recovery planning.</span></div>
        <div className="preparation-list">{preparation.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      </section>

      <section className="edge-install-platforms" id="platform-guide">
        <div className="edge-install-heading"><p>Platform guides</p><h2>Choose the intended host.</h2><span>Accessible tabs show every planned procedure and its current release boundary.</span></div>
        <InstallTabs platforms={platforms} />
        <div className="compose-example">
          <div><p className="edge-kicker">Docker Compose pattern</p><h2>No hidden credentials.</h2><p>The image value is deliberately required from an approved release. Pairing happens after startup, through the local setup flow.</p></div>
          <CopyBlock label="compose.yaml" value={dockerCompose} />
          <CopyBlock label="After receiving the approved image reference" value="docker compose pull && docker compose up -d" />
        </div>
      </section>

      <section className="edge-pairing" id="pair">
        <div className="edge-section-heading light"><p className="edge-kicker">Secure enrollment</p><h2>Pair the node.<br /><em>Keep secrets out of scripts.</em></h2><span>The management backend and local setup flow are not released yet; this is the intended production sequence.</span></div>
        <ol className="pairing-steps">
          {['Sign in to SaaSolution Drive.','Open Admin → Edge Nodes.','Select Add Edge Node.','Enter the location and node name.','Generate a short-lived pairing code.','Enter the pairing code in the local setup page or installer.','Select the assigned Cubbit bucket and allowed folders.','Confirm the local storage path.','Run the validation checks.','Start the initial synchronization.'].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}
        </ol>
        <div className="pairing-principles"><p>Pairing codes expire.</p><p>Permanent secrets must not be pasted into installation commands.</p><p>Each node gets its own revocable identity.</p><p>Removing one node does not remove files from other locations.</p></div>
      </section>

      <section className="multi-site-guide" id="multi-site">
        <div className="edge-section-heading"><p className="edge-kicker">First-site and second-site rollout</p><h2>Establish one source.<br /><em>Then add the next location.</em></h2><span>Initialization is a controlled migration step, not a shortcut for merging two unrelated folders.</span></div>
        <div className="location-guides">
          <article><span>A</span><div><p>Initial authoritative copy</p><h3>Location A</h3><ol><li>Install and pair the first Edge node.</li><li>Select the initial local source folder.</li><li>Mark it as the initial authoritative copy.</li><li>Complete the first Cubbit synchronization.</li><li>Confirm that the node is healthy.</li></ol></div></article>
          <article><span>B</span><div><p>Validated destination</p><h3>Location B</h3><ol><li>Install the second Edge node and pair it to the same organization.</li><li>Assign the same shared folder.</li><li>Start with an empty destination unless migration tooling explicitly supports otherwise.</li><li>Download and validate the initial dataset.</li><li>Enable SMB/NFS only after initialization, then test a small file.</li></ol></div></article>
        </div>
        <p className="multi-site-warning"><b>Do not combine two unrelated, non-empty folders.</b> First allow the initial reconciliation process to inventory and review both sides. Otherwise duplicate names, case collisions, stale deletions and unrelated histories can create unsafe results.</p>
      </section>

      <section className="edge-management" id="management">
        <div className="edge-section-heading light"><p className="edge-kicker">Day-to-day management</p><h2>One operational view<br /><em>for every node.</em></h2><span>The administration runtime remains an external release gate, so this section documents the intended controls rather than pretending they are live.</span></div>
        <div className="management-grid">
          {['Node status and online/offline indicators','Last successful sync and pending files','Bandwidth controls and synchronization schedules','Selective folders and low-storage alerts','Conflict inbox and version restoration','Pause, resume and revoke a node','Replace failed NAS hardware','Re-enroll a recovered location'].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}
        </div>
        <div className="recovery-note"><h3>Replacing failed hardware</h3><p>Revoke or pause the old node, restore the operating system and local storage from a verified recovery source, enroll the replacement as a new node identity, validate the dataset before publishing SMB/NFS and only then retire retained recovery material.</p></div>
      </section>

      <section className="edge-troubleshooting" id="troubleshooting">
        <div className="edge-section-heading"><p className="edge-kicker">Troubleshooting</p><h2>Search the symptom.<br /><em>Protect the secrets.</em></h2><span>Never post secrets, access keys, encryption keys or recovery codes in a support request.</span></div>
        <TroubleshootingSearch />
      </section>

      <section className="edge-docs-cta">
        <p>Need help planning the first deployment?</p><h2>Bring the locations.<br /><em>We’ll map the rollout.</em></h2>
        <div><a className="light-button" href="mailto:hello@saasolution.es?subject=SaaSolution%20Drive%20Edge%20deployment%20assistance">Request deployment assistance <span>↗</span></a><Link href="/drive/edge">Back to Edge overview</Link></div>
      </section>
      <EdgeFooter />
    </main>
  );
}
