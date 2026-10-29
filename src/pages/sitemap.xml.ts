import type { APIRoute } from 'astro';
import { categories } from '../content/expertise';
import { experiences } from '../content/experience';
import { projects } from '../content/projects';
import { educationPath, experiencePath, hasPage, projectPath, url } from '../lib/content';

/** Every public page, generated from the same content files as the site. */
export const GET: APIRoute = ({ site }) => {
  const paths = [
    '/',
    ...categories.map((c) => `/${c.slug}/`),
    ...projects.filter(hasPage).map(projectPath),
    ...experiences.map((e) => experiencePath(e.slug)),
    educationPath(),
  ];
  const urls = paths.map((path) => `  <url><loc>${new URL(url(path), site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
