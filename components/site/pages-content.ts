export type Section = { title: string; paragraphs: string[]; list?: string[] };
export type SitePage = {
  slug: string;
  group: 'company' | 'resources' | 'legal' | 'products';
  title: string;
  eyebrow: string;
  intro: string;
  sections: Section[];
  status?: string;
  updated?: string;
  cta?: { label: string; href: string };
};

const EMAIL = 'hello@saasolution.es';
const UPDATED = '18 November 2026';
const REVIEW_NOTE =
  'This page is a plain-language summary for the current company site and should be reviewed by qualified legal counsel before being relied on as final.';

export const companyPages: SitePage[] = [
  {
    slug: 'mission-vision', group: 'company', eyebrow: 'Company', title: 'Mission & vision',
    intro: 'Why SaaSolutions exists and where we are taking it.',
    sections: [
      { title: 'Our mission', paragraphs: ['To build practical, well-crafted software that does real work for businesses, governments and organisations operating in international markets.'] },
      { title: 'Our vision', paragraphs: ['A world where useful technology is accessible everywhere, in the user’s own language, on infrastructure they can trust, and operated with care.'] },
      { title: 'How we work', paragraphs: ['We combine engineering, design and automation to ship products that stay useful after launch.'], list: ['Practical first: every feature has to earn its place.', 'International by design: multilingual, multi-region and locally aware.', 'Privacy and ownership: customers should keep control of their data.', 'Long-term partnership: we stay involved after the first release.'] },
    ],
    cta: { label: 'Talk to us', href: `mailto:${EMAIL}` },
  },
  {
    slug: 'careers', group: 'company', eyebrow: 'Company', title: 'Careers / Vacancies',
    intro: 'Join a small, international team building software that moves results.',
    sections: [
      { title: 'Current vacancies', paragraphs: ['We have no formally advertised vacancies at the moment. We are always interested in hearing from talented engineers, designers and operators, particularly across our planned hubs in Ceuta, Asunción and Cebu City.'] },
      { title: 'Speculative applications', paragraphs: [`Send a short introduction, your CV or portfolio and the kind of work you want to do to ${EMAIL}. We keep applications only for as long as needed to consider them, and you can ask us to delete yours at any time.`] },
      { title: 'Who thrives here', paragraphs: [], list: ['People who like shipping real products, not slideware.', 'Comfortable working across time zones and languages.', 'Curious about AI-assisted development and automation.'] },
    ],
    cta: { label: 'Send an application', href: `mailto:${EMAIL}?subject=Application` },
  },
  {
    slug: 'partners', group: 'company', eyebrow: 'Company', title: 'Partners',
    intro: 'We work with companies that share our focus on practical, international software.',
    sections: [
      { title: 'Partnership types', paragraphs: [], list: ['Technology partners: infrastructure, hardware and platform providers.', 'Channel partners: resellers and integrators serving hospitality and SMB customers.', 'Market partners: local teams helping us enter new regions.'] },
      { title: 'Become a partner', paragraphs: [`Tell us about your organisation, the markets you serve and what you would like to build together at ${EMAIL}.`] },
    ],
    cta: { label: 'Partner with us', href: `mailto:${EMAIL}?subject=Partnership` },
  },
  {
    slug: 'blog', group: 'resources', eyebrow: 'Resources', title: 'Blog',
    intro: 'Product news, engineering notes and lessons from building for international markets.',
    status: 'Coming soon',
    sections: [
      { title: 'No articles yet', paragraphs: ['We are preparing our first posts. In the meantime, product updates are shared on each product page, including SaaSolution Drive and Drive Edge.'] },
    ],
    cta: { label: 'Ask to be notified', href: `mailto:${EMAIL}?subject=Blog%20updates` },
  },
  {
    slug: 'help-center', group: 'resources', eyebrow: 'Resources', title: 'Help centre',
    intro: 'Where to find help with SaaSolutions products.',
    sections: [
      { title: 'Getting help today', paragraphs: [`Our full help centre is being built. Until it is live, our team answers questions directly at ${EMAIL}. Please mention the product, your platform and what you were trying to do.`] },
      { title: 'Product guides', paragraphs: ['SaaSolution Drive and Drive Edge pages are already available.'], list: ['Drive: /drive', 'Drive Edge: /drive/edge', 'Drive Edge install guide: /drive/edge/install'] },
    ],
    cta: { label: 'Contact support', href: '/support' },
  },
  {
    slug: 'docs', group: 'resources', eyebrow: 'Resources', title: 'Documentation',
    intro: 'Technical documentation for SaaSolutions products.',
    sections: [
      { title: 'Available now', paragraphs: ['Installation instructions for SaaSolution Drive Edge are published with the beta.'], list: ['Drive Edge install guide: /drive/edge/install', 'Beta programme: /drive/edge/beta'] },
      { title: 'In progress', paragraphs: ['Product documentation for hospitalityOS, HospitalityOps and HospitalityTV will be published here as each product opens to customers.'] },
    ],
    cta: { label: 'Open the Drive Edge guide', href: '/drive/edge/install' },
  },
  {
    slug: 'api', group: 'resources', eyebrow: 'Resources', title: 'API',
    intro: 'Programmatic access to SaaSolutions products.',
    status: 'Not yet public',
    sections: [
      { title: 'Status', paragraphs: ['A public API is not generally available yet. We are working with early customers on integrations and will publish reference documentation here when it is ready.'] },
      { title: 'Request early access', paragraphs: [`If you have an integration in mind, email ${EMAIL} with the product, your use case and expected volume.`] },
    ],
    cta: { label: 'Request API access', href: `mailto:${EMAIL}?subject=API%20access` },
  },
  {
    slug: 'support', group: 'resources', eyebrow: 'Resources', title: 'Support',
    intro: 'Talk to a person. We aim to reply promptly.',
    sections: [
      { title: 'Contact', paragraphs: [`Email ${EMAIL}. Include the product name, your device or platform, and screenshots or error messages if you have them.`] },
      { title: 'Coverage', paragraphs: ['Support is organised around follow-the-sun coverage, with the team whose local workday is active responding first. Our headquarters are in Ceuta, Spain.'] },
      { title: 'Security issues', paragraphs: [`If you believe you have found a vulnerability, email ${EMAIL} with the subject “Security” and avoid public disclosure until we have responded.`] },
    ],
    cta: { label: 'Email support', href: `mailto:${EMAIL}?subject=Support` },
  },
  {
    slug: 'privacy', group: 'legal', eyebrow: 'Legal', title: 'Privacy',
    intro: 'How SaaSolutions SL handles personal data on this website.', updated: UPDATED,
    sections: [
      { title: 'Controller', paragraphs: [`SaaSolutions SL, Ceuta, Spain, is responsible for personal data collected through this website. Contact: ${EMAIL}.`] },
      { title: 'What we collect', paragraphs: [], list: ['Information you send us when you email or apply to a programme (name, email, organisation, message).', 'Basic technical data such as IP address, browser and pages visited, used to operate and secure the site.', 'Your language preference, stored in your browser.'] },
      { title: 'Why we use it', paragraphs: ['To reply to enquiries, run beta programmes, operate and secure the site, meet legal obligations, and improve our services. Where the GDPR applies, our legal bases are contract, consent, legal obligation and legitimate interests.'] },
      { title: 'Sharing and retention', paragraphs: ['We share data only with service providers that host or operate the site and our communications, and where legally required. We keep data only as long as needed for the purpose collected.'] },
      { title: 'Your rights', paragraphs: [`You may request access, correction, deletion, restriction or portability, or object to processing, by emailing ${EMAIL}. You may complain to the Spanish Data Protection Agency (AEPD).`, 'Product-specific privacy information, such as for SaaSolution Drive, is at /drive/privacy.'] },
      { title: 'Review notice', paragraphs: [REVIEW_NOTE] },
    ],
  },
  {
    slug: 'terms', group: 'legal', eyebrow: 'Legal', title: 'Terms',
    intro: 'Terms for using the SaaSolutions website.', updated: UPDATED,
    sections: [
      { title: 'Use of the site', paragraphs: ['This website provides information about SaaSolutions SL and its products. You agree to use it lawfully and not to disrupt it or attempt unauthorised access.'] },
      { title: 'Intellectual property', paragraphs: ['Content, logos and designs on this site belong to SaaSolutions SL or its licensors. You may not reproduce them without permission, except as allowed by law.'] },
      { title: 'No warranty', paragraphs: ['The site is provided “as is”. Product descriptions are informative and may change. To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of the site.'] },
      { title: 'Products and services', paragraphs: ['Use of individual products is governed by their own terms, for example SaaSolution Drive at /drive/terms, or by a signed agreement.'] },
      { title: 'Governing law', paragraphs: ['These terms are governed by Spanish law, without prejudice to mandatory consumer protections in your country of residence.'] },
      { title: 'Contact and review', paragraphs: [`Questions: ${EMAIL}.`, REVIEW_NOTE] },
    ],
  },
  {
    slug: 'cookies', group: 'legal', eyebrow: 'Legal', title: 'Cookies',
    intro: 'How this website uses cookies and similar storage.', updated: UPDATED,
    sections: [
      { title: 'What we use', paragraphs: ['This site uses only strictly necessary browser storage, such as remembering your language choice. We do not currently use advertising or cross-site tracking cookies.'] },
      { title: 'Third parties', paragraphs: ['If we add analytics or embedded third-party services, we will update this page and request consent where required before setting non-essential cookies.'] },
      { title: 'Managing storage', paragraphs: ['You can clear or block cookies and site data in your browser settings. Blocking essential storage may reset your preferences.'] },
      { title: 'Contact and review', paragraphs: [`Questions: ${EMAIL}.`, REVIEW_NOTE] },
    ],
  },
  {
    slug: 'legal', group: 'legal', eyebrow: 'Legal', title: 'Legal notice',
    intro: 'Company information for a website operated from Spain.', updated: UPDATED,
    sections: [
      { title: 'Operator', paragraphs: ['SaaSolutions SL, registered office in Ceuta, Spain.', `Contact: ${EMAIL}.`] },
      { title: 'Registration details', paragraphs: ['Company registry data, tax identification number (NIF/CIF) and registered address should be added here by the company before this notice is relied on, as required by Spanish law (LSSI-CE).'] },
      { title: 'Related documents', paragraphs: ['See Privacy at /privacy, Terms at /terms and Cookies at /cookies.'] },
    ],
  },
];

