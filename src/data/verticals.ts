/**
 * The business verticals.
 *
 * Everything a vertical page renders lives here. Adding a line means appending
 * one entry to `verticals` — the route, nav entry, sitemap and quote-form
 * option all follow from it. (The nav order in src/data/site.ts and the search
 * metadata in src/data/seo.ts are the two manual steps.)
 *
 * Copy uses the client's own catalog terminology: Sliding Systems, Shower
 * Hardware, Pull Handles, Railings, Entrance Systems.
 *
 * Not every line sells hardware off a drawing: `maintenance` is a recurring
 * service contract, so `products`, `plans` and `planIntro` are optional and it
 * carries `programs` + `serviceGroups` instead.
 */

export interface ProductItem {
  name: string;
  note: string;
  image: string;
  /** Finishes visible in the catalog photography. Not an ordering spec. */
  finishes?: string[];
}

export interface CategoryItem {
  /** Lucide icon name, as astro-icon expects it. */
  icon: string;
  title: string;
  body: string;
  image: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  body: string;
}

export interface GalleryItem {
  image: string;
  label: string;
  note: string;
}

export interface PlanCallout {
  label: string;
  value: string;
}

export interface PlanItem {
  image: string;
  title: string;
  caption: string;
  /** Rendered as the viewer's scale/units strip. */
  units: string;
  callouts: PlanCallout[];
}

/** One commitment of the maintenance subscription. Rendered by <ProgramGrid>. */
export interface ProgramItem {
  /** Lucide icon name, as astro-icon expects it. */
  icon: string;
  title: string;
  body: string;
}

/** A named list of tasks covered by a service line. Rendered by <ServiceChecklist>. */
export interface ServiceGroup {
  title: string;
  note: string;
  items: ProgramItem[];
}

export interface Vertical {
  slug: 'commercial' | 'residential' | 'maintenance';
  nav: string;
  eyebrow: string;
  headline: string;
  lead: string;
  hero: { image: string; alt: string };
  intro: { title: string; body: string[] };
  categories: CategoryItem[];
  /** Hardware lines only. A service line has no catalog to show. */
  products?: ProductItem[];
  plans?: PlanItem[];
  planIntro?: { title: string; body: string };
  /** Subscription commitments. Service lines only. */
  programs?: ProgramItem[];
  /** What the visits actually cover. Service lines only. */
  serviceGroups?: ServiceGroup[];
  process: ProcessStep[];
  gallery: GalleryItem[];
  cta: { headline: string; body: string };
  /** Material the client still owes us. Surfaced by <MaterialNote>. */
  gaps: { where: string; needs: string }[];
}

const PROCESS_TITLES = ['Consultation', 'Field Measurement', 'Fabrication', 'Installation'] as const;
const PROCESS_ICONS = ['lucide:messages-square', 'lucide:ruler', 'lucide:factory', 'lucide:wrench'] as const;

/*
 * Image allocation. No photograph appears twice on one page, and the home page
 * (hero-card per line + featured galleries) is unique across all of it. Some
 * assets are the same photo under two names — curtain-wall-facade and
 * storefront-entrance, bath-fixed-panel and bath-walkin-modern,
 * glass-roof-structure and skylight-structure, bath-tub-screen-brass and
 * tub-screen-gold, railing-exterior-stair and railing-glass-brass — so only one
 * of each pair is used. Client feedback: "the images repeat several times".
 *
 * The three hero images under renders/ were supplied by the client and are
 * AI-generated (cropped to remove the Gemini sparkle). They are used as hero
 * backdrops only — never in a "Selected work" gallery, which shows real jobs.
 *
 * entrance-vestibule-glass, office-meeting-room-glass and deck-railing-sunset
 * are the three replacements the client picked for "Systems we build" on
 * commercial. They are also client AI renders, but they only reached us inside
 * WhatsApp screenshots, so they are ~900px crops of those — enough for the card
 * at 31vw, not for a hero. Replacing the files with the originals under the same
 * names is the whole fix; the gap below keeps it on the list.
 */

