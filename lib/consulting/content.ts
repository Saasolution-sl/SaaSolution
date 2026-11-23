import type { Lang } from '../health-check/questions.ts';
import type { PageKey } from './routes.ts';
import translations from './translations.json';

export type L = { en: string; es: string };
export type LL = { en: string[]; es: string[] };
/** Every language the site offers. English/Spanish are authored natively; the rest come from translations.json. */
export type SiteLocale = Lang | 'nl' | 'ar' | 'pt' | 'fr' | 'de';
const catalogue = translations as Record<string, Record<string, string>>;
const other = (text: string, locale: SiteLocale) => catalogue[locale]?.[text] ?? text;
export const tr = (v: L, lang: SiteLocale) => (lang === 'en' || lang === 'es' ? v[lang] : other(v.en, lang));
export const trl = (v: LL, lang: SiteLocale) => (lang === 'en' || lang === 'es' ? v[lang] : v.en.map((s) => other(s, lang)));

/* ------------------------------------------------------------------ */
/* Company facts — only what is already published on the site.         */
/* ------------------------------------------------------------------ */
export const company = {
  name: 'SaaSolutions SL',
  brand: 'SaaSolution',
  email: 'hello@saasolution.es',
  location: 'Ceuta, Spain',
};

export const brandLine: L = {
  en: 'Technology Development, Independent IT Auditing & Strategic Consultancy',
  es: 'Desarrollo Tecnológico, Auditoría Informática Independiente y Consultoría Estratégica',
};

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */
export type ServiceContent = {
  page: PageKey;
  key: 'consultancy' | 'audit' | 'tender' | 'oversight' | 'ai';
  name: L;
  summary: L;
  metaTitle: L;
  metaDescription: L;
  recognition: L;
  relevance: L;
  problems: LL;
  capabilities: LL;
  engagement: LL;
  deliverables: LL;
  boundaries: LL;
  cta: L;
};

