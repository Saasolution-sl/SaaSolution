/**
 * Technology Project Health Check — question definitions.
 *
 * All content is typed and bilingual (en/es). Scoring lives in ./scoring.ts and
 * only depends on the structure below, so questions can be edited without
 * touching the maths. Questions are phrased so that the standard answer scale
 * ("Yes, fully implemented" … "Not applicable") always makes sense.
 */

export type Lang = 'en' | 'es';
export type L10n = Record<Lang, string>;

export type Audience = 'private' | 'public' | 'nonprofit' | 'other';
export type AnswerValue = 'full' | 'partial' | 'none' | 'unsure' | 'na';
export type CategoryId = 'strategy' | 'architecture' | 'security' | 'delivery' | 'vendor' | 'ai' | 'public';
export type ServiceKey = 'consultancy' | 'audit' | 'tender' | 'oversight' | 'ai';

export type Category = {
  id: CategoryId;
  title: L10n;
  description: L10n;
  /** Only shown when the visitor says they are interested in AI / automation. */
  requiresAi?: boolean;
  /** Only shown for these audiences. Undefined = everyone. */
  audiences?: Audience[];
};

export type Question = {
  id: string;
  category: CategoryId;
  text: L10n;
  /** Short statement of the gap, used when this answer drives a recommendation. */
  gap: L10n;
  /** SaaSolution service most relevant when this control is missing or partial. */
  service: ServiceKey;
};

export const categories: Category[] = [
  {
    id: 'strategy',
    title: { en: 'Strategy & Planning', es: 'Estrategia y planificación' },
    description: { en: 'Objectives, requirements and ownership.', es: 'Objetivos, requisitos y responsabilidades.' },
  },
  {
    id: 'architecture',
    title: { en: 'Technology & Architecture', es: 'Tecnología y arquitectura' },
    description: { en: 'Design, integrations and maintainability.', es: 'Diseño, integraciones y mantenibilidad.' },
  },
  {
    id: 'security',
    title: { en: 'Security & Risk', es: 'Seguridad y riesgo' },
    description: { en: 'Responsibilities, recovery and risk review.', es: 'Responsabilidades, recuperación y revisión de riesgos.' },
  },
  {
    id: 'delivery',
    title: { en: 'Project Delivery', es: 'Ejecución del proyecto' },
    description: { en: 'Milestones, reviews and acceptance.', es: 'Hitos, revisiones y aceptación.' },
  },
  {
    id: 'vendor',
    title: { en: 'Vendor & Governance', es: 'Proveedores y gobernanza' },
    description: { en: 'Supplier responsibilities and oversight.', es: 'Responsabilidades del proveedor y supervisión.' },
  },
  {
    id: 'ai',
    title: { en: 'AI & Automation', es: 'IA y automatización' },
    description: { en: 'Opportunities, data quality and oversight.', es: 'Oportunidades, calidad de datos y supervisión.' },
    requiresAi: true,
  },
  {
    id: 'public',
    title: { en: 'Public-sector accountability', es: 'Rendición de cuentas en el sector público' },
    description: { en: 'Procurement records, acceptance and supplier oversight.', es: 'Expediente de contratación, aceptación y supervisión del proveedor.' },
    audiences: ['public'],
  },
];

