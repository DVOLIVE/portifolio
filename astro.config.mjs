// @ts-check
import { defineConfig } from 'astro/config';

// The deployment URL is never hard-coded. The GitHub Actions workflow reads
// it from actions/configure-pages and passes it in:
//   SITE_URL  → e.g. https://<user>.github.io
//   BASE_PATH → e.g. /portfolio  (empty for a <user>.github.io repository)
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
