import { site } from './site';
import { verticals } from './verticals';

/**
 * Per-route search metadata.
 *
 * Titles lead with what people actually type — "glass office partitions",
 * "frameless shower doors", "glass railings" — and carry the state, because
 * every query that converts here is local. The brand goes last: it is the part
 * a searcher already knows if they are looking for it by name.
 *
 * Titles stay under ~60 characters and descriptions under ~155, which is where
 * Google starts truncating desktop results.
 */
export interface RouteSeo {
  title: string;
  description: string;
  /** Line drawn on the generated OG image. Not a meta keywords tag. */
  focus: string;
}

export const routeSeo: Record<string, RouteSeo> = {
  '/': {
    title: 'Glass & Stainless Steel Fabrication in Utah | Vetro Steel',
    description:
      'Shower enclosures, glass office partitions, railings and storefront entrances in tempered glass and stainless steel, fabricated and installed across Utah.',
    focus: 'Glass & Stainless Steel, Built in Utah',
  },
  '/commercial': {
    title: 'Glass Office Partitions & Storefront Entrances | Utah',
    description:
      'Commercial glazing in Utah: all-glass storefront entrances, demountable office partitions and frameless guardrails, specified and installed as one package.',
    focus: 'Commercial Glass & Entrance Systems',
  },
  '/residential': {
    title: 'Frameless Shower Doors & Bath Enclosures | Utah',
    description:
      'Custom frameless shower enclosures, sliding bath screens and glass railings for Utah homes. Measured after tiling, installed in a single day.',
    focus: 'Frameless Showers & Bath Enclosures',
  },
  '/maintenance': {
    title: 'Office Maintenance & Glass Servicing in Utah | Vetro Steel',
    description:
      'Subscription facility maintenance for Utah offices: painting, drywall, furniture installation, glass cleaning, vinyl and preventive hardware servicing on a flat monthly fee.',
    focus: 'Operational Maintenance, on a Flat Fee',
  },
  '/projects': {
    title: 'Glass & Steel Projects in Utah — Installed Work',
    description:
      'Completed glass and stainless steel installations: guardrails, partitions, stairs and terraces, alongside the drawings each one was cut from.',
    focus: 'From the Drawing to the Installed Edge',
  },
  '/about': {
    title: 'About Vetro Steel — Glass Hardware Studio in Utah',
    description:
      'Vetro Steel Design Studio is a Utah glass and stainless steel studio: hardware specification, shop drawings, fabrication and installation under one roof.',
    focus: 'The Studio Behind the Hardware',
  },
  '/quote': {
    title: 'Request a Free Glass & Railing Quote | Utah',
    description:
      'Tell us the opening and we come back with a real number. Free quotes on shower enclosures, glass partitions, railings and storefront entrances across Utah.',
    focus: 'Request a Quote',
  },
  '/404': {
    title: 'Page Not Found | Vetro Steel',
    description:
      'That page has moved or never existed. Browse our commercial and residential glass work instead.',
    focus: 'Page Not Found',
  },
};

/** Falls back to the home entry so a new route never ships without metadata. */
export function seoFor(pathname: string): RouteSeo {
  const key = pathname.replace(/\/+$/, '') || '/';
  return routeSeo[key] ?? routeSeo['/'];
}

/**
 * Questions answerable from the material we actually have. These render as a
 * visible FAQ and as FAQPage structured data — the same words in both, which
 * is what Google requires for the rich result.
 */
