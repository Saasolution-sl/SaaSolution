import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, Blocks, Bot, Building2, ChartNoAxesCombined, Check, DatabaseZap, FileCheck2, Fingerprint, Globe2, Landmark, Network, ScrollText, ShieldCheck, Workflow } from 'lucide-react';
import { DriveLanguageSwitcher } from '../i18n/language-provider';
import { ConnectGridContactForm } from './contact-form';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'ConnectGrid — Modular integration for public institutions and enterprises',
  description: 'SaaSolution ConnectGrid is a modular integration platform in development for connected systems, secure data exchange and interoperable digital infrastructure.',
  alternates: { canonical: '/connectgrid' },
  openGraph: { title: 'SaaSolution ConnectGrid', description: 'Connect systems, streamline workflows and build interoperable digital infrastructure.', url: '/connectgrid', type: 'website' },
};

const publicSectors = ['Government and municipalities', 'Public healthcare', 'Public transportation', 'Utilities and infrastructure', 'Public administration'];
const commercialSectors = ['Logistics and transportation', 'Private healthcare', 'Enterprise operations', 'Property and infrastructure management', 'International business'];
const capabilities = [
  [Network, 'API Integration', 'Planned connectors and interfaces for systems that need to exchange data reliably.'],
  [DatabaseZap, 'Secure Data Exchange', 'A future-ready exchange layer designed around controlled, traceable information flows.'],
  [Workflow, 'Workflow Automation', 'Planned orchestration for approvals, handoffs, notifications and recurring processes.'],
  [Bot, 'AI-Assisted Processes', 'Potential assistance for classification, routing and operator decision support.'],
  [FileCheck2, 'Data Validation', 'Planned checks to improve the completeness, structure and quality of exchanged data.'],
  [ChartNoAxesCombined, 'Monitoring & Analytics', 'Visibility concepts for connection health, workflow status and operational insight.'],
  [Fingerprint, 'Identity & Access Management', 'Planned role and access controls for people, systems and organizational boundaries.'],
  [ScrollText, 'Audit Logging', 'Traceability concepts for important activity, changes and information exchanges.'],
] as const;

