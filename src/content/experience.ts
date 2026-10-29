import type { Experience } from './types';

/**
 * Professional experience, most recent first. Each entry gets a card on the
 * landing page and a page at /experience/<slug>/. Facts come from the CV only.
 */
export const experiences: Experience[] = [
  {
    slug: 'mop',
    company: 'MOP',
    sector: 'Out-of-Home Advertising & Media',
    initials: 'MOP',
    roles: [{ title: 'Data Strategist', period: 'Oct 2023 – Mar 2026' }],
    period: 'Oct 2023 – Mar 2026',
    category: 'Data Strategy',
    headline: 'Transforming media data into commercial intelligence.',
    summary:
      'Developed audience-focused data products, predictive analytics and automated workflows, helping stakeholders make faster, data-driven business decisions.',
    cover: 'signal',
    tags: ['Python', 'SQL', 'GeoPandas', 'Machine Learning', 'BI', 'ETL/ELT', 'RAG'],
    context: [
      'MOP works in out-of-home (OOH) advertising and media.',
      'As Data Strategist I worked across data products, forecasting, business intelligence and market research, for stakeholders who needed insight faster than a monthly reporting cycle.',
    ],
    responsibilities: [
      'Designed audience-targeted data products on statistical data models and geospatial data pipelines.',
      'Built and optimised Python machine-learning models to forecast market investment from historical advertising data.',
      'Developed AI applications for business intelligence and knowledge management, combining LLMs in a RAG framework.',
      'Designed, implemented and automated business processes for data-driven products.',
      'Conducted market research and competitive analysis across the OOH advertising industry.',
      'Normalised asset databases and developed ETL/ELT pipelines in relational systems for large-scale geospatial datasets.',
    ],
    problems: [
      'Insights reached stakeholders on a monthly cycle.',
      'Developing a new data product took five days per cycle.',
      'Asset data had to be normalised before it could support large-scale geospatial analysis.',
      'Knowledge spread across documents had to be retrievable with precise, context-aware answers.',
    ],
    initiatives: [
      { title: 'Audience-targeted products', text: 'Six new products built on statistical data models and geospatial data pipelines.' },
      { title: 'Investment forecasting', text: 'Python machine-learning models trained on historical advertising data, delivered through dashboards that gave stakeholders instant access instead of monthly updates.' },
      { title: 'RAG knowledge retrieval', text: 'An end-to-end pipeline for document ingestion, embedding generation, vector search and response orchestration.' },
      { title: 'Product-process automation', text: 'Automated the development process for data-driven products, cutting cycle time from five days to one.' },
      { title: 'Market intelligence', text: 'Research into market trends, audience behaviour, media investment and competitor activity to find commercial opportunities.' },
    ],
    practices: [
      'Statistical modelling',
      'Geospatial data pipelines',
      'Machine learning in Python',
      'ETL/ELT in relational databases',
      'Dashboards and business intelligence',
      'Retrieval-augmented generation (RAG)',
      'Market and competitive analysis',
    ],
    impact: [
      { value: '80%', label: 'Shorter product development cycle: five days to one' },
      { value: '6', label: 'New audience-targeted products delivered' },
      { value: '42%', label: 'Share of total results from those products by the end of Q3 2025' },
      { value: 'Instant', label: 'Access to forecasting insight for stakeholders, previously monthly' },
    ],
    skills: [
      'Geospatial analytics',
      'Machine-learning forecasting',
      'RAG and LLM applications',
      'Data product design',
      'Process automation',
      'Stakeholder-facing dashboards',
    ],
    relatedProjects: ['market-investment-forecasting', 'rag-knowledge-retrieval', 'geospatial-ooh-analytics'],
    relatedCategories: ['data-engineering-analytics', 'data-science'],
  },
  {
    slug: 'xerox-jodrax',
    company: 'Xerox | Jodrax',
    sector: 'Technology & Document Solutions',
    initials: 'XJ',
    roles: [{ title: 'Account Manager', period: 'Dec 2022 – Oct 2023' }],
    period: 'Dec 2022 – Oct 2023',
    category: 'Technology Solutions',
    headline: 'Connecting technology solutions with commercial growth.',
    summary:
      'Combined client relationship management, technology consulting and process automation to exceed commercial targets.',
    cover: 'grid',
    tags: ['Python', 'Process automation', 'SaaS', 'Account management'],
    context: [
      'Xerox | Jodrax provides technology and document solutions.',
      'As Account Manager I prospected new clients, managed a customer portfolio and proposed hardware and software solutions.',
    ],
    responsibilities: [
      'Prospected new clients and managed a customer portfolio.',
      'Proposed hardware and software solutions to clients.',
      'Designed, managed and implemented projects with multifunction printing solutions and SaaS through to completion.',
      'Acted as the main point of contact between clients and business stakeholders.',
    ],
    problems: [
      'Manual tasks in the commercial routine.',
      'Client implementations of printing and SaaS solutions that had to be delivered to completion.',
    ],
    initiatives: [
      { title: 'Python automation', text: 'Scripts that automated manual tasks in the commercial routine.' },
      { title: 'Solution implementations', text: 'Projects with multifunction printing solutions and SaaS, from design to completion.' },
    ],
    practices: ['Python scripting', 'Solution consulting', 'Project management', 'Stakeholder communication'],
    impact: [
      { value: '+19%', label: 'Revenue above objective in Q1 2023' },
      { value: '+22%', label: 'Revenue above objective in Q2 2023' },
    ],
    skills: ['Business analysis', 'Process automation', 'Stakeholder management', 'Technical problem-solving'],
    relatedProjects: [],
    relatedCategories: ['automation'],
  },
  {
    slug: 'veneza-carioca',
    company: 'Espaço Veneza Carioca',
    sector: 'Events & Hospitality',
    initials: 'VC',
    roles: [
      { title: 'General Manager', period: 'Jan 2016 – Dec 2019' },
      { title: 'Account Manager', period: '2015 – 2016' },
    ],
    period: '2015 – 2019',
    category: 'Business Leadership',
    headline: 'Building business growth through operations and strategy.',
    summary:
      'Led commercial planning, pricing, CRM processes and operational management in a growing hospitality business.',
    cover: 'orbit',
    tags: ['CRM', 'Pricing', 'Operations', 'Strategy'],
    context: [
      'Espaço Veneza Carioca is an events and hospitality business, with weddings and corporate events among its offer.',
      'I joined as account manager and became general manager, responsible for operations, commercial strategy and, finally, the sale of the company.',
    ],
    responsibilities: [
      'Coordinated sales and pricing strategy using Excel and Access CRM databases.',
      'Negotiated with fashion and catering partners to create catalogues for weddings and corporate events.',
      'Developed a commercial database of contract models with stakeholders, to automate business processes.',
      'Managed daily event activity: supplier prospecting and management, marketing actions, commercial proposals and partnerships.',
      'Oversaw event operations, resolved issues and recruited and managed staff, suppliers and guests.',
      'Defined and executed the business strategy, including business development and presentations to the board.',
      'Conducted the sale of the company, managing tax assessment, legal liabilities and transaction execution.',
    ],
    problems: [
      'Understanding customer needs well enough to improve sales efficiency.',
      'Standardising contracts across stakeholders.',
      'Running daily operations across suppliers, staff and guests.',
    ],
    initiatives: [
      { title: 'CRM-driven pricing', text: 'Sales and pricing coordinated on Excel and Access databases, for a better understanding of customer needs and more efficient sales.' },
      { title: 'Partner catalogues', text: 'Catalogues created with fashion and catering partners for weddings and corporate events.' },
      { title: 'Contract database', text: 'A commercial database of contract models, built with stakeholders to automate business processes.' },
      { title: 'Sale of the business', text: 'Led the transaction, including tax assessment, legal liabilities and execution.' },
    ],
    practices: ['CRM databases (Excel, Access)', 'Pricing strategy', 'Negotiation', 'Contract management', 'Operations management'],
    impact: [{ value: '300%', label: 'Reported sales increase in 2016 compared with 2015' }],
    skills: ['Commercial intelligence', 'Operations', 'Business management', 'Leadership', 'Structured data for decisions'],
    relatedProjects: [],
    relatedCategories: ['data-engineering-analytics'],
  },
];