export const commercial: Vertical = {
  slug: 'commercial',
  nav: 'Commercial',
  eyebrow: 'Commercial',
  headline: 'Glass systems that hold a building open',
  lead:
    'Entrances, office partitions and railings in glass and stainless steel — designed and installed as one package.',
  hero: {
    image: 'renders/glass-conference-room.jpg',
    alt: 'Frameless glass conference room with stainless spider fittings overlooking the mountains',
  },
  intro: {
    title: 'Built for occupied buildings',
    body: [
      'Specification, shop drawings, fabrication and installation from one team — so responsibility for fit sits in one place, not between three vendors on site.',
    ],
  },
  categories: [
    {
      icon: 'lucide:door-open',
      title: 'Entrance Systems',
      body: 'All-glass storefront doors and patch fittings built for daily traffic.',
      image: 'renders/entrance-vestibule-glass.jpg',
    },
    {
      icon: 'lucide:layout-panel-left',
      title: 'Office Partitions',
      body: 'Glass meeting rooms, workstation runs and full-height walls.',
      image: 'renders/office-meeting-room-glass.jpg',
    },
    {
      icon: 'lucide:fence',
      title: 'Railings & Guardrails',
      body: 'Spigot, channel and post-mounted glass for stairs, balconies and terraces.',
      image: 'renders/deck-railing-sunset.jpg',
    },
  ],
  products: [
    {
      name: 'Patch Fitting Set',
      note: 'Top, bottom and corner patches for all-glass door leaves and fixed sidelights.',
      image: 'products/patch-fitting-set.jpg',
      finishes: ['Brushed stainless', 'Polished chrome'],
    },
    {
      name: 'Storefront Door',
      note: 'Framed entrance leaf with mid-rail pull, prepared for closer and lock hardware.',
      image: 'products/storefront-door.jpg',
    },
    {
      name: 'Ladder Pull, Back-to-Back',
      note: 'Full-height entrance pull, through-fixed for glass door leaves.',
      image: 'products/pull-ladder-back-to-back.jpg',
      finishes: ['Polished stainless', 'Brushed stainless'],
    },
    {
      name: 'Pull Handles',
      note: 'Offset, oval and flush-bar profiles across the finish range.',
      image: 'products/pull-handles-finishes.jpg',
      finishes: ['Brass', 'Matte black', 'Bronze', 'Brushed nickel'],
    },
    {
      name: 'U-Channel',
      note: 'Base channel for frameless glass balustrade, surface or fascia fixed.',
      image: 'products/u-channel.jpg',
      finishes: ['Matte black', 'Brushed stainless'],
    },
    {
      name: 'Slotted Cap Rail',
      note: 'Top rail that caps the glass edge and ties a run of panels into one member.',
      image: 'products/cap-rail-slotted.jpg',
    },
    {
      name: 'Stainless Spigot',
      note: 'Core-drilled and base-plate spigots for frameless glass guardrail.',
      image: 'products/spigot-stainless.jpg',
      finishes: ['Brushed stainless'],
    },
    {
      name: 'Flush Elbow, 90°',
      note: 'Tube-to-tube transition for handrail returns and stair landings.',
      image: 'products/elbow-flush-90.jpg',
    },
    {
      name: 'Corner Connector',
      note: 'Mitred corner for slotted rail and channel runs.',
      image: 'products/corner-connector.jpg',
    },
    {
      name: 'Handrail Wall Bracket',
      note: 'Adjustable saddle bracket for wall-mounted handrail runs.',
      image: 'products/wall-bracket-handrail.jpg',
    },
    {
      name: 'Base Flange',
      note: 'Floor flange for post-mounted railing and stanchion assemblies.',
      image: 'products/base-flange.jpg',
    },
    {
      name: 'Post Profile & Fittings',
      note: 'Square post extrusion with the glass clamps and base hardware it takes.',
      image: 'products/post-profile-fittings.jpg',
    },
  ],
  planIntro: {
    title: 'Drawings, not just photographs',
    body:
      'Every fitting we specify ships with a dimensioned template. These are the drawings your glazier cuts to — hole centres, cut-out geometry and edge clearances in imperial and metric — published here so a specifier can check fit before anything is ordered.',
  },
  plans: [
    {
      image: 'plans/glass-cutout-templates.png',
      title: 'Glass Cut-Out Templates',
      caption:
        'Fixed panel and door leaf templates, including the "Mouse-Ear" cut-out option. All measurements are projected from the edge of the glass.',
      units: 'Imperial (metric)  ·  1:1 at print size',
      callouts: [
        { label: 'Hole diameter', value: '5/8" (16mm)' },
        { label: 'Edge to hole centre', value: '1-7/16" (36mm)' },
        { label: 'Hole spacing', value: '2-1/16" (52mm)' },
        { label: 'Edge clearance', value: '1/8" (3mm)' },
        { label: 'Cut-out option', value: '"Mouse-Ear"' },
      ],
    },
    {
      image: 'plans/glass-cut-out-hinge.png',
      title: 'Hinge Glass Cut-Out',
      caption: 'Cut-out geometry for the wall-mount hinge, dimensioned from both glass edges.',
      units: 'Imperial (metric)',
      callouts: [
        { label: 'Reference', value: 'Edge of glass, both axes' },
        { label: 'Hole diameter', value: '5/8" (16mm)' },
      ],
    },
    {
      image: 'plans/hinge-front-side-views.png',
      title: 'Hinge — Front & Side Views',
      caption: 'Orthographic views with plate footprint, pivot offset and overall projection.',
      units: 'Imperial (metric)',
      callouts: [
        { label: 'Views', value: 'Front · Side' },
        { label: 'Pivot', value: 'Marked A on front view' },
      ],
    },
    {
      image: 'plans/hinge-dimensions.png',
      title: 'Hinge Overall Dimensions',
      caption: 'Plate height, wall projection and fixing centres for the wall-mount hinge.',
      units: 'Imperial',
      callouts: [
        { label: 'Plate height', value: '3-9/16"' },
        { label: 'Glass gap', value: '3/16"' },
      ],
    },
  ],
  process: [
    { icon: PROCESS_ICONS[0], title: PROCESS_TITLES[0], body: 'We review the drawings or the space and agree the system before quoting.' },
    { icon: PROCESS_ICONS[1], title: PROCESS_TITLES[1], body: 'Measured on site once the opening is built — not from the plans.' },
    { icon: PROCESS_ICONS[2], title: PROCESS_TITLES[2], body: 'Glass cut and tempered to template; hardware dry-fitted in the shop.' },
    { icon: PROCESS_ICONS[3], title: PROCESS_TITLES[3], body: 'Installed and adjusted by our own crew, handed over the same visit.' },
  ],
  gallery: [
    {
      image: 'scenes/skylight-structure.jpg',
      label: 'Skylight Structure',
      note: 'Framed glass roof engineered for light and load.',
    },
    {
      image: 'projects/spiral-stair-glass.jpg',
      label: 'Spiral Stair',
      note: 'Glass balustrade following a curved stair.',
    },
    {
      image: 'projects/rooftop-railing-city.jpg',
      label: 'Rooftop Terrace',
      note: 'Post-and-glass guardrail on a city terrace.',
    },
    {
      image: 'projects/display-case-glass.jpg',
      label: 'Display Case',
      note: 'Frameless glass case on stainless fittings.',
    },
  ],
  cta: {
    headline: 'Send us the opening',
    body: 'Drawings, a sketch or a photo with a tape in it — enough to size the system and come back with a real number.',
  },
  gaps: [
    {
      where: 'Systems we build',
      needs:
        'The three reference images at full resolution. The ones in place were rebuilt from WhatsApp screenshots (~900px wide), which is fine on these cards and too small for anything larger.',
    },
    {
      where: 'Project gallery',
      needs:
        'Photographs of completed Vetro Steel commercial installations. Everything shown here is catalog and reference imagery — no installed job is documented yet.',
    },
    {
      where: 'Office partition drawings',
      needs:
        'Dimensioned partition plans (PDF vector or DWG). The isometric supplied has no dimensions, scale or legend, so it cannot drive the plan viewer. The drawings shown are the hinge and cut-out templates from the catalog.',
    },
    {
      where: 'Product specifications',
      needs:
        'Spec sheets: glass thickness range, load rating and finish codes per fitting. Product notes here describe function only — no ratings have been stated.',
    },
  ],
};

