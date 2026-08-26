import Image from 'next/image';
import { DriveLanguageSwitcher } from './i18n/language-provider';

const projects = [
  { name: 'hospitalityOS', detail: 'Multilingual hotel website and brand platform', tone: 'orange' },
  { name: 'HospitalityOps', detail: 'Operations for cleaning, maintenance and field teams', tone: 'blue' },
  { name: 'HospitalityTV', detail: 'A smarter in-room guest experience', tone: 'black' },
  { name: 'Mithaq', detail: 'Digital Islamic prenup and will', tone: 'yellow' },
  { name: 'Viyra', detail: 'International workflow automation', tone: 'pink' },
  { name: 'SaaSolution Drive', detail: 'Private cloud storage made simple', tone: 'drive', href: '/drive' },
  { name: 'Delicious Fitness', detail: 'Social food and meal preparation', tone: 'green' },
];

const methods = [
  ['01', 'Discover', 'We audit, interview and pressure-test the brief. You leave with clarity, not another presentation.'],
  ['02', 'Design', 'High-fidelity prototypes connected to real data. Every interaction earns its place.'],
  ['03', 'Build', 'Weekly demos and production-minded delivery from the first sprint. No big-bang surprises.'],
  ['04', 'Scale', 'We stay involved as a partner across performance, growth and new markets.'],
];