export const services: ServiceContent[] = [
  {
    page: 'consultancy', key: 'consultancy',
    name: { en: 'IT Consultancy & Digital Transformation', es: 'Consultoría Tecnológica y Transformación Digital' },
    summary: {
      en: 'Strategy, architecture and technology choices that match what the organization actually needs.',
      es: 'Estrategia, arquitectura y decisiones tecnológicas alineadas con lo que la organización realmente necesita.',
    },
    metaTitle: { en: 'IT Consultancy & Digital Transformation in Spain', es: 'Consultoría Tecnológica y Transformación Digital en España' },
    metaDescription: {
      en: 'Technology strategy, architecture, cloud advisory, vendor evaluation and legacy modernization for businesses and institutions in Ceuta, Spain and abroad.',
      es: 'Estrategia tecnológica, arquitectura, asesoramiento cloud, evaluación de proveedores y modernización de sistemas para empresas e instituciones en Ceuta, España y el extranjero.',
    },
    recognition: {
      en: 'Is your technology investment delivering the results you expected?',
      es: '¿Está su inversión tecnológica dando los resultados que esperaba?',
    },
    relevance: {
      en: 'Many organizations buy or build technology before the objective, the requirements and the constraints are written down. We help you decide what to build, buy or retire — and in what order — before money is committed.',
      es: 'Muchas organizaciones compran o desarrollan tecnología antes de dejar por escrito el objetivo, los requisitos y las limitaciones. Le ayudamos a decidir qué construir, qué comprar y qué retirar —y en qué orden— antes de comprometer presupuesto.',
    },
    problems: {
      en: ['Several systems that do not talk to each other', 'A legacy application that is costly or risky to change', 'Competing vendor proposals that are hard to compare', 'No shared view of the technology roadmap', 'Uncertainty about cloud, hosting or build-versus-buy choices'],
      es: ['Varios sistemas que no se comunican entre sí', 'Una aplicación heredada costosa o arriesgada de modificar', 'Propuestas de proveedores difíciles de comparar', 'Ausencia de una visión compartida de la hoja de ruta tecnológica', 'Incertidumbre sobre la nube, el alojamiento o la decisión de construir o comprar'],
    },
    capabilities: {
      en: ['IT strategy and technology roadmaps', 'Business process analysis', 'Digital transformation planning', 'Infrastructure architecture', 'Cloud advisory', 'Technology selection', 'Vendor evaluation', 'Legacy modernization', 'Systems integration strategy', 'Operational optimization', 'Technology feasibility assessments'],
      es: ['Estrategia informática y hojas de ruta tecnológicas', 'Análisis de procesos de negocio', 'Planificación de la transformación digital', 'Arquitectura de infraestructuras', 'Asesoramiento en la nube', 'Selección de tecnología', 'Evaluación de proveedores', 'Modernización de sistemas heredados', 'Estrategia de integración de sistemas', 'Optimización operativa', 'Estudios de viabilidad tecnológica'],
    },
    engagement: {
      en: ['A first conversation to understand objectives, constraints and context', 'A scoped assessment of current systems, processes and requirements', 'Options with trade-offs, costs drivers and risks made explicit', 'A prioritized roadmap you can use with or without SaaSolution'],
      es: ['Una primera conversación para entender objetivos, limitaciones y contexto', 'Una evaluación acotada de sistemas, procesos y requisitos actuales', 'Alternativas con sus ventajas, factores de coste y riesgos explícitos', 'Una hoja de ruta priorizada que podrá utilizar con o sin SaaSolution'],
    },
    deliverables: {
      en: ['Technology strategy or roadmap document', 'Current-state and target-state architecture overview', 'Requirements and constraints register', 'Options analysis with a documented recommendation', 'Vendor comparison criteria and scoring sheet'],
      es: ['Documento de estrategia u hoja de ruta tecnológica', 'Visión de la arquitectura actual y objetivo', 'Registro de requisitos y limitaciones', 'Análisis de alternativas con recomendación documentada', 'Criterios de comparación de proveedores y hoja de puntuación'],
    },
    boundaries: {
      en: ['Deliverables depend on the scope agreed in writing.', 'We do not guarantee specific financial outcomes.', 'If we also build the solution, the development and any independent review are kept separate (see our independence policy).'],
      es: ['Los entregables dependen del alcance acordado por escrito.', 'No garantizamos resultados económicos concretos.', 'Si además desarrollamos la solución, el desarrollo y cualquier revisión independiente se mantienen separados (véase nuestra política de independencia).'],
    },
    cta: { en: 'Discuss Your Technology Project', es: 'Comentar su Proyecto Tecnológico' },
  },
  {
    page: 'audit', key: 'audit',
    name: { en: 'Independent IT Auditing', es: 'Auditoría Informática Independiente' },
    summary: {
      en: 'Evidence-based technical assessments of systems, code, security posture and vendor deliverables.',
      es: 'Evaluaciones técnicas basadas en evidencias de sistemas, código, seguridad y entregables de proveedores.',
    },
    metaTitle: { en: 'Independent IT Auditing in Spain', es: 'Auditoría Informática Independiente en España' },
    metaDescription: {
      en: 'Evidence-based architecture, code quality, cybersecurity posture and cloud configuration reviews, with documented scope, findings and limitations.',
      es: 'Revisiones basadas en evidencias de arquitectura, calidad del código, seguridad y configuración cloud, con alcance, hallazgos y limitaciones documentados.',
    },
    recognition: {
      en: 'Are your software vendors meeting their commitments?',
      es: '¿Están cumpliendo sus proveedores de software con lo prometido?',
    },
    relevance: {
      en: 'When you depend on a system you did not build — or one you did — an independent technical opinion tells you what is really there: how it is designed, how well it is built, and where the risks are.',
      es: 'Cuando depende de un sistema que no ha construido —o que sí construyó— una opinión técnica independiente le dice qué hay realmente: cómo está diseñado, cómo está construido y dónde están los riesgos.',
    },
    problems: {
      en: ['A delivered system that you cannot verify', 'Concern about code quality or hidden technical debt', 'Unclear security posture or backup arrangements', 'Missing or outdated technical documentation', 'Need for a neutral opinion before a major investment or acceptance'],
      es: ['Un sistema entregado que no puede verificar', 'Dudas sobre la calidad del código o la deuda técnica oculta', 'Postura de seguridad o copias de seguridad poco claras', 'Documentación técnica ausente o desactualizada', 'Necesidad de una opinión neutral antes de una inversión importante o de la aceptación'],
    },
    capabilities: {
      en: ['Software architecture assessments', 'Source code quality reviews', 'Cybersecurity posture assessments', 'Infrastructure assessments', 'Cloud configuration reviews', 'Identity and access management reviews', 'Backup and disaster recovery reviews', 'Technical documentation assessments', 'Technical debt analysis', 'Vendor deliverable verification', 'Remediation recommendations'],
      es: ['Evaluaciones de arquitectura de software', 'Revisiones de calidad del código fuente', 'Evaluaciones de la postura de ciberseguridad', 'Evaluaciones de infraestructura', 'Revisiones de configuración cloud', 'Revisiones de gestión de identidades y accesos', 'Revisiones de copias de seguridad y recuperación ante desastres', 'Evaluación de la documentación técnica', 'Análisis de deuda técnica', 'Verificación de entregables de proveedores', 'Recomendaciones de remediación'],
    },
    engagement: {
      en: ['Agree the scope, questions to answer and access needed — in writing', 'Declare any relevant conflict of interest before work starts', 'Collect and examine evidence within the agreed scope', 'Report findings, their evidence and the limits of the assessment'],
      es: ['Acordar por escrito el alcance, las preguntas a responder y los accesos necesarios', 'Declarar cualquier conflicto de interés relevante antes de comenzar', 'Recopilar y examinar evidencias dentro del alcance acordado', 'Informar de los hallazgos, sus evidencias y los límites de la evaluación'],
    },
    deliverables: {
      en: ['Assessment report with findings ranked by severity and evidence', 'Statement of scope, method and limitations', 'Prioritized remediation recommendations', 'Executive summary for non-technical decision makers'],
      es: ['Informe de evaluación con hallazgos clasificados por gravedad y evidencia', 'Declaración de alcance, método y limitaciones', 'Recomendaciones de remediación priorizadas', 'Resumen ejecutivo para responsables no técnicos'],
    },
    boundaries: {
      en: ['Our assessments are evidence-based and limited to the agreed scope.', 'They are technical assessments, not statutory audits and not certifications issued by an accredited body.', 'We do not present a review of our own work as an independent third-party audit.'],
      es: ['Nuestras evaluaciones se basan en evidencias y se limitan al alcance acordado.', 'Son evaluaciones técnicas: no constituyen auditorías legales ni certificaciones emitidas por un organismo acreditado.', 'No presentamos la revisión de nuestro propio trabajo como una auditoría independiente de terceros.'],
    },
    cta: { en: 'Get an Independent Technical Perspective', es: 'Obtener una Perspectiva Técnica Independiente' },
  },
  {
    page: 'tender', key: 'tender',
    name: { en: 'Public Tender & Procurement Advisory', es: 'Asesoramiento Técnico en Licitaciones y Contratación Pública' },
    summary: {
      en: 'Technical requirements, specifications and proposal evaluation support for technology procurement.',
      es: 'Apoyo técnico en requisitos, especificaciones y evaluación de ofertas para la contratación de tecnología.',
    },
    metaTitle: { en: 'Technical Advisory for Public Tenders & Procurement', es: 'Asesoramiento Técnico en Licitaciones y Contratación Pública' },
    metaDescription: {
      en: 'Vendor-neutral technical support for technology procurement: requirements analysis, specification support, proposal evaluation and acceptance criteria.',
      es: 'Apoyo técnico neutral para la contratación de tecnología: análisis de requisitos, apoyo a pliegos, evaluación de ofertas y criterios de aceptación.',
    },
    recognition: {
      en: 'Could technical risks affect your next procurement?',
      es: '¿Podrían los riesgos técnicos afectar a su próxima contratación?',
    },
    relevance: {
      en: 'Technology procurements often fail on technical detail: requirements that are vague, specifications that favour one supplier, or acceptance criteria nobody can measure. We provide the technical analysis that supports a sound procurement file.',
      es: 'Las contrataciones tecnológicas suelen fallar en el detalle técnico: requisitos imprecisos, especificaciones que favorecen a un proveedor o criterios de aceptación que nadie puede medir. Aportamos el análisis técnico que respalda un expediente de contratación sólido.',
    },
    problems: {
      en: ['Technical requirements that are incomplete or ambiguous', 'Uncertainty over whether a project is technically feasible', 'Comparing technical proposals fairly and consistently', 'Acceptance criteria that cannot be verified', 'Limited in-house technical capacity to assess bids'],
      es: ['Requisitos técnicos incompletos o ambiguos', 'Dudas sobre la viabilidad técnica de un proyecto', 'Comparar ofertas técnicas de forma justa y homogénea', 'Criterios de aceptación que no se pueden verificar', 'Capacidad técnica interna limitada para valorar ofertas'],
    },
    capabilities: {
      en: ['Technical requirements analysis', 'Procurement feasibility assessments', 'Technical specification preparation support', 'Technical proposal evaluation', 'Vendor-neutral solution assessment', 'Acceptance criteria development', 'Technical risk analysis', 'Implementation planning', 'Technical documentation support', 'Independent technical expert reports'],
      es: ['Análisis de requisitos técnicos', 'Evaluaciones de viabilidad de la contratación', 'Apoyo en la preparación de especificaciones técnicas', 'Evaluación técnica de propuestas', 'Evaluación de soluciones neutral respecto a proveedores', 'Elaboración de criterios de aceptación', 'Análisis de riesgos técnicos', 'Planificación de la implantación', 'Apoyo en documentación técnica', 'Informes técnicos de experto independiente'],
    },
    engagement: {
      en: ['Understand the need, budget envelope and constraints of the contracting body', 'Analyse requirements and test them for clarity, neutrality and measurability', 'Support drafting of technical specifications and acceptance criteria', 'Where engaged, provide a documented technical evaluation of proposals'],
      es: ['Comprender la necesidad, el marco presupuestario y las limitaciones del órgano de contratación', 'Analizar los requisitos y comprobar su claridad, neutralidad y medibilidad', 'Apoyar la redacción de especificaciones técnicas y criterios de aceptación', 'Cuando se encargue, aportar una evaluación técnica documentada de las ofertas'],
    },
    deliverables: {
      en: ['Technical requirements document', 'Feasibility and technical risk analysis', 'Draft technical specification content for the contracting body to review', 'Proposal evaluation report against the published criteria', 'Acceptance test criteria'],
      es: ['Documento de requisitos técnicos', 'Análisis de viabilidad y de riesgos técnicos', 'Borrador de contenido técnico del pliego para su revisión por el órgano de contratación', 'Informe de evaluación de ofertas conforme a los criterios publicados', 'Criterios de pruebas de aceptación'],
    },
    boundaries: {
      en: ['This is technical consultancy, not legal advice. Legal and procedural questions under Ley 9/2017, de Contratos del Sector Público, remain with the contracting body and its legal advisers.', 'We do not guarantee tender outcomes and have no influence over award decisions.', 'We will not advise a bidder and the contracting body on the same procedure.'],
      es: ['Se trata de consultoría técnica, no de asesoramiento jurídico. Las cuestiones legales y de procedimiento conforme a la Ley 9/2017, de Contratos del Sector Público, corresponden al órgano de contratación y a sus asesores jurídicos.', 'No garantizamos resultados en licitaciones ni tenemos influencia alguna sobre las decisiones de adjudicación.', 'No asesoraremos a un licitador y al órgano de contratación en el mismo procedimiento.'],
    },
    cta: { en: 'Discuss Your Project’s Technical Requirements', es: 'Analicemos los Requisitos Técnicos de su Proyecto' },
  },
  {
    page: 'oversight', key: 'oversight',
    name: { en: 'Project Oversight & Quality Assurance', es: 'Supervisión de Proyectos y Aseguramiento de la Calidad' },
    summary: {
      en: 'Independent monitoring of third-party delivery: milestones, testing, acceptance and risk reporting.',
      es: 'Seguimiento independiente de proyectos de terceros: hitos, pruebas, aceptación e informes de riesgos.',
    },
    metaTitle: { en: 'Technology Project Oversight & Software Quality Assurance', es: 'Supervisión de Proyectos Tecnológicos y Aseguramiento de la Calidad' },
    metaDescription: {
      en: 'Independent oversight of technology projects: milestone verification, requirements traceability, testing strategy, acceptance testing and risk reporting.',
      es: 'Supervisión independiente de proyectos tecnológicos: verificación de hitos, trazabilidad de requisitos, estrategia de pruebas, pruebas de aceptación e informes de riesgos.',
    },
    recognition: {
      en: 'Do you have someone checking that the project is delivering what was agreed?',
      es: '¿Tiene a alguien que compruebe que el proyecto entrega lo acordado?',
    },
    relevance: {
      en: 'When a supplier builds your system, you still need to know whether it is on track and fit for purpose. We act as your technical eyes on the project, representing your technical interests with evidence rather than opinion.',
      es: 'Cuando un proveedor construye su sistema, usted sigue necesitando saber si va por buen camino y si es adecuado para su fin. Actuamos como su apoyo técnico en el proyecto, defendiendo sus intereses técnicos con evidencias y no con opiniones.',
    },
    problems: {
      en: ['Progress reports that are hard to verify', 'Milestones accepted without objective testing', 'Requirements that drift or are not traceable', 'Quality problems found only after go-live', 'No one on your side able to challenge the supplier technically'],
      es: ['Informes de avance difíciles de verificar', 'Hitos aceptados sin pruebas objetivas', 'Requisitos que se desvían o no son trazables', 'Problemas de calidad detectados solo tras la puesta en producción', 'Nadie de su lado capaz de cuestionar técnicamente al proveedor'],
    },
    capabilities: {
      en: ['Independent project monitoring', 'Milestone verification', 'Requirements traceability', 'Software testing strategy', 'Vendor performance assessment', 'Implementation quality reviews', 'Acceptance testing', 'Risk reporting', 'Documentation verification', 'Post-implementation assessment'],
      es: ['Seguimiento independiente de proyectos', 'Verificación de hitos', 'Trazabilidad de requisitos', 'Estrategia de pruebas de software', 'Evaluación del desempeño del proveedor', 'Revisiones de la calidad de la implantación', 'Pruebas de aceptación', 'Informes de riesgos', 'Verificación de la documentación', 'Evaluación posterior a la implantación'],
    },
    engagement: {
      en: ['Agree what is overseen, how often, and what evidence is required', 'Confirm independence: we do not oversee projects we have a stake in', 'Verify milestones, tests and documentation against the contract and requirements', 'Report progress, risks and acceptance recommendations to you'],
      es: ['Acordar qué se supervisa, con qué frecuencia y qué evidencias se requieren', 'Confirmar la independencia: no supervisamos proyectos en los que tengamos algún interés', 'Verificar hitos, pruebas y documentación frente al contrato y los requisitos', 'Informarle del avance, los riesgos y las recomendaciones de aceptación'],
    },
    deliverables: {
      en: ['Periodic oversight and risk reports', 'Requirements traceability matrix', 'Test strategy and acceptance test results', 'Milestone verification records', 'Post-implementation assessment'],
      es: ['Informes periódicos de supervisión y riesgos', 'Matriz de trazabilidad de requisitos', 'Estrategia de pruebas y resultados de las pruebas de aceptación', 'Registros de verificación de hitos', 'Evaluación posterior a la implantación'],
    },
    boundaries: {
      en: ['We represent the client’s technical interests, subject to the independence requirements below.', 'We do not take over contractual or legal decisions; those stay with you.', 'We will decline to oversee a project where independence cannot be maintained.'],
      es: ['Representamos los intereses técnicos del cliente, sujetos a los requisitos de independencia indicados más abajo.', 'No asumimos decisiones contractuales ni jurídicas; éstas permanecen en su organización.', 'Rechazaremos supervisar un proyecto en el que no pueda mantenerse la independencia.'],
    },
    cta: { en: 'Get an Independent Technical Perspective', es: 'Obtener una Perspectiva Técnica Independiente' },
  },
  {
    page: 'ai', key: 'ai',
    name: { en: 'AI, Automation & Systems Integration', es: 'Inteligencia Artificial, Automatización e Integración de Sistemas' },
    summary: {
      en: 'Practical, governed adoption of AI and automation connected to the systems you already run.',
      es: 'Adopción práctica y gobernada de IA y automatización conectada a los sistemas que ya utiliza.',
    },
    metaTitle: { en: 'AI, Automation & Systems Integration Consultancy', es: 'Consultoría de IA, Automatización e Integración de Sistemas' },
    metaDescription: {
      en: 'AI readiness, workflow automation, API and data integration, and responsible AI governance with human oversight, focused on measurable objectives.',
      es: 'Preparación para la IA, automatización de procesos, integración de APIs y datos, y gobernanza responsable de la IA con supervisión humana, orientada a objetivos medibles.',
    },
    recognition: {
      en: 'Are you unsure where AI or automation would genuinely help — and where it would not?',
      es: '¿No tiene claro dónde la IA o la automatización le ayudarían realmente, y dónde no?',
    },
    relevance: {
      en: 'We start from your processes and data, not from the technology. The aim is a small number of well-chosen, measurable improvements with clear human oversight, connected to the systems you already use.',
      es: 'Partimos de sus procesos y datos, no de la tecnología. El objetivo es un número reducido de mejoras bien elegidas y medibles, con supervisión humana clara, conectadas a los sistemas que ya utiliza.',
    },
    problems: {
      en: ['Repetitive manual work between disconnected systems', 'Pressure to “use AI” without a clear use case', 'Doubts about data quality, privacy or accuracy of AI output', 'Legacy systems that cannot exchange data', 'No policy on who reviews automated decisions'],
      es: ['Trabajo manual repetitivo entre sistemas desconectados', 'Presión por «usar IA» sin un caso de uso claro', 'Dudas sobre la calidad de los datos, la privacidad o la exactitud de la IA', 'Sistemas heredados que no pueden intercambiar datos', 'Ausencia de criterios sobre quién revisa las decisiones automatizadas'],
    },
    capabilities: {
      en: ['AI readiness assessments', 'AI adoption strategy', 'Business workflow automation', 'API integration', 'Legacy system modernization', 'AI assistant architecture', 'Agent orchestration', 'Data integration', 'Responsible AI governance', 'Human oversight and monitoring', 'Automation risk assessment'],
      es: ['Evaluaciones de preparación para la IA', 'Estrategia de adopción de la IA', 'Automatización de procesos de negocio', 'Integración de APIs', 'Modernización de sistemas heredados', 'Arquitectura de asistentes de IA', 'Orquestación de agentes', 'Integración de datos', 'Gobernanza responsable de la IA', 'Supervisión y monitorización humanas', 'Evaluación de riesgos de la automatización'],
    },
    engagement: {
      en: ['Map candidate processes and the data they depend on', 'Score opportunities by value, feasibility and risk', 'Define measurable objectives and human-oversight rules', 'Optionally build or integrate a pilot, then review the results honestly'],
      es: ['Identificar los procesos candidatos y los datos de los que dependen', 'Puntuar las oportunidades según valor, viabilidad y riesgo', 'Definir objetivos medibles y reglas de supervisión humana', 'Opcionalmente, construir o integrar un piloto y revisar los resultados con honestidad'],
    },
    deliverables: {
      en: ['AI and automation opportunity assessment', 'Measurable objectives and success metrics', 'Data and integration architecture', 'AI risk register and oversight model', 'Pilot plan or working integration, if engaged'],
      es: ['Evaluación de oportunidades de IA y automatización', 'Objetivos y métricas de éxito medibles', 'Arquitectura de datos e integración', 'Registro de riesgos de IA y modelo de supervisión', 'Plan piloto o integración operativa, si se encarga'],
    },
    boundaries: {
      en: ['We set measurable objectives but do not guarantee specific financial outcomes.', 'Automated decisions affecting people keep a defined human reviewer.', 'Where we also build the solution, an independent review is a separate engagement.'],
      es: ['Fijamos objetivos medibles, pero no garantizamos resultados económicos concretos.', 'Las decisiones automatizadas que afectan a personas mantienen un revisor humano definido.', 'Cuando además construimos la solución, una revisión independiente es un encargo distinto.'],
    },
    cta: { en: 'Explore Your Technology Options', es: 'Explore sus Opciones Tecnológicas' },
  },
];