export const faqs = [
  {
    q: 'Do you make custom shower enclosures, or only standard sizes?',
    a: 'Custom. We measure the opening after tiling, because a shower opening is rarely square, and cut the glass to what is actually there rather than to a nominal size.',
  },
  {
    q: 'How long does a shower enclosure installation take?',
    a: 'The install itself is typically a single day, with the bathroom usable that evening. The lead time before it is set by glass processing: cutting, notching and toughening.',
  },
  {
    q: 'Can you supply hardware without installing it?',
    a: 'Yes. Hinges, clamps, spigots, pull handles, channel and sliding kits can be supplied on their own, and every fitting ships with its dimensioned cut-out template.',
  },
  {
    q: 'What glass thickness do you use for frameless railings?',
    a: 'It depends on the span, the fixing method and the load the guardrail has to take. We confirm the make-up against the specific opening before quoting, rather than quoting a default.',
  },
  {
    q: 'Do you maintain what you install?',
    a: 'Yes, on a monthly subscription. Scheduled visits cover glass cleaning, hardware replacement and preventive servicing of hinges, handles and locks, alongside general office upkeep — painting, drywall repair and furniture installation — on a flat fee agreed up front.',
  },
  {
    q: 'Do you work with architects and general contractors?',
    a: 'Yes, and that is most of the commercial work. We take the drawings, specify the hardware, produce shop drawings and coordinate the install around the other trades on site.',
  },
  {
    q: 'Which areas of Utah do you serve?',
    a: 'We install across the Wasatch Front and beyond, including Salt Lake City, Provo, Orem, Lehi, Draper, Sandy and the surrounding areas.',
  },
];

/**
 * One JSON-LD graph per page rather than a pile of loose script tags: the nodes
 * reference each other by @id, which is how a crawler resolves "this Service is
 * offered by this Organization" instead of reading them as unrelated blobs.
 */
export function buildGraph(opts: {
  pathname: string;
  title: string;
  description: string;
  image: string;
  breadcrumbs?: { name: string; href: string }[];
  includeFaq?: boolean;
}) {
  const origin = site.origin;
  const url = new URL(opts.pathname, origin).href;
  const orgId = origin + '/#organization';
  const siteId = origin + '/#website';

  const graph: Record<string, unknown>[] = [
    {
      '@type': ['Organization', 'LocalBusiness', 'GeneralContractor'],
      '@id': orgId,
      name: site.name,
      legalName: site.legalName,
      url: origin + '/',
      email: site.email,
      description: site.tagline,
      image: origin + '/logo.png',
      logo: { '@type': 'ImageObject', url: origin + '/logo.png' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.locality,
        addressRegion: site.address.regionCode,
        addressCountry: site.address.country,
      },
      areaServed: site.areaServed.map((name) => ({
        '@type': 'City',
        name,
        containedInPlace: { '@type': 'State', name: 'Utah' },
      })),
      knowsAbout: [...site.catalogCategories],
      ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Premium Glass Hardware & Architectural Systems',
        itemListElement: site.catalogCategories.map((c) => ({
          '@type': 'OfferCatalog',
          name: c,
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: origin + '/',
      name: site.name,
      publisher: { '@id': orgId },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url,
      name: opts.title,
      description: opts.description,
      isPartOf: { '@id': siteId },
      about: { '@id': orgId },
      primaryImageOfPage: { '@type': 'ImageObject', url: opts.image },
      inLanguage: 'en-US',
    },
  ];

  if (opts.breadcrumbs && opts.breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumbs',
      itemListElement: opts.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: new URL(b.href, origin).href,
      })),
    });
  }

  // Each vertical is a Service the Organization provides, with its catalog
  // categories as the offer list.
  const slug = opts.pathname.replace(/\/+$/, '');
  const vertical = verticals.find((v) => slug === '/' + v.slug);
  if (vertical) {
    graph.push({
      '@type': 'Service',
      '@id': url + '#service',
      name: vertical.nav + ' Glass & Stainless Steel Systems',
      serviceType: vertical.categories.map((c) => c.title).join(', '),
      description: vertical.lead,
      provider: { '@id': orgId },
      areaServed: { '@type': 'State', name: 'Utah' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: vertical.nav + ' systems',
        itemListElement: vertical.categories.map((c) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: c.title, description: c.body },
        })),
      },
    });
  }

  if (opts.includeFaq) {
    graph.push({
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
