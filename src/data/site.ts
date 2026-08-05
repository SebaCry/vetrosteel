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
  { label: 'About', href: '/about' },
] as const;

export const footerNav = [
  { label: 'Commercial', href: '/commercial' },
  { label: 'Residential', href: '/residential' },
  { label: 'About', href: '/about' },
  { label: 'Capabilities', href: '/about#capabilities' },
  { label: 'Values', href: '/about#values' },
  { label: 'Request a Quote', href: '/quote' },
] as const;