export const serviceByPage = (page: PageKey) => services.find((s) => s.page === page);

/* ------------------------------------------------------------------ */
/* Engagement methodology                                               */
/* ------------------------------------------------------------------ */
export const methodology: { name: L; text: L }[] = [
  { name: { en: 'Discover', es: 'Descubrir' }, text: { en: 'We learn your business objectives, context and challenges.', es: 'Conocemos sus objetivos de negocio, su contexto y sus retos.' } },
  { name: { en: 'Assess', es: 'Evaluar' }, text: { en: 'Technical assessment and requirements analysis within an agreed scope.', es: 'Evaluación técnica y análisis de requisitos dentro de un alcance acordado.' } },
  { name: { en: 'Recommend', es: 'Recomendar' }, text: { en: 'Clear recommendations and prioritized actions, with trade-offs explained.', es: 'Recomendaciones claras y acciones priorizadas, explicando las alternativas.' } },
  { name: { en: 'Support', es: 'Acompañar' }, text: { en: 'Optional implementation or oversight support, if you want it.', es: 'Apoyo opcional en la implantación o la supervisión, si lo desea.' } },
  { name: { en: 'Validate', es: 'Validar' }, text: { en: 'Validation, reporting and a plan for continuous improvement.', es: 'Validación, informes y un plan de mejora continua.' } },
];
export const methodologyNote: L = {
  en: 'The stages that apply to your engagement depend on the scope we agree together; not every engagement needs all five.',
  es: 'Las fases que se aplican a su encargo dependen del alcance que acordemos; no todos los encargos requieren las cinco.',
};

