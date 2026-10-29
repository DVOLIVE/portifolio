import type { Link } from './types';

/**
 * Site-wide settings, contact details and navigation.
 * Edit here to change the name, links, CV file or metadata.
 */
export const site = {
  lang: 'en',
  locale: 'en_GB',
  name: 'Daniel Oliveira',
  title: 'Daniel Oliveira — Data, Engineering & AI',
  description:
    'Portfolio of Daniel Oliveira, a data professional in Portugal combining data engineering, analytics, machine learning and AI automation with business strategy.',
  tagline: 'I turn complex data into clear decisions and scalable solutions.',
  location: 'Portugal',
  /** Path inside /public. Replace the file to update the CV everywhere. */
  cv: {
    href: '/cv/Daniel-Oliveira-CV.pdf',
    fileName: 'Daniel-Oliveira-CV.pdf',
    label: 'Download CV',
  },
  ogImage: '/og/daniel-oliveira-og.jpg',
} as const;

export const contact = {
  email: 'dvoliveira937@gmail.com',
  linkedin: 'https://www.linkedin.com/in/eudanieloliveira/',
  github: 'https://github.com/agentealfredoclaw',
} as const;

/** Header call to action. On the home page the hero's CV button turns into it on scroll. */
export const contactCta = {
  label: 'Get in Touch',
  href: `mailto:${contact.email}`,
} as const;

/** Section anchors on the landing page, in page order. */
export const navigation: Link[] = [
  { label: 'About', href: '/#about' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Contact', href: '/#contact' },
];
