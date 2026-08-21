/**
 * Single source of truth for identity, contact details and navigation.
 * Terminology here is taken verbatim from the client's own product catalog
 * (PRODUCT CATALOG — MAY 2026, "Premium Glass Hardware & Architectural Systems").
 */
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

  /** Profiles for schema.org sameAs. Add real URLs as they exist. */
  sameAs: [] as string[],

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
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
] as const;

export const footerNav = [
  { label: 'Commercial', href: '/commercial' },
  { label: 'Residential', href: '/residential' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Capabilities', href: '/about#capabilities' },
  { label: 'Values', href: '/about#values' },
  { label: 'Request a Quote', href: '/quote' },
] as const;