export const productPages: SitePage[] = [
  {
    slug: 'hospitalityos', group: 'products', eyebrow: 'Product', title: 'hospitalityOS',
    intro: 'A multilingual hotel website and brand platform.',
    sections: [
      { title: 'What it is', paragraphs: ['hospitalityOS helps hotels and hospitality groups run a fast, multilingual website and a consistent brand presence from one platform.'] },
      { title: 'Highlights', paragraphs: [], list: ['Multilingual content for international guests.', 'Brand-consistent pages and templates.', 'Built to connect with HospitalityOps and HospitalityTV.'] },
    ],
    cta: { label: 'Request information', href: `mailto:${EMAIL}?subject=hospitalityOS` },
  },
  {
    slug: 'hospitalityops', group: 'products', eyebrow: 'Product', title: 'HospitalityOps',
    intro: 'Operations for cleaning, maintenance and field teams.',
    sections: [
      { title: 'What it is', paragraphs: ['HospitalityOps coordinates housekeeping, maintenance and field tasks so teams know what to do next and managers can see what is done.'] },
      { title: 'Highlights', paragraphs: [], list: ['Task assignment and status tracking.', 'Designed for mobile use by on-site teams.', 'Works alongside hospitalityOS and HospitalityTV.'] },
    ],
    cta: { label: 'Request information', href: `mailto:${EMAIL}?subject=HospitalityOps` },
  },
  {
    slug: 'hospitalitytv', group: 'products', eyebrow: 'Product', title: 'HospitalityTV',
    intro: 'A smarter in-room guest experience.',
    sections: [
      { title: 'What it is', paragraphs: ['HospitalityTV turns the in-room television into a welcoming guest portal for information, services and local recommendations.'] },
      { title: 'Highlights', paragraphs: [], list: ['Multilingual guest-facing content.', 'Managed centrally by the property.', 'Connects with hospitalityOS and HospitalityOps.'] },
    ],
    cta: { label: 'Request information', href: `mailto:${EMAIL}?subject=HospitalityTV` },
  },
];

export const allPages = [...companyPages, ...productPages];
export const pagePath = (p: SitePage) => (p.group === 'products' ? `/products/${p.slug}` : `/${p.slug}`);