export const questions: Question[] = [
  // A. Strategy & Planning
  { id: 'A1', category: 'strategy', service: 'consultancy',
    text: { en: 'Are the project objectives documented?', es: '¿Están documentados los objetivos del proyecto?' },
    gap: { en: 'Project objectives are not fully documented', es: 'Los objetivos del proyecto no están totalmente documentados' } },
  { id: 'A2', category: 'strategy', service: 'consultancy',
    text: { en: 'Are the requirements clearly defined?', es: '¿Están claramente definidos los requisitos?' },
    gap: { en: 'Requirements are not clearly defined', es: 'Los requisitos no están claramente definidos' } },
  { id: 'A3', category: 'strategy', service: 'consultancy',
    text: { en: 'Are the success criteria measurable?', es: '¿Son medibles los criterios de éxito?' },
    gap: { en: 'Success criteria are not measurable', es: 'Los criterios de éxito no son medibles' } },
  { id: 'A4', category: 'strategy', service: 'consultancy',
    text: { en: 'Are responsibilities assigned to named people or roles?', es: '¿Están asignadas las responsabilidades a personas o roles concretos?' },
    gap: { en: 'Responsibilities are not clearly assigned', es: 'Las responsabilidades no están claramente asignadas' } },

  // B. Technology & Architecture
  { id: 'B1', category: 'architecture', service: 'audit',
    text: { en: 'Is the technology architecture documented?', es: '¿Está documentada la arquitectura tecnológica?' },
    gap: { en: 'The architecture is not adequately documented', es: 'La arquitectura no está documentada adecuadamente' } },
  { id: 'B2', category: 'architecture', service: 'consultancy',
    text: { en: 'Are the integrations with other systems understood and documented?', es: '¿Se conocen y documentan las integraciones con otros sistemas?' },
    gap: { en: 'Integrations with other systems are not well understood', es: 'Las integraciones con otros sistemas no se comprenden bien' } },
  { id: 'B3', category: 'architecture', service: 'audit',
    text: { en: 'Has scalability been considered in the design?', es: '¿Se ha considerado la escalabilidad en el diseño?' },
    gap: { en: 'Scalability has not been assessed', es: 'No se ha evaluado la escalabilidad' } },
  { id: 'B4', category: 'architecture', service: 'audit',
    text: { en: 'Is technical debt monitored?', es: '¿Se supervisa la deuda técnica?' },
    gap: { en: 'Technical debt is not monitored', es: 'La deuda técnica no se supervisa' } },

  // C. Security & Risk
  { id: 'C1', category: 'security', service: 'audit',
    text: { en: 'Are security responsibilities defined?', es: '¿Están definidas las responsabilidades de seguridad?' },
    gap: { en: 'Security responsibilities are not defined', es: 'Las responsabilidades de seguridad no están definidas' } },
  { id: 'C2', category: 'security', service: 'audit',
    text: { en: 'Are backup and recovery procedures established (and tested)?', es: '¿Existen procedimientos de copia de seguridad y recuperación (y se prueban)?' },
    gap: { en: 'Backup and recovery procedures are incomplete or untested', es: 'Los procedimientos de copia y recuperación están incompletos o sin probar' } },
  { id: 'C3', category: 'security', service: 'audit',
    text: { en: 'Are access permissions reviewed periodically?', es: '¿Se revisan periódicamente los permisos de acceso?' },
    gap: { en: 'Access permissions are not reviewed regularly', es: 'Los permisos de acceso no se revisan con regularidad' } },
  { id: 'C4', category: 'security', service: 'consultancy',
    text: { en: 'Are project risks assessed periodically?', es: '¿Se evalúan periódicamente los riesgos del proyecto?' },
    gap: { en: 'Risks are not assessed periodically', es: 'Los riesgos no se evalúan periódicamente' } },

  // D. Project Delivery
  { id: 'D1', category: 'delivery', service: 'oversight',
    text: { en: 'Are milestones tracked against a plan?', es: '¿Se hace seguimiento de los hitos frente a un plan?' },
    gap: { en: 'Milestones are not tracked against a plan', es: 'Los hitos no se siguen frente a un plan' } },
  { id: 'D2', category: 'delivery', service: 'oversight',
    text: { en: 'Are deliverables formally reviewed before acceptance?', es: '¿Se revisan formalmente los entregables antes de aceptarlos?' },
    gap: { en: 'Deliverables are not formally reviewed', es: 'Los entregables no se revisan formalmente' } },
  { id: 'D3', category: 'delivery', service: 'oversight',
    text: { en: 'Are testing and acceptance criteria defined?', es: '¿Están definidos los criterios de pruebas y aceptación?' },
    gap: { en: 'Testing and acceptance criteria are not defined', es: 'Los criterios de pruebas y aceptación no están definidos' } },
  { id: 'D4', category: 'delivery', service: 'oversight',
    text: { en: 'Are implementation issues documented and followed up?', es: '¿Se documentan y se hace seguimiento de las incidencias de implantación?' },
    gap: { en: 'Implementation issues are not documented', es: 'Las incidencias de implantación no se documentan' } },

  // E. Vendor & Governance
  { id: 'E1', category: 'vendor', service: 'oversight',
    text: { en: 'Are vendor responsibilities clearly defined?', es: '¿Están claramente definidas las responsabilidades del proveedor?' },
    gap: { en: 'Vendor responsibilities are unclear', es: 'Las responsabilidades del proveedor no están claras' } },
  { id: 'E2', category: 'vendor', service: 'oversight',
    text: { en: 'Are contractual deliverables measurable?', es: '¿Son medibles los entregables contractuales?' },
    gap: { en: 'Contractual deliverables are not measurable', es: 'Los entregables contractuales no son medibles' } },
  { id: 'E3', category: 'vendor', service: 'audit',
    text: { en: 'Is technical documentation accessible to your organization?', es: '¿Tiene su organización acceso a la documentación técnica?' },
    gap: { en: 'Technical documentation is not accessible to your organization', es: 'Su organización no tiene acceso a la documentación técnica' } },
  { id: 'E4', category: 'vendor', service: 'audit',
    text: { en: 'Has an independent technical review been carried out or planned?', es: '¿Se ha realizado o planificado una revisión técnica independiente?' },
    gap: { en: 'No independent technical review has been carried out or planned', es: 'No se ha realizado ni planificado una revisión técnica independiente' } },

  // F. AI & Automation (shown on request)
  { id: 'F1', category: 'ai', service: 'ai',
    text: { en: 'Have suitable automation opportunities been identified and prioritized?', es: '¿Se han identificado y priorizado las oportunidades de automatización adecuadas?' },
    gap: { en: 'Automation opportunities are not identified or prioritized', es: 'Las oportunidades de automatización no están identificadas ni priorizadas' } },
  { id: 'F2', category: 'ai', service: 'ai',
    text: { en: 'Is the quality and ownership of your data understood?', es: '¿Se conocen la calidad y la titularidad de sus datos?' },
    gap: { en: 'Data quality and ownership are not well understood', es: 'La calidad y la titularidad de los datos no se conocen bien' } },
  { id: 'F3', category: 'ai', service: 'ai',
    text: { en: 'Have AI-related risks (accuracy, privacy, bias, dependency) been considered?', es: '¿Se han considerado los riesgos de la IA (precisión, privacidad, sesgos, dependencia)?' },
    gap: { en: 'AI-related risks have not been considered', es: 'No se han considerado los riesgos asociados a la IA' } },
  { id: 'F4', category: 'ai', service: 'ai',
    text: { en: 'Is human oversight of automated or AI-assisted decisions defined?', es: '¿Está definida la supervisión humana de las decisiones automatizadas o asistidas por IA?' },
    gap: { en: 'Human oversight of automated decisions is not defined', es: 'No está definida la supervisión humana de las decisiones automatizadas' } },

  // Public-sector context questions
  { id: 'P1', category: 'public', service: 'tender',
    text: { en: 'Is the procurement documentation (technical specifications, evaluation criteria, award record) complete and traceable?', es: '¿Es completa y trazable la documentación de contratación (pliegos técnicos, criterios de valoración, constancia de la adjudicación)?' },
    gap: { en: 'Procurement documentation is incomplete or hard to trace', es: 'La documentación de contratación es incompleta o difícil de trazar' } },
  { id: 'P2', category: 'public', service: 'tender',
    text: { en: 'Are technical requirements written in a vendor-neutral way?', es: '¿Se redactan los requisitos técnicos de forma neutral respecto a los proveedores?' },
    gap: { en: 'Technical requirements may not be vendor-neutral', es: 'Los requisitos técnicos pueden no ser neutrales respecto a los proveedores' } },
  { id: 'P3', category: 'public', service: 'oversight',
    text: { en: 'Are acceptance criteria defined in the contract and linked to milestones?', es: '¿Están definidos los criterios de aceptación en el contrato y vinculados a los hitos?' },
    gap: { en: 'Acceptance criteria are not linked to contract milestones', es: 'Los criterios de aceptación no están vinculados a los hitos del contrato' } },
  { id: 'P4', category: 'public', service: 'oversight',
    text: { en: 'Is supplier performance overseen by someone independent of the supplier, with decisions on record?', es: '¿Supervisa el rendimiento del proveedor alguien independiente de éste, dejando constancia de las decisiones?' },
    gap: { en: 'Supplier oversight is not independent or not recorded', es: 'La supervisión del proveedor no es independiente o no queda registrada' } },
];