export const residential: Vertical = {
  slug: 'residential',
  nav: 'Residential',
  eyebrow: 'Residential',
  headline: 'Bath enclosures, down to the hinge',
  lead:
    'Shower enclosures, sliding systems and glass railings for the home, with hardware built for daily use.',
  hero: {
    image: 'renders/shower-sliding-matte-black.jpg',
    alt: 'Frameless glass shower enclosure with a matte black sliding track',
  },
  intro: {
    title: 'The hardware is the detail',
    body: [
      'Hinge, clamp, knob and roller chosen for your glass and the way the door is used — with a finish that matches your fixtures and still closes true years later.',
    ],
  },
  categories: [
    {
      icon: 'lucide:shower-head',
      title: 'Shower Hardware',
      body: 'Hinges, clamps, knobs and support bars for frameless enclosures.',
      image: 'scenes/shower-enclosure-stone.jpg',
    },
    {
      icon: 'lucide:move-horizontal',
      title: 'Sliding Systems',
      body: 'Barn-style and bypass kits — track, rollers and guides as one set.',
      image: 'scenes/shower-sliding-black.jpg',
    },
    {
      icon: 'lucide:bath',
      title: 'Bath Screens & Railings',
      body: 'Over-bath screens and interior glass railing in a matching finish.',
      image: 'scenes/tub-screen-gold.jpg',
    },
  ],
  products: [
    {
      name: 'Wall Mount Hinge',
      note: 'Full-back-plate hinge for a door hung off tile or stud wall.',
      image: 'products/hinge-wall-mount.jpg',
      finishes: ['Brushed nickel', 'Polished chrome'],
    },
    {
      name: 'Glass-to-Glass Hinge',
      note: 'Panel-to-door hinge where the enclosure returns without a post.',
      image: 'products/hinge-glass-to-glass.jpg',
      finishes: ['Polished chrome'],
    },
    {
      name: 'Offset Wall Hinge',
      note: 'Wall hinge with an offset plate for out-of-plumb or tiled returns.',
      image: 'products/hinge-offset-wall.jpg',
      finishes: ['Brushed stainless'],
    },
    {
      name: 'Shower Knob',
      note: 'Through-glass knob, single or back-to-back.',
      image: 'products/shower-knob.jpg',
      finishes: ['Brushed stainless'],
    },
    {
      name: 'Round Pull, Back-to-Back',
      note: 'Tubular pull for heavier frameless door leaves.',
      image: 'products/pull-round-back-to-back.jpg',
      finishes: ['Polished chrome'],
    },
    {
      name: 'Glass Clamp, 90°',
      note: 'Panel-to-panel clamp for fixed returns and screen corners.',
      image: 'products/glass-clamp-90.jpg',
    },
    {
      name: 'Brass Glass Clamp',
      note: 'Clamp in the brass finish family, for warm-metal bathrooms.',
      image: 'products/glass-clamp-brass.jpg',
      finishes: ['Brass'],
    },
    {
      name: 'Sliding Kit',
      note: 'Complete sliding set — track, rollers, wall brackets, stops and fixings.',
      image: 'products/sliding-kit-square.jpg',
      finishes: ['Matte black', 'Brushed stainless'],
    },
    {
      name: 'Sliding Roller, Black',
      note: 'Roller carriage and header hardware for barn-style shower doors.',
      image: 'products/sliding-roller-black.jpg',
      finishes: ['Matte black'],
    },
    {
      name: 'Brass Spigot',
      note: 'Base spigot for interior glass railing and landing guards.',
      image: 'products/spigot-brass.jpg',
      finishes: ['Brass'],
    },
    {
      name: 'Pull Handles',
      note: 'The finish range shower and screen pulls are drawn from.',
      image: 'products/pull-handles-finishes.jpg',
      finishes: ['Brass', 'Matte black', 'Bronze', 'Brushed nickel'],
    },
    {
      name: 'Corner Connector',
      note: 'Mitred corner for over-bath screen rails and channel returns.',
      image: 'products/corner-connector.jpg',
    },
  ],
  planIntro: {
    title: 'Cut to the template, not to the eye',
    body:
      'A frameless shower door is only square if the glass was drilled square. These are the same dimensioned templates our fabricator works to — publish them, and your glazier can check a cut-out before the panel is toughened, when it is still possible to change.',
  },
  plans: [
    {
      image: 'plans/glass-cutout-templates.png',
      title: 'Fixed Panel & Door Templates',
      caption:
        'Hole centres for the fixed panel, and the door leaf cut-out with the "Mouse-Ear" option. Measurements project from the edge of the glass.',
      units: 'Imperial (metric)  ·  1:1 at print size',
      callouts: [
        { label: 'Hole diameter', value: '5/8" (16mm)' },
        { label: 'Edge to hole centre', value: '1-7/16" (36mm)' },
        { label: 'Hole spacing', value: '2-1/16" (52mm)' },
        { label: 'Edge clearance', value: '1/8" (3mm)' },
      ],
    },
    {
      image: 'plans/glass-cut-out-hinge.png',
      title: 'Hinge Glass Cut-Out',
      caption: 'The notch a wall-mount hinge takes out of the door leaf.',
      units: 'Imperial (metric)',
      callouts: [
        { label: 'Reference', value: 'Edge of glass' },
        { label: 'Hole diameter', value: '5/8" (16mm)' },
      ],
    },
    {
      image: 'plans/hinge-front-side-views.png',
      title: 'Hinge — Front & Side Views',
      caption: 'Plate footprint and projection, for checking clearance against tile trim and niches.',
      units: 'Imperial (metric)',
      callouts: [
        { label: 'Views', value: 'Front · Side' },
        { label: 'Pivot', value: 'Marked A on front view' },
      ],
    },
  ],
  process: [
    { icon: PROCESS_ICONS[0], title: PROCESS_TITLES[0], body: 'We settle layout, glass and finish to match your fixtures.' },
    { icon: PROCESS_ICONS[1], title: PROCESS_TITLES[1], body: 'Measured after tiling, so the glass fits the real opening.' },
    { icon: PROCESS_ICONS[2], title: PROCESS_TITLES[2], body: 'Glass cut, notched and tempered; hardware matched as one set.' },
    { icon: PROCESS_ICONS[3], title: PROCESS_TITLES[3], body: 'Typically installed in a day — usable that same evening.' },
  ],
  gallery: [
    {
      image: 'scenes/shower-marble-sliding.jpg',
      label: 'Marble Sliding Enclosure',
      note: 'Sliding glass door against full-height marble.',
    },
    {
      image: 'scenes/railing-glass-brass.jpg',
      label: 'Garden Stair Railing',
      note: 'Glass guardrail with a brass handrail.',
    },
    {
      image: 'projects/stair-handrail-interior.jpg',
      label: 'Interior Stair',
      note: 'Stainless handrail over timber treads.',
    },
    {
      image: 'projects/deck-railing-lakeside.jpg',
      label: 'Lakeside Deck',
      note: 'Post-mounted glass railing on a timber deck.',
    },
  ],
  cta: {
    headline: 'Tell us about the bathroom',
    body: 'Rough dimensions and a photo of the space are enough to come back with an enclosure layout and a price.',
  },
  gaps: [
    {
      where: 'Project gallery',
      needs:
        'Photographs of completed Vetro Steel residential installations. The imagery here is catalog photography, not documented jobs.',
    },
    {
      where: 'Before / after',
      needs:
        'Paired before-and-after shots of the same bathroom. The brief asks for these and none were supplied — the comparison component is not built rather than faked with unrelated photos.',
    },
    {
      where: 'Product specifications',
      needs:
        'Glass thickness range and finish codes per fitting. Finishes listed are read off the catalog photography, not from a spec sheet.',
    },
  ],
};