/* ------------------------------------------------------------------ */
/* Independence                                                         */
/* ------------------------------------------------------------------ */
export const independence = {
  heading: { en: 'Independent Assessment. Transparent Methodology.', es: 'Evaluación Independiente. Metodología Transparente.' } as L,
  intro: {
    en: 'SaaSolution both builds software and advises on it. That is why independence is a written policy, not a slogan.',
    es: 'SaaSolution desarrolla software y también asesora sobre él. Por eso la independencia es una política escrita, no un eslogan.',
  } as L,
  points: {
    en: [
      'We disclose relevant conflicts of interest before an engagement starts.',
      'We define the assessment scope in writing.',
      'Findings are evidence-based and traceable to what we examined.',
      'We separate development and independent review responsibilities.',
      'We never present a review of our own work as an independent third-party audit.',
      'We protect confidential information.',
      'We document conclusions and their limitations.',
      'We may decline an engagement where independence cannot be maintained.',
    ],
    es: [
      'Declaramos los conflictos de interés relevantes antes de iniciar un encargo.',
      'Definimos por escrito el alcance de la evaluación.',
      'Los hallazgos se basan en evidencias y son trazables a lo que hemos examinado.',
      'Separamos las responsabilidades de desarrollo y de revisión independiente.',
      'Nunca presentamos la revisión de nuestro propio trabajo como una auditoría independiente de terceros.',
      'Protegemos la información confidencial.',
      'Documentamos las conclusiones y sus limitaciones.',
      'Podemos rechazar un encargo cuando no sea posible mantener la independencia.',
    ],
  } as LL,
};

