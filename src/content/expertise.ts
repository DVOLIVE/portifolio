import type { Category } from './types';

/**
 * The three portfolio areas. Each one gets a card on the landing page and a
 * page at /<slug>/ listing its projects (see projects.ts).
 */
export const categories: Category[] = [
  {
    id: 'automation',
    slug: 'automation',
    number: '01',
    title: 'Automation & AI',
    shortTitle: 'Automation',
    description:
      'Designing intelligent workflows that connect language models, APIs and structured data to eliminate repetitive work.',
    badges: ['LLMs', 'APIs', 'Workflows'],
    icon: 'workflow',
    cta: 'Explore Automation',
    focus: 'Conversational AI · Validation · Integrations',
    intro:
      'Projects where language models, APIs and structured data are combined into workflows that take repetitive work off people’s hands — with validation in code and people kept in control of what gets recorded.',
    scope: [
      'Conversational interfaces',
      'LLM tool calling with structured JSON outputs',
      'API integrations',
      'Data validation and business rules',
      'Workflow automation and operations',
    ],
  },
  {
    id: 'data-engineering-analytics',
    slug: 'data-engineering-analytics',
    number: '02',
    title: 'Data Engineering & Analytics',
    shortTitle: 'Data Engineering',
    description:
      'Building reliable data pipelines, analytical models and business intelligence systems that transform raw information into decisions.',
    badges: ['Python', 'SQL', 'Power BI'],
    icon: 'database',
    cta: 'Explore Data Projects',
    focus: 'Pipelines · BI · Geospatial',
    intro:
      'Pipelines, models and dashboards that move data from raw sources to decisions: ingestion, cleaning, modelling, analysis and the business intelligence layer people actually use.',
    scope: [
      'End-to-end ETL and ELT',
      'Data ingestion, cleaning and transformation',
      'SQL analytics and data modelling',
      'Business intelligence and dashboards',
      'Geospatial analytics',
      'Data quality and performance optimisation',
      'Commercial analytics',
    ],
  },
  {
    id: 'data-science',
    slug: 'data-science',
    number: '03',
    title: 'Data Science & Machine Learning',
    shortTitle: 'Data Science',
    description:
      'Applying machine learning, forecasting and retrieval-augmented AI to solve complex analytical challenges.',
    badges: ['Machine Learning', 'RAG', 'Forecasting'],
    icon: 'chart',
    cta: 'Explore Data Science',
    focus: 'Forecasting · ML · Applied AI',
    intro:
      'Models that predict, explain and retrieve: forecasting, statistical modelling, model evaluation and retrieval-augmented AI built on embeddings and vector search.',
    scope: [
      'Machine-learning models and predictive analytics',
      'Time-series forecasting',
      'Statistical modelling and model evaluation',
      'RAG systems, embeddings and vector search',
      'LLM applications and applied AI experiments',
    ],
  },
];