export default function ConnectGridPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link className={styles.brand} href="/">SaaSolutions <sup>SL</sup></Link>
        <nav aria-label="ConnectGrid navigation"><a href="#products">Products</a><a href="#core">Core</a><a href="#infrastructure">Infrastructure</a><a href="#contact">Contact</a></nav>
        <DriveLanguageSwitcher />
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.status}><Activity aria-hidden="true" /> Currently in Development — Early Partnerships Welcome</div>
          <p className={styles.eyebrow}>SaaSolution ConnectGrid</p>
          <h1>Connect Everything.<br />Control Your Data.<br /><em>Automate Your Future.</em></h1>
          <p className={styles.lede}>SaaSolution ConnectGrid is a modular integration platform designed to help public institutions and commercial organizations connect systems, streamline workflows, and build more interoperable digital infrastructure.</p>
          <div className={styles.heroActions}><a className={styles.primaryButton} href="#contact">Request a Consultation</a><a className={styles.secondaryButton} href="#products">Explore ConnectGrid</a></div>
        </div>
        <NetworkVisual />
      </section>

      <section className={styles.productSection} id="products">
        <SectionIntro eyebrow="Two product lines · One shared core" title="Built for different operating realities." body="Public institutions and commercial organizations carry different responsibilities. ConnectGrid is being shaped as one modular foundation with two focused product experiences." />
        <div className={styles.productGrid}>
          <ProductCard icon={Landmark} label="Government & Public Sector" name="Public Connect Grid" body="Designed for public institutions seeking better interoperability, secure information exchange, and digital process automation." sectors={publicSectors} />
          <ProductCard icon={Building2} label="Business & Enterprise" name="Universal Connect Grid" body="Designed for commercial organizations seeking to connect applications, automate operations, and reduce fragmented data workflows." sectors={commercialSectors} commercial />
        </div>
      </section>

      <section className={styles.coreSection} id="core">
        <div className={styles.coreIntro}>
          <p className={styles.eyebrow}>ConnectGrid Core</p><h2>A modular technology layer beneath both products.</h2>
          <p>ConnectGrid Core is the shared technical foundation planned for PCG and UCG. Its architecture is intended to let organizations begin with a defined integration need and expand through compatible modules over time.</p>
          <aside>These are planned or potential platform capabilities. Final scope, availability and deployment requirements will be defined with early partners.</aside>
        </div>
        <div className={styles.capabilityGrid}>
          {capabilities.map(([Icon, title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className={styles.internationalSection}>
        <div><p className={styles.eyebrow}>International collaboration</p><h2>Connecting Organizations<br /><em>Across Borders</em></h2><p>SaaSolution aims to work with organizations internationally to improve interoperability, digital connectivity, and process automation. The modular approach is intended to adapt to different industries, operating models, languages, and regulatory environments without assuming that one implementation fits every market.</p></div>
        <div className={styles.globeCard} aria-label="International collaboration principles"><Globe2 aria-hidden="true" />{['Local requirements', 'Cross-border workflows', 'Industry adaptation', 'Modular rollout'].map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className={styles.infrastructureSection} id="infrastructure">
        <CubbitPartnerPanel />
        <div className={styles.infrastructureCopy}>
          <p className={styles.eyebrow}>Official Cubbit reseller partnership</p><h2>Data Sovereignty &amp;<br /><em>Secure Infrastructure</em></h2>
          <p className={styles.infrastructureLead}>SaaSolution is an official Cubbit reseller, combining modular integration solutions with an infrastructure offering focused on data sovereignty, security, and organizational control.</p>
          <div className={styles.resellerNote}>
            <b>Cubbit&apos;s IT Reseller model</b>
            <p>Cubbit describes its IT Reseller partnership as enabling partners to offer Cubbit to customers without needing to manage hardware. Its wider partner program includes dedicated training, marketing assets, co-marketing and technical support.</p>
            <a href="https://www.cubbit.io/partners" target="_blank" rel="noreferrer">View Cubbit&apos;s partner program</a>
          </div>
          <div className={styles.principles}>{['Data sovereignty', 'Control over data storage and infrastructure', 'Secure access and information exchange', 'Infrastructure flexibility', 'Responsible data governance'].map((item) => <span key={item}><Check aria-hidden="true" />{item}</span>)}</div>
          <small>Infrastructure design, data location, security controls and governance requirements are assessed per organization and are not implied as universal guarantees.</small>
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>Early conversations</p><h2>Let&apos;s Connect<br /><em>Your Organization</em></h2>
          <p>Share the systems, workflows or partnership model you are exploring. We welcome consultation, pilot and early partnership discussions while ConnectGrid is in development.</p>
          <aside><ShieldCheck aria-hidden="true" /><span>This page does not claim a live platform deployment or completed capability. A conversation helps define feasibility, requirements and an appropriate next step.</span></aside>
        </div>
        <div className={styles.formShell}><ConnectGridContactForm /></div>
      </section>

      <footer className={styles.footer}>
        <div><b>SaaSolutions</b><p>Practical software for international markets.</p></div>
        <nav aria-label="ConnectGrid footer navigation"><Link href="/">Home</Link><a href="#products">Products</a><a href="#core">ConnectGrid Core</a><Link href="/privacy">Privacy</Link><a href="mailto:hello@saasolution.es">Contact</a></nav>
        <small>© 2026 SaaSolutions SL · Ceuta, Spain</small>
      </footer>
    </main>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) { return <div className={styles.sectionIntro}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2><span>{body}</span></div>; }

function ProductCard({ icon: Icon, label, name, body, sectors, commercial = false }: { icon: typeof Landmark; label: string; name: string; body: string; sectors: string[]; commercial?: boolean }) {
  return <article className={`${styles.productCard} ${commercial ? styles.commercialCard : ''}`}><div className={styles.cardTop}><Icon aria-hidden="true" /><span>{commercial ? 'UCG' : 'PCG'}</span></div><p>{label}</p><h3>{name}</h3><div className={styles.cardBody}>{body}</div><h4>Designed for</h4><ul>{sectors.map((sector) => <li key={sector}><Check aria-hidden="true" />{sector}</li>)}</ul></article>;
}

function NetworkVisual() {
  const nodes = [['Public', styles.nodePublic], ['Systems', styles.nodeSystems], ['Workflows', styles.nodeWorkflows], ['Enterprise', styles.nodeEnterprise]];
  return <div className={styles.networkVisual} role="img" aria-label="ConnectGrid modular data flow illustration"><div className={styles.orbitOne} /><div className={styles.orbitTwo} /><svg aria-hidden="true" viewBox="0 0 620 620"><path d="M95 152 310 310 520 130M72 390l238-80 225 150M190 548l120-238 215 22" /><circle cx="95" cy="152" r="7" /><circle cx="520" cy="130" r="7" /><circle cx="72" cy="390" r="7" /><circle cx="535" cy="460" r="7" /><circle cx="190" cy="548" r="7" /></svg><div className={styles.coreNode}><Blocks aria-hidden="true" /><b>ConnectGrid</b><span>Core</span></div>{nodes.map(([label, className]) => <span className={className} key={label}>{label}</span>)}</div>;
}

function CubbitPartnerPanel() {
  return (
    <div className={styles.cubbitPartnerPanel} aria-label="Cubbit — Official Reseller Partner">
      <div className={styles.cubbitLogo}><Image alt="Cubbit" fill sizes="180px" src="/partners/cubbit-logo.svg" /></div>
      <span>Official Reseller Partner</span>
      <div className={styles.cubbitArtwork}><Image alt="Cubbit partner program geo-distributed storage illustration" fill sizes="(max-width: 700px) 80vw, 500px" src="/partners/cubbit-partner-program.webp" /></div>
      <small>Official brand assets sourced from Cubbit&apos;s partner-program website.</small>
    </div>
  );
}