/* ------------------------------------------------------------------ */
/* What happens after an inquiry (confidence)                           */
/* ------------------------------------------------------------------ */
export const afterInquiry = {
  heading: { en: 'What happens after you get in touch', es: 'Qué ocurre después de contactar con nosotros' } as L,
  steps: {
    en: [
      'We read your message and reply by email to arrange an initial conversation.',
      'In that conversation we listen: your objectives, the project, and what is — and is not — in doubt. It is a conversation, not a sales presentation.',
      'If there is a fit, we propose a written scope and deliverables. You decide whether to proceed.',
      'We can sign a confidentiality agreement before you share project details.',
    ],
    es: [
      'Leemos su mensaje y le respondemos por correo electrónico para concertar una primera conversación.',
      'En esa conversación le escuchamos: sus objetivos, el proyecto y qué es —y qué no— motivo de duda. Es una conversación, no una presentación comercial.',
      'Si hay encaje, proponemos por escrito un alcance y unos entregables. Usted decide si continúa.',
      'Podemos firmar un acuerdo de confidencialidad antes de que comparta detalles del proyecto.',
    ],
  } as LL,
  note: {
    en: 'Please do not include passwords, credentials or sensitive system details in your first message.',
    es: 'Le rogamos que no incluya contraseñas, credenciales ni detalles sensibles de sistemas en su primer mensaje.',
  } as L,
};

