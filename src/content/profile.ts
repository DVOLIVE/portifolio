/**
 * Landing-page copy: intro, hero, About, section headings and the closing call
 * to action. Facts come from the CV (docs: README → "Sources").
 */
export const intro = {
  line: 'turning data into impact.',
};

export const hero = {
  name: ['Daniel', 'Oliveira'],
  role: 'Data Scientist | Data Engineering | Analytics & AI Automation',
  statement:
    'I transform complex data into practical solutions, combining analytical thinking, engineering and business strategy to create measurable impact.',
  primaryCta: { label: 'Explore My Work', href: '/#expertise' },
};

export const about = {
  title: 'Business thinking. Engineering mindset.',
  lead:
    "I'm a Portuguese-Brazilian data professional based in Portugal. My work sits where business questions meet data engineering, analytics and applied AI.",
  paragraphs: [
    'I learned the commercial side first. At Espaço Veneza Carioca, an events and hospitality business, I started as account manager and became general manager: running sales and pricing strategy on Excel and Access CRM databases, negotiating partnerships, managing suppliers, staff and operations — and finally leading the sale of the company.',
    'At Xerox | Jodrax I moved closer to technology: proposing hardware and software solutions to clients, managing their implementation and writing Python scripts to automate manual tasks.',
    'At MOP, as Data Strategist, data became the job: statistical and geospatial pipelines behind new audience products, machine-learning models to forecast advertising investment, dashboards, RAG-based AI applications for knowledge retrieval and automated product-development workflows.',
    'The thread through all of it is the order I work in: understand the business problem first, choose the technical approach that solves it, then explain the result to the people who will act on it. I keep learning along the way — most recently the Data Scientist programme at DataCamp, with an AI Engineer certification in progress.',
  ],
};

export const expertiseSection = {
  title: 'Explore what I build.',
  subline:
    'From intelligent automation to data pipelines and predictive models, explore the projects behind my work.',
};

export const experienceSection = {
  title: 'Where strategy meets execution.',
  subline:
    'My experience spans data strategy, technology solutions and business leadership — always connecting analysis to measurable outcomes.',
};

export const educationSection = {
  title: 'Built on curiosity. Driven by continuous learning.',
  subline:
    'A multidisciplinary background across law, management, analytics, data science and artificial intelligence.',
};

/** The education page: every course as a timeline, most recent first. */
export const educationPage = {
  title: 'Education',
  description:
    'Education and certifications of Daniel Oliveira, from the most recent to the earliest: law, management, analytics, data science and artificial intelligence.',
  eyebrow: 'Education / Timeline',
  back: 'Back to home',
  listLabel: 'Courses, most recent first',
  /** Shown in a course panel until the course has a description (education.ts). */
  pending: 'Course summary coming soon.',
  caption: 'Most recent first. Dates, institutions and formats as listed in my CV.',
};

export const contactSection = {
  title: 'Let’s turn data into something meaningful.',
  subline:
    'I’m interested in opportunities where analytical thinking, engineering and business strategy come together to solve real problems.',
  actions: {
    linkedin: 'Connect on LinkedIn',
    github: 'Explore My GitHub',
    email: 'Get in Touch',
  },
};
