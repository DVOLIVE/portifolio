import type { ImageMetadata } from 'astro';

/* ── Shared ─────────────────────────────────────────────────────────── */

export interface Link {
  label: string;
  /** Internal paths start with "/" and are prefixed with the base path automatically. */
  href: string;
  external?: boolean;
}

export type IconName =
  | 'workflow'
  | 'database'
  | 'chart'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'chevron-right'
  | 'download'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'menu'
  | 'close';

/* ── Expertise categories ───────────────────────────────────────────── */

export type CategoryId = 'automation' | 'data-engineering-analytics' | 'data-science';

export interface Category {
  id: CategoryId;
  /** Becomes the URL: /<slug>/ */
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Exactly three badges on the landing-page card. */
  badges: [string, string, string];
  icon: IconName;
  cta: string;
  focus: string;
  /** Intro paragraph on the category page. */
  intro: string;
  /** Kinds of work the category is designed to hold. */
  scope: string[];
}

/* ── Projects ───────────────────────────────────────────────────────── */

/**
 * published       — case study complete; detail page generated.
 * in-development  — preview page generated; results are not shown.
 * coming-soon     — card only, no page and no link.
 */
export type ProjectStatus = 'published' | 'in-development' | 'coming-soon';

/** Where the work comes from — shown so readers can tell them apart. */
export type ProjectOrigin = 'product' | 'personal' | 'professional';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'facts'; items: { label: string; value: string }[] }
  | { type: 'code'; lang: string; code: string; caption: string }
  | { type: 'figure'; image: ImageMetadata; alt: string; caption: string }
  | { type: 'gallery'; items: { image: ImageMetadata; alt: string; caption: string }[] }
  | { type: 'note'; tone: 'info' | 'pending'; text: string }
  /** Results, each labelled so observation, interpretation and open questions stay distinct. */
  | { type: 'findings'; items: { kind: FindingKind; text: string }[] };

export type FindingKind = 'observed' | 'interpretation' | 'recommendation' | 'open-question';

/**
 * Case-study sections, in template order. All are always shown except
 * 'security', which appears only when a project provides it.
 */
export type CaseSectionId =
  | 'problem'
  | 'objectives'
  | 'architecture'
  | 'methodology'
  | 'security'
  | 'results'
  | 'limitations';

export interface ProjectBrand {
  logo: ImageMetadata;
  logoAlt: string;
  kicker: string;
  credit: string;
}

export interface Project {
  slug: string;
  category: CategoryId;
  title: string;
  /** Leave out for planned work that has no source yet. */
  origin?: ProjectOrigin;
  status: ProjectStatus;
  /** Free text about the product itself, e.g. "In private use". Optional. */
  stage?: string;
  summary: string;
  tags: string[];
  year?: string;
  cover?: { image: ImageMetadata; alt: string };
  brand?: ProjectBrand;
  links?: Link[];
  /** Pages that give context when the case study itself is not written yet. */
  related?: Link[];
  /** Case-study body. Missing sections render as "documentation in progress". */
  sections?: Partial<Record<CaseSectionId, Block[]>>;
}

/* ── Experience ─────────────────────────────────────────────────────── */

export interface Role {
  title: string;
  period: string;
}

export interface Experience {
  slug: string;
  company: string;
  sector: string;
  initials: string;
  roles: Role[];
  /** Overall period shown on the card, e.g. "Oct 2023 – Mar 2026". */
  period: string;
  category: string;
  headline: string;
  summary: string;
  cover: 'signal' | 'grid' | 'orbit';
  tags: string[];
  context: string[];
  responsibilities: string[];
  problems: string[];
  initiatives: { title: string; text: string }[];
  practices: string[];
  impact: { value: string; label: string }[];
  skills: string[];
  relatedProjects: string[];
  relatedCategories: CategoryId[];
}

/* ── Education ──────────────────────────────────────────────────────── */

export interface EducationRecord {
  id: string;
  program: string;
  /** Omitted when the CV does not name the institution. */
  institution?: string;
  initials: string;
  start?: string;
  end?: string;
  /** Used for single-date records. */
  completed?: string;
  status: 'completed' | 'in-progress';
  format?: string;
  description?: string;
}
