/**
 * Single source of truth for identity, contact details and navigation.
 * Terminology here is taken verbatim from the client's own product catalog
 * (PRODUCT CATALOG — MAY 2026, "Premium Glass Hardware & Architectural Systems").
 */

/**
 * Phone and social profiles, rendered by <ContactLinks> in the footer and on
 * /quote. The client asked for them (Sugerencias 3, item 6) but has not sent
 * the number or the profile URLs yet: anything left empty is simply not shown,
 * and the preview build flags it as pending material.
 */
export const contact = {
  /** As printed, e.g. '(801) 555-0123'. */
  phoneDisplay: '',
  /** Digits only with country code, e.g. '18015550123'. Also the WhatsApp number. */
  phoneDigits: '',
  social: [
    { label: 'Instagram', icon: 'lucide:instagram', href: '' },
    { label: 'Facebook', icon: 'lucide:facebook', href: '' },
    { label: 'LinkedIn', icon: 'lucide:linkedin', href: '' },
  ],
};

export const site = {
  legalName: 'Vetro Steel Design Studio LLC',
  name: 'Vetro Steel',
  descriptor: 'Studio — Design',
  tagline: 'Premium Glass Hardware & Architectural Systems',
  email: 'contact@vetrosteelut.com',
  location: 'Utah · USA',
  region: 'Utah, United States',

  /**
   * Canonical origin. This drives every canonical tag, og:url, the sitemap and
   * robots.txt, so it has to be the host that actually serves the site —
   * www.vetrosteelut.com, with the apex redirecting to it.
   */
  origin: 'https://www.vetrosteelut.com',

  /** Structured-data address. Street and phone are still missing — see README. */
  address: {
    locality: 'Salt Lake City',
    regionCode: 'UT',
    country: 'US',
  },

  /** Towns we say we serve. Used by schema.org areaServed. */
  areaServed: [
    'Salt Lake City',
    'Provo',
    'Orem',
    'Lehi',
    'Draper',
    'Sandy',
    'American Fork',
    'Park City',
    'Ogden',
    'St. George',
  ],

  /** Profiles for schema.org sameAs — whichever of `contact.social` are filled in. */
  sameAs: contact.social.map((s) => s.href).filter(Boolean),

  /** Catalog cover taxonomy, in the client's wording and order. */
  catalogCategories: [
    'Sliding Systems',
    'Shower Hardware',
    'Pull Handles',
    'Railings',
    'Entrance Systems',
  ],
} as const;

export const mainNav = [
  { label: 'Commercial', href: '/commercial' },
  { label: 'Residential', href: '/residential' },
  { label: 'Maintenance', href: '/maintenance' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
] as const;

export const footerNav = [
  { label: 'Commercial', href: '/commercial' },
  { label: 'Residential', href: '/residential' },
  { label: 'Maintenance', href: '/maintenance' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Capabilities', href: '/about#capabilities' },
  { label: 'Values', href: '/about#values' },
  { label: 'Contact Us', href: '/quote' },
] as const;
