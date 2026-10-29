import { categories } from '../content/expertise';
import { projects } from '../content/projects';
import { experiences } from '../content/experience';
import { education } from '../content/education';
import type { Category, CategoryId, EducationRecord, Project, ProjectOrigin, ProjectStatus } from '../content/types';

/** Prefixes internal paths with the deployment base path. */
export function url(path: string): string {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export const getCategory = (id: CategoryId): Category => {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category "${id}"`);
  return category;
};

export const projectsIn = (id: CategoryId): Project[] => projects.filter((p) => p.category === id);

export const getProject = (slug: string): Project | undefined => projects.find((p) => p.slug === slug);

/** Only published and in-development projects get a page. */
export const hasPage = (project: Project): boolean => project.status !== 'coming-soon';

export const projectPath = (project: Project): string =>
  `/${getCategory(project.category).slug}/${project.slug}/`;

export const experiencePath = (slug: string): string => `/experience/${slug}/`;

export const getExperience = (slug: string) => experiences.find((e) => e.slug === slug);

/** The education page, opened on one course when an id is given. */
export const educationPath = (id?: string): string => (id ? `/education/#${id}` : '/education/');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Dec 2016" → a number that sorts by date; -Infinity when there is no date. */
function monthOf(date?: string): number {
  const [month, year] = date?.split(' ') ?? [];
  const index = MONTHS.indexOf(month ?? '');
  return index >= 0 && Number(year) ? Number(year) * 12 + index : -Infinity;
}

/** Education as a timeline: courses in progress first, then the latest finished. */
export const educationTimeline = (): EducationRecord[] =>
  [...education].sort((a, b) => {
    const when = (r: EducationRecord) => (r.status === 'in-progress' ? Infinity : monthOf(r.end ?? r.completed));
    return when(b) - when(a) || 0;
  });

/** Who awarded it; the CV names no institution for some certifications. */
export const educationIssuer = (record: EducationRecord): string => record.institution ?? 'Professional certification';

/** Short date for a timeline row: "Dec 2016", or "Since Sep 2025" while in progress. */
export const educationWhen = (record: EducationRecord): string =>
  record.status === 'in-progress'
    ? record.start
      ? `Since ${record.start}`
      : 'In progress'
    : (record.completed ?? record.end ?? '');

/** The facts a course panel lists — only what the CV states. */
export function educationFacts(record: EducationRecord): { label: string; value: string }[] {
  const facts: [string, string | undefined][] = [
    ['Institution', record.institution],
    ['Format', record.format],
    ['Started', record.start],
    ['Completed', record.status === 'completed' ? (record.completed ?? record.end) : undefined],
    ['Status', record.status === 'in-progress' ? 'In progress' : undefined],
  ];
  return facts.flatMap(([label, value]) => (value ? [{ label, value }] : []));
}

export const statusLabel: Record<ProjectStatus, string> = {
  published: 'Case study',
  'in-development': 'In development',
  'coming-soon': 'Coming soon',
};

export const originLabel: Record<ProjectOrigin, string> = {
  product: 'Product',
  personal: 'Personal project',
  professional: 'Professional work',
};

/** "1 case study · 2 planned" — shown on the expertise cards. */
export function categorySummary(id: CategoryId): string {
  const list = projectsIn(id);
  const count = (status: ProjectStatus) => list.filter((p) => p.status === status).length;
  const parts = [
    [count('published'), 'case study', 'case studies'],
    [count('in-development'), 'in development', 'in development'],
    [count('coming-soon'), 'coming soon', 'coming soon'],
  ] as const;
  return parts
    .filter(([n]) => n > 0)
    .map(([n, one, many]) => `${n} ${n === 1 ? one : many}`)
    .join(' · ');
}
