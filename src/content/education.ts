import type { EducationRecord } from './types';

/**
 * Education and certifications, most recent first, exactly as stated in the CV.
 * Leave a field out rather than guessing it (start dates, credential ids…).
 */
export const education: EducationRecord[] = [
  {
    id: 'ai-engineer-associate',
    program: 'AI Engineer for Data Scientists Associate Certification',
    initials: 'AI',
    start: 'Sep 2025',
    status: 'in-progress',
  },
  {
    id: 'datacamp-data-scientist',
    program: 'Data Scientist',
    institution: 'DataCamp',
    initials: 'DC',
    completed: 'Aug 2025',
    status: 'completed',
    format: 'Online',
  },
  {
    id: 'masterschool-data-analytics',
    program: 'Data Analytics',
    institution: 'Masterschool',
    initials: 'MS',
    completed: 'Dec 2023',
    status: 'completed',
    format: 'New York, USA · Online',
  },
  {
    id: 'lean-six-sigma-green-belt',
    program: 'Lean Six Sigma Green Belt',
    institution: 'Six Sigma Academy Amsterdam',
    initials: 'SSA',
    completed: 'Nov 2022',
    status: 'completed',
  },
  {
    id: 'fgv-project-management',
    program: 'Project Management',
    institution: 'Fundação Getúlio Vargas (FGV)',
    initials: 'FGV',
    completed: 'Dec 2016',
    status: 'completed',
  },
  {
    id: 'fgv-contracts-law',
    program: 'Contracts Law',
    institution: 'Fundação Getúlio Vargas (FGV)',
    initials: 'FGV',
    completed: 'Jul 2016',
    status: 'completed',
  },
  {
    id: 'ucam-law',
    program: 'Law',
    institution: 'Universidade Cândido Mendes (UCAM)',
    initials: 'UCAM',
    completed: 'Dec 2014',
    status: 'completed',
  },
];