/* ------------------------------------------------------------------ */
/* Audience pathways                                                    */
/* ------------------------------------------------------------------ */
export type Pathway = {
  page: PageKey;
  name: L;
  summary: L;
  metaTitle: L;
  metaDescription: L;
  heroTitle: L;
  heroText: L;
  recognition: LL;
  audiences: LL;
  emphasis: { title: L; text: L }[];
  relevantServices: ServiceContent['key'][];
  cta: L;
  extra?: { heading: L; paragraphs: LL; note?: L };
};

export const publicPathway: Pathway = {
  page: 'public',
  name: { en: 'Public Sector & Institutional Services', es: 'Servicios para el Sector Público e Instituciones' },
  summary: { en: 'Transparent, vendor-neutral technical support for institutions, with documented findings.', es: 'Apoyo técnico transparente y neutral para instituciones, con hallazgos documentados.' },
  metaTitle: { en: 'Public Sector Technology Advisory in Ceuta & Spain', es: 'Asesoramiento Tecnológico para el Sector Público en Ceuta y España' },
  metaDescription: {
    en: 'Technical requirements analysis, feasibility assessments, implementation oversight and independent evaluation for public institutions in Ceuta and across Spain.',
    es: 'Análisis de requisitos técnicos, estudios de viabilidad, supervisión de la implantación y evaluación independiente para instituciones públicas en Ceuta y toda España.',
  },
  heroTitle: { en: 'Technology projects that can withstand scrutiny.', es: 'Proyectos tecnológicos que resisten el escrutinio.' },
  heroText: {
    en: 'Public technology projects are accountable to citizens, auditors and funders. We provide vendor-neutral technical analysis and independent evaluation, documented so that decisions can be explained.',
    es: 'Los proyectos tecnológicos públicos rinden cuentas ante la ciudadanía, los órganos de control y los financiadores. Aportamos análisis técnico neutral y evaluación independiente, documentados para que las decisiones puedan explicarse.',
  },
  recognition: {
    en: ['Is the technical specification clear enough to compare bids fairly?', 'Can you demonstrate that a delivered system meets what was contracted?', 'Do you have independent technical capacity to oversee a supplier?'],
    es: ['¿Es la especificación técnica lo bastante clara para comparar ofertas con equidad?', '¿Puede demostrar que el sistema entregado cumple lo contratado?', '¿Dispone de capacidad técnica independiente para supervisar a un proveedor?'],
  },
  audiences: {
    en: ['Government institutions', 'Municipal administrations', 'Regional public agencies', 'Publicly funded organizations', 'Public digital transformation initiatives'],
    es: ['Instituciones de gobierno', 'Administraciones municipales', 'Organismos públicos regionales', 'Organizaciones financiadas con fondos públicos', 'Iniciativas públicas de transformación digital'],
  },
  emphasis: [
    { title: { en: 'Transparency & accountability', es: 'Transparencia y rendición de cuentas' }, text: { en: 'Written scope, documented findings and recorded limitations.', es: 'Alcance por escrito, hallazgos documentados y limitaciones registradas.' } },
    { title: { en: 'Procurement integrity', es: 'Integridad en la contratación' }, text: { en: 'Vendor-neutral requirements and evaluation criteria.', es: 'Requisitos y criterios de evaluación neutrales respecto a los proveedores.' } },
    { title: { en: 'Technical independence', es: 'Independencia técnica' }, text: { en: 'Conflicts disclosed; development and review kept apart.', es: 'Conflictos declarados; desarrollo y revisión separados.' } },
    { title: { en: 'Risk reduction', es: 'Reducción de riesgos' }, text: { en: 'Technical risks identified before commitments are made.', es: 'Riesgos técnicos identificados antes de asumir compromisos.' } },
    { title: { en: 'Public value', es: 'Valor público' }, text: { en: 'Solutions judged on outcomes for users and institutions.', es: 'Soluciones valoradas por sus resultados para usuarios e instituciones.' } },
    { title: { en: 'Long-term maintainability', es: 'Mantenibilidad a largo plazo' }, text: { en: 'Documentation and architecture that outlive a single supplier.', es: 'Documentación y arquitectura que perduran más allá de un único proveedor.' } },
  ],
  relevantServices: ['tender', 'oversight', 'audit', 'consultancy'],
  cta: { en: 'Discuss Your Project’s Technical Requirements', es: 'Analicemos los Requisitos Técnicos de su Proyecto' },
  extra: {
    heading: { en: 'Ceuta and Spanish public institutions', es: 'Ceuta y las instituciones públicas españolas' },
    paragraphs: {
      en: [
        'SaaSolutions SL is based in Ceuta. We are available as a potential partner to institutions in Ceuta and the rest of Spain for technical requirements analysis, project feasibility assessments, implementation oversight and independent evaluations.',
        'Organizations such as PROCESA Ceuta are relevant prospective audiences for this kind of support. We mention them only as a field of interest: SaaSolution has no existing partnership, funding award, endorsement or contract with PROCESA Ceuta or any other public body.',
      ],
      es: [
        'SaaSolutions SL tiene su sede en Ceuta. Estamos disponibles como posible colaborador de instituciones de Ceuta y del resto de España para el análisis de requisitos técnicos, los estudios de viabilidad de proyectos, la supervisión de la implantación y las evaluaciones independientes.',
        'Entidades como PROCESA Ceuta son destinatarios potenciales relevantes para este tipo de apoyo. Las mencionamos únicamente como ámbito de interés: SaaSolution no mantiene ninguna alianza, subvención, aval ni contrato con PROCESA Ceuta ni con ningún otro organismo público.',
      ],
    },
    note: {
      en: 'Procurement questions under Ley 9/2017 are legal matters for the contracting body and its advisers; we provide the technical analysis.',
      es: 'Las cuestiones de contratación conforme a la Ley 9/2017 son materia jurídica del órgano de contratación y sus asesores; nosotros aportamos el análisis técnico.',
    },
  },
};