export default function CompanyHome() {
  return (
    <main className="company-home">
      <header className="company-nav">
        <a href="#top" className="company-logo">SaaSolutions <sup>SL</sup></a>
        <nav aria-label="Company navigation">
          <a href="#about">About</a>
          <a href="#work">Products</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </nav>
        <DriveLanguageSwitcher />
      </header>

      <section className="company-hero" id="top">
        <div className="company-hero-title">
          <p>AI-first software &amp; automation company</p>
          <h1>SaaSolution <sup>SL</sup></h1>
          <div><span>Software that moves</span><em>results.</em></div>
        </div>
        <div className="company-hero-note">
          <span>Based in Ceuta, Spain</span>
          <p>We build practical software for ambitious companies, governments and international markets.</p>
          <a href="#contact">Work with us ↗</a>
        </div>
      </section>

      <section className="project-showcase" id="work">
        <div className="showcase-heading"><span>Project showcase</span><b>Live product ecosystem</b><i>Scroll to explore →</i></div>
        <div className="project-scroll" tabIndex={0} aria-label="Scrollable project showcase">
        <div className="project-track">
          {projects.map((project, index) => {
            const content = (
              <>
                <div className={`project-visual ${project.tone}`}>
                  {project.tone === 'drive' ? (
                    <Image src="/og.png" alt="SaaSolution Drive — Your files. Quietly protected." fill sizes="(max-width: 700px) 78vw, 360px" priority />
                  ) : (
                    <><span>{String(index + 1).padStart(2, '0')}</span><i>{project.name.slice(0, 2)}</i></>
                  )}
                </div>
                <p><b>{project.name}</b><span>{project.detail}</span></p>
                <i className="project-arrow">↗</i>
              </>
            );

            return project.href ? (
              <a className="project-tile drive-tile" href={project.href} key={project.name} aria-label="Open the SaaSolution Drive landing page">{content}</a>
            ) : (
              <article className="project-tile" key={project.name}>{content}</article>
            );
          })}
        </div>
        </div>
      </section>

      <section className="company-about" id="about">
        <p>About SaaSolutions</p>
        <h2>Engineers and designers launching <em>cinematic products</em> for ambitious organisations.</h2>
        <div><span>From enterprise SaaS to AI agents and connected hardware, we build products your customers remember.</span><b>Ceuta · Spain<br />International by design</b></div>
      </section>

      <section className="company-platforms">
        <div><span>AI-first platforms</span><h2>Useful technology.<br /><em>Beautifully operated.</em></h2></div>
        <p>Modern cloud architecture, automation and human-centred workflows brought together in software that does real work.</p>
      </section>

      <section className="company-method" id="method">
        <div className="method-title"><span>The SaaSolutions method</span><h2>From brief to<br />standout launch.</h2></div>
        <div className="method-list">
          {methods.map(([number, title, text]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="company-products">
        <div className="product-count"><span>Seven products</span><b>07</b><p>One obsession with craft.</p></div>
        <div className="company-product-list">
          {projects.map((project, index) => project.href ? (
            <a href={project.href} key={project.name}><span>{project.name}</span><i>{String(index + 1).padStart(2, '0')}</i></a>
          ) : (
            <div key={project.name}><span>{project.name}</span><i>{String(index + 1).padStart(2, '0')}</i></div>
          ))}
        </div>
      </section>

      <section className="company-global">
        <div><span>Global presence</span><h2>Three offices.<br /><em>One continuous day.</em></h2><p>Follow-the-sun support built around the team whose local workday is active.</p></div>
        <div className="office-grid">
          <article><small>Q4 2026 · Americas hub</small><h3>Asunción</h3><p>Paraguay</p><b>PYT · UTC−4</b></article>
          <article className="active-office"><small>Global headquarters</small><h3>Ceuta</h3><p>Spain</p><b>CEST · UTC+2</b></article>
          <article><small>Q2 2027 · APAC hub</small><h3>Cebu City</h3><p>Philippines</p><b>PHT · UTC+8</b></article>
        </div>
      </section>

      <section className="company-contact" id="contact">
        <p>Partner with us</p>
        <h2>Ready to build something<br /><em>people talk about?</em></h2>
        <a href="mailto:hello@saasolution.es">Start a conversation <span>↗</span></a>
      </section>

      <footer className="company-footer" id="footer">
        <div className="footer-intro">
          <h2>SaaSolutions</h2>
          <p>Practical software for international markets.</p>
          <span>SaaSolutions builds and operates useful software for businesses, governments and international markets.</span>
        </div>
        <div className="footer-menu">
          <section>
            <h3>Company</h3>
            <a href="#about">About us</a>
            <a href="https://www.saasolution.es/mission-vision">Mission &amp; vision</a>
            <a href="https://www.saasolution.es/careers">Careers / Vacancies</a>
            <a href="https://www.saasolution.es/partners">Partners</a>
            <a href="mailto:hello@saasolution.es">Contact</a>
          </section>
          <section>
            <h3>Products</h3>
            <a href="https://www.saasolution.es/products/hospitalityos">hospitalityOS</a>
            <a href="https://www.saasolution.es/products/hospitalityops">HospitalityOps</a>
            <a href="https://www.saasolution.es/products/hospitalitytv">HospitalityTV</a>
            <a href="https://www.saasolution.es/products/mithaq">Mithaq</a>
            <a href="/drive">SaaSolution Drive</a>
          </section>
          <section>
            <h3>Resources</h3>
            <a href="https://www.saasolution.es/blog">Blog</a>
            <a href="https://www.saasolution.es/help-center">Help centre</a>
            <a href="https://www.saasolution.es/docs">Documentation</a>
            <a href="https://www.saasolution.es/api">API</a>
            <a href="https://www.saasolution.es/support">Support</a>
          </section>
          <section>
            <h3>Legal</h3>
            <a href="https://www.saasolution.es/privacy">Privacy</a>
            <a href="https://www.saasolution.es/terms">Terms</a>
            <a href="https://www.saasolution.es/cookies">Cookies</a>
            <a href="https://www.saasolution.es/legal">Legal notice</a>
          </section>
        </div>
        <div className="footer-bottom"><small>© 2026 SaaSolutions SL · Ceuta, Spain</small><span>Spain · Mediterranean · Africa · South America · UAE/GCC · Southeast Asia · Europe</span></div>
      </footer>
    </main>
  );
}
