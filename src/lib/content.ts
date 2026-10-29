import { categories } from '../content/expertise';
import { projects } from '../content/projects';
import { experiences } from '../content/experience';
import type { Category, CategoryId, Project, ProjectOrigin, ProjectStatus } from '../content/types';

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
