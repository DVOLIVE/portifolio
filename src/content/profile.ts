/**
 * Landing-page copy: intro, hero, About, section headings and the closing call
 * to action. Facts come from the CV (docs: README → "Sources").
 */
export const intro = {
  line: 'turning data into impact.',
};

export const hero = {
  name: ['Daniel', 'Oliveira'],
  meta: ['Data × Business × Technology', 'Based in Portugal', 'Open to opportunities'],
  role: 'Data Scientist | Data Engineering | Analytics & AI Automation',
  statement:
    'I transform complex data into practical solutions, combining analytical thinking, engineering and business strategy to create measurable impact.',
  primaryCta: { label: 'Explore My Work', href: '/#expertise' },
};

export const about = {
  number: '01',
  eyebrow: 'About',
  title: 'Business thinking. Engineering mindset.',
  lead:
    "I'm a Portuguese-Brazilian data professional based in Portugal. My work sits where business questions meet data engineering, analytics and applied AI.",
  paragraphs: [
    'I learned the commercial side first. At Espaço Veneza Carioca, an events and hospitality business, I started as account manager and became general manager: running sales and pricing strategy on Excel and Access CRM databases, negotiating partnerships, managing suppliers, staff and operations — and finally leading the sale of the company.',
    'At Xerox | Jodrax I moved closer to technology: proposing hardware and software solutions to clients, managing their implementation and writing Python scripts to automate manual tasks.',
    'At MOP, as Data Strategist, data became the job: statistical and geospatial pipelines behind new audience products, machine-learning models to forecast advertising investment, dashboards, RAG-based AI applications for knowledge retrieval and automated product-development workflows.',
    'The thread through all of it is the order I work in: understand the business problem first, choose the technical approach that solves it, then explain the result to the people who will act on it. I keep learning along the way — most recently the Data Scientist programme at DataCamp, with an AI Engineer certification in progress.',
  ],
  metrics: [
    { value: '80%', label: 'shorter product development cycle at MOP — from five days to one.' },
    { value: '6', label: 'audience-targeted data products delivered at MOP on statistical and geospatial pipelines.' },
    { value: '42%', label: 'of MOP’s total reported results came from those six products by the end of Q3 2025.' },
  ],
  metricsNote:
    'Figures describe my work at MOP (Oct 2023 – Mar 2026) as reported in my CV. They are not independently audited company-wide metrics.',
};

export const expertiseSection = {
  number: '02',
  eyebrow: 'Expertise',
  title: 'Explore what I build.',
  subline:
    'From intelligent automation to data pipelines and predictive models, explore the projects behind my work.',
};

export const experienceSection = {
  number: '03',
  eyebrow: 'Experience',
  title: 'Where strategy meets execution.',
  subline:
    'My experience spans data strategy, technology solutions and business leadership — always connecting analysis to measurable outcomes.',
};

export const educationSection = {
  number: '04',
  eyebrow: 'Education',
  title: 'Built on curiosity. Driven by continuous learning.',
  subline:
    'A multidisciplinary background across law, management, analytics, data science and artificial intelligence.',
};

export const contactSection = {
  number: '05',
  eyebrow: 'Contact',
  title: 'Let’s turn data into something meaningful.',
  subline:
    'I’m interested in opportunities where analytical thinking, engineering and business strategy come together to solve real problems.',
  actions: {
    linkedin: 'Connect on LinkedIn',
    github: 'Explore My GitHub',
    email: 'Get in Touch',
  },
};