export const privatePathway: Pathway = {
  page: 'private',
  name: { en: 'Private Business Consultancy', es: 'Consultoría Tecnológica para Empresas' },
  summary: { en: 'Practical technology advice that improves operations and gives you confidence in your investments.', es: 'Asesoramiento tecnológico práctico que mejora las operaciones y da confianza a sus inversiones.' },
  metaTitle: { en: 'Technology Consultancy for Businesses in Spain', es: 'Consultoría Tecnológica para Empresas en España' },
  metaDescription: {
    en: 'Technology consultancy for SMEs, startups, SaaS and hospitality businesses: operational efficiency, automation, integration, security and confident technology investment.',
    es: 'Consultoría tecnológica para pymes, startups, empresas SaaS y hostelería: eficiencia operativa, automatización, integración, seguridad y decisiones de inversión con confianza.',
  },
  heroTitle: { en: 'Technology decisions you can invest in with confidence.', es: 'Decisiones tecnológicas en las que invertir con confianza.' },
  heroText: {
    en: 'We help growing businesses choose the right tools, connect their systems, automate repetitive work and avoid expensive technology mistakes — with advice grounded in how your business actually operates.',
    es: 'Ayudamos a empresas en crecimiento a elegir las herramientas adecuadas, conectar sus sistemas, automatizar el trabajo repetitivo y evitar errores tecnológicos costosos, con un asesoramiento basado en cómo opera realmente su negocio.',
  },
  recognition: {
    en: ['Is your team spending hours moving data between systems?', 'Are you about to commit to a major software investment?', 'Will your current platform still work when the business doubles?'],
    es: ['¿Dedica su equipo horas a mover datos entre sistemas?', '¿Está a punto de comprometerse con una inversión importante en software?', '¿Seguirá funcionando su plataforma actual cuando el negocio se duplique?'],
  },
  audiences: {
    en: ['SMEs', 'Startups', 'SaaS companies', 'Established enterprises', 'Hospitality organizations', 'Service businesses', 'Growing technology-enabled companies'],
    es: ['Pymes', 'Startups', 'Empresas SaaS', 'Grandes empresas consolidadas', 'Organizaciones de hostelería', 'Empresas de servicios', 'Empresas en crecimiento apoyadas en tecnología'],
  },
  emphasis: [
    { title: { en: 'Operational efficiency', es: 'Eficiencia operativa' }, text: { en: 'Remove friction from the processes your team repeats every day.', es: 'Elimine fricciones en los procesos que su equipo repite a diario.' } },
    { title: { en: 'Investment confidence', es: 'Confianza en la inversión' }, text: { en: 'An independent opinion before you sign or build.', es: 'Una opinión independiente antes de firmar o construir.' } },
    { title: { en: 'Scalability & cost control', es: 'Escalabilidad y control de costes' }, text: { en: 'Architecture and tooling that grow without surprises.', es: 'Arquitectura y herramientas que crecen sin sorpresas.' } },
    { title: { en: 'Automation & integration', es: 'Automatización e integración' }, text: { en: 'Connected systems and well-chosen automation.', es: 'Sistemas conectados y automatización bien elegida.' } },
    { title: { en: 'Security', es: 'Seguridad' }, text: { en: 'Practical protection proportionate to your risk.', es: 'Protección práctica y proporcionada a su riesgo.' } },
    { title: { en: 'Sustainable growth', es: 'Crecimiento sostenible' }, text: { en: 'Technology that supports your competitive position over time.', es: 'Tecnología que respalda su posición competitiva a lo largo del tiempo.' } },
  ],
  relevantServices: ['consultancy', 'ai', 'audit', 'oversight'],
  cta: { en: 'Explore How We Can Improve Your Technology Operations', es: 'Descubra Cómo Podemos Mejorar sus Operaciones Tecnológicas' },
};