/**
 * Facility maintenance — the subscription line.
 *
 * Source: the client's own services brief (requeriments/servicios.pdf,
 * "Mantenimiento Operativo B2B"). The brief is in Spanish; the site is in
 * English, so the copy below is that document translated, not expanded. Where
 * the brief promises something the site cannot yet evidence — a client-facing
 * panel, a price — it is declared in `gaps` rather than described as if built.
 *
 * This line sells recurring labour, so it carries no `products` and no `plans`:
 * there is no catalog fitting and no cut-out template behind a paint touch-up.
 */
export const maintenance: Vertical = {
  slug: 'maintenance',
  nav: 'Maintenance',
  eyebrow: 'Maintenance',
  headline: 'Office maintenance, on a flat monthly fee',
  lead:
    'Painting, drywall, furniture and glass servicing for your offices — scheduled around your team, with a report after every visit.',
  hero: {
    image: 'renders/maintenance-crew.jpg',
    alt: 'Maintenance crew painting, moving furniture and applying frosted vinyl in an office',
  },
  intro: {
    title: 'One partner for the whole floor',
    body: [
      'Small repairs add up. We take them on a monthly plan: one vendor, one schedule, one invoice — and no interruptions to your operation.',
    ],
  },
  // Not rendered for a service line (the service list replaces the category
  // row); kept because the JSON-LD Service node lists these as its offers.
  categories: [
    {
      icon: 'lucide:paint-roller',
      title: 'General Services',
      body: 'Painting, drywall repair, furniture relocation, assembly and installation.',
      image: 'projects/clinic-partition-blue.jpg',
    },
    {
      icon: 'lucide:sparkles',
      title: 'Glass & Hardware Servicing',
      body: 'Glass cleaning, installation and removal, vinyl, hardware replacement and preventive servicing.',
      image: 'projects/clinic-glass-screen.jpg',
    },
  ],
  programs: [
    {
      icon: 'lucide:calendar-clock',
      title: 'Smart Scheduling',
      body: 'You choose the time. Visits never interrupt your team.',
    },
    {
      icon: 'lucide:target',
      title: 'Priorities or Preventive',
      body: 'Assign the tasks yourself, or let us run our inspection protocol.',
    },
    {
      icon: 'lucide:clipboard-check',
      title: 'Report After Every Visit',
      body: 'A control report and completed checklist, every time.',
    },
    {
      icon: 'lucide:wallet',
      title: 'Flat Monthly Fee',
      body: 'Predictable costs. No hidden charges or surprise invoices.',
    },
    {
      icon: 'lucide:zap',
      title: 'Special Projects on Demand',
      body: 'Remodels, quick adaptations or corporate events, with priority.',
    },
  ],
  serviceGroups: [
    {
      title: 'General services',
      note: 'Keeping the floor presentable.',
      items: [
        { icon: 'lucide:paint-roller', title: 'Painting & Touch-Up', body: 'General painting and touch-up of walls and trim.' },
        { icon: 'lucide:hammer', title: 'Drywall Repair', body: 'Patching and repair of drywall partitions.' },
        { icon: 'lucide:truck', title: 'Furniture Relocation', body: 'Moving office furniture between rooms and floors.' },
        { icon: 'lucide:armchair', title: 'Furniture Assembly & Installation', body: 'Desks, whiteboards, TV mounts and storage units.' },
        { icon: 'lucide:wrench', title: 'General Maintenance', body: 'The everyday repairs a working office needs.' },
      ],
    },
    {
      title: 'Glass-related',
      note: 'The hardware we install, kept working.',
      items: [
        { icon: 'lucide:sparkles', title: 'Glass Cleaning', body: 'Partitions, doors and glazed surfaces.' },
        { icon: 'lucide:panels-top-left', title: 'Glass Installation & Removal', body: 'Fitting and taking down glass panels.' },
        { icon: 'lucide:sticker', title: 'Vinyl Design & Installation', body: 'Frosted film and other applied vinyl graphics.' },
        { icon: 'lucide:key-round', title: 'Hardware Replacement', body: 'Swapping worn or broken glass hardware.' },
        { icon: 'lucide:shield-check', title: 'Preventive Servicing', body: 'Hinges, handles, supports, locks and door stops.' },
      ],
    },
  ],
  process: [
    { icon: 'lucide:clipboard-list', title: 'Walk-Through', body: 'We tour the floor with you and agree what the plan covers.' },
    { icon: 'lucide:calendar-check', title: 'Plan & Schedule', body: 'Frequency, priorities and time windows fixed in writing.' },
    { icon: 'lucide:hard-hat', title: 'Service Visit', body: 'Our crew works the agreed window — after hours if needed.' },
    { icon: 'lucide:file-check', title: 'Report & Sign-Off', body: 'You get the report and checklist for every visit.' },
  ],
  gallery: [
    {
      image: 'projects/clinic-glass-screen.jpg',
      label: 'Clinic Glass Screen',
      note: 'Glazed division kept clean and serviced.',
    },
    {
      image: 'scenes/office-glass-doors.jpg',
      label: 'Glazed Office Doors',
      note: 'Hinges and locks checked on every visit.',
    },
    {
      image: 'projects/gym-stainless-frames.jpg',
      label: 'Stainless Framing',
      note: 'Steel and glass maintained on the same plan.',
    },
  ],
  cta: {
    headline: 'Ask for a maintenance walk-through',
    body: 'Tell us your floor area and we will come back with a visit schedule and a monthly figure.',
  },
  gaps: [
    {
      where: 'Project gallery',
      needs:
        'Photographs of the maintenance crew at work — painting, drywall repair, furniture assembly, glass cleaning. The hero is an AI-generated illustration supplied by the client; real photographs of completed maintenance work are still needed for this gallery.',
    },
    {
      where: 'Plan tiers and pricing',
      needs:
        'The tier structure behind the flat fee: visit frequency, hours included per visit and the price bands per floor area. The brief states the principle ("tarifa plana fija") without a single number, so the page states the principle too.',
    },
    {
      where: 'Client panel',
      needs:
        'The brief promises a "panel directivo" for assigning priority tasks and digital checklists. No such tool exists yet, so the page describes assigning tasks as a service, not as a product a visitor can log into.',
    },
  ],
};

export const verticals: Vertical[] = [commercial, residential, maintenance];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

/**
 * Accepted values for the quote form's "line of work" field.
 *
 * The Pages Function imports this rather than keeping its own copy, so adding
 * a vertical can never leave the server rejecting an option the form offers.
 */
export const verticalSlugs = verticals.map((v) => v.slug);

/** Human label for a slug, for the notification email. */
export const verticalLabel = (slug: string): string =>
  verticals.find((v) => v.slug === slug)?.nav ?? slug;