export const answerOptions: { value: AnswerValue; label: L10n }[] = [
  { value: 'full', label: { en: 'Yes, fully implemented', es: 'Sí, totalmente implantado' } },
  { value: 'partial', label: { en: 'Partially implemented', es: 'Parcialmente implantado' } },
  { value: 'none', label: { en: 'Not implemented', es: 'No implantado' } },
  { value: 'unsure', label: { en: 'Not sure', es: 'No lo sé' } },
  { value: 'na', label: { en: 'Not applicable', es: 'No aplica' } },
];

export const maturityLabels: Record<'strong' | 'developing' | 'attention' | 'insufficient', L10n> = {
  strong: { en: 'Strong Foundations', es: 'Bases Sólidas' },
  developing: { en: 'Developing', es: 'En Desarrollo' },
  attention: { en: 'Needs Attention', es: 'Requiere Atención' },
  insufficient: { en: 'Insufficient Information', es: 'Información Insuficiente' },
};

export const audienceOptions: { value: Audience; label: L10n }[] = [
  { value: 'private', label: { en: 'Private Business', es: 'Empresa privada' } },
  { value: 'public', label: { en: 'Public Institution', es: 'Institución pública' } },
  { value: 'nonprofit', label: { en: 'Nonprofit / Association', es: 'Entidad sin ánimo de lucro / Asociación' } },
  { value: 'other', label: { en: 'Other', es: 'Otro' } },
];