/* ------------------------------------------------------------------ */
/* Landing page                                                         */
/* ------------------------------------------------------------------ */
export const landing = {
  metaTitle: { en: 'Consulting & Auditing: Independent IT Auditing in Spain', es: 'Consultoría y Auditoría Informática Independiente en España' } as L,
  metaDescription: {
    en: 'SaaSolution helps businesses and public institutions in Ceuta, Spain and abroad make informed technology decisions through consultancy, independent technical assessments and project oversight.',
    es: 'SaaSolution ayuda a empresas e instituciones públicas en Ceuta, España y el extranjero a tomar decisiones tecnológicas fundamentadas mediante consultoría, evaluaciones técnicas independientes y supervisión de proyectos.',
  } as L,
  eyebrow: { en: 'Consulting & Auditing', es: 'Consultoría y Auditoría' } as L,
  heroTitle: { en: 'Technology Expertise. Independent Assurance. Measurable Results.', es: 'Experiencia Tecnológica. Evaluación Independiente. Resultados Medibles.' } as L,
  heroText: {
    en: 'SaaSolution helps businesses and public institutions make informed technology decisions, improve digital operations, and reduce project uncertainty through strategic consultancy, independent technical assessments, and practical implementation expertise.',
    es: 'SaaSolution ayuda a empresas e instituciones públicas a tomar decisiones tecnológicas fundamentadas, mejorar sus operaciones digitales y reducir la incertidumbre de sus proyectos mediante consultoría estratégica, evaluaciones técnicas independientes y experiencia práctica en implementación.',
  } as L,
  pillars: [
    { name: { en: 'We Build.', es: 'Desarrollamos.' }, text: { en: 'Software and integrations designed around your operations.', es: 'Software e integraciones diseñados en torno a sus operaciones.' } },
    { name: { en: 'We Advise.', es: 'Asesoramos.' }, text: { en: 'Independent guidance before you invest.', es: 'Orientación independiente antes de invertir.' } },
    { name: { en: 'We Evaluate.', es: 'Evaluamos.' }, text: { en: 'Technical assessment of third-party solutions and deliveries.', es: 'Evaluación técnica de soluciones y entregas de terceros.' } },
  ] as { name: L; text: L }[],
  problemsHeading: { en: 'Do any of these sound familiar?', es: '¿Le suena alguna de estas situaciones?' } as L,
  problems: [
    { q: { en: 'Is your technology investment delivering the expected results?', es: '¿Está dando su inversión tecnológica los resultados esperados?' }, page: 'consultancy' },
    { q: { en: 'Are your software vendors meeting their commitments?', es: '¿Cumplen sus proveedores de software con lo prometido?' }, page: 'audit' },
    { q: { en: 'Could technical risks affect your next project?', es: '¿Podrían los riesgos técnicos afectar a su próximo proyecto?' }, page: 'oversight' },
    { q: { en: 'Do you need an independent opinion before a major investment?', es: '¿Necesita una opinión independiente antes de una inversión importante?' }, page: 'audit' },
  ] as { q: L; page: PageKey }[],
  servicesHeading: { en: 'Five areas of expertise', es: 'Cinco áreas de especialización' } as L,
  pathwaysHeading: { en: 'Who we work with', es: 'Con quién trabajamos' } as L,
  pathwayLead: { en: 'Choose the path that matches your organization.', es: 'Elija el camino que corresponde a su organización.' } as L,
  healthCheck: {
    heading: { en: 'Technology Project Health Check', es: 'Diagnóstico Inicial de Salud Tecnológica' } as L,
    text: {
      en: 'A five-minute self-assessment that shows where your project is strong and where it may need attention. No account and no contact details needed to see your results. It is educational and preliminary — not an audit.',
      es: 'Una autoevaluación de unos cinco minutos que muestra dónde es sólido su proyecto y dónde puede requerir atención. No necesita cuenta ni datos de contacto para ver los resultados. Es orientativa y preliminar: no es una auditoría.',
    } as L,
  },
  trust: {
    heading: { en: 'How we earn your trust', es: 'Cómo nos ganamos su confianza' } as L,
    items: {
      en: ['Clear scope and deliverables agreed in writing', 'Independence safeguards and conflict disclosure', 'Professional technical explanations, not jargon', 'Confidential handling of your information'],
      es: ['Alcance y entregables claros, acordados por escrito', 'Salvaguardas de independencia y declaración de conflictos', 'Explicaciones técnicas profesionales, sin jerga', 'Tratamiento confidencial de su información'],
    } as LL,
    note: {
      en: 'We do not publish client logos, testimonials or certifications we cannot document. When we have verified references to share, they will appear here.',
      es: 'No publicamos logotipos de clientes, testimonios ni certificaciones que no podamos documentar. Cuando tengamos referencias verificadas que compartir, aparecerán aquí.',
    } as L,
  },
};

/* ------------------------------------------------------------------ */
/* Homepage section                                                     */
/* ------------------------------------------------------------------ */
export const homeSection = {
  eyebrow: { en: 'Consulting & Auditing', es: 'Consultoría y Auditoría' } as L,
  heading: { en: 'Beyond Software Development', es: 'Más Allá del Desarrollo de Software' } as L,
  text: {
    en: 'SaaSolution supports organizations throughout the technology lifecycle — from planning and implementation to independent evaluation.',
    es: 'SaaSolution acompaña a las organizaciones durante todo el ciclo de vida de la tecnología: desde la planificación y la implantación hasta la evaluación independiente.',
  } as L,
  links: [
    { page: 'landing', label: { en: 'Consulting & Auditing', es: 'Consultoría y Auditoría' } },
    { page: 'public', label: { en: 'Public Sector Services', es: 'Servicios para el Sector Público' } },
    { page: 'private', label: { en: 'Private Business Consultancy', es: 'Consultoría Tecnológica para Empresas' } },
    { page: 'healthcheck', label: { en: 'Technology Project Health Check', es: 'Diagnóstico Inicial de Salud Tecnológica' } },
  ] as { page: PageKey; label: L }[],
};
