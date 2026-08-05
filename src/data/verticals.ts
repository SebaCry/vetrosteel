/**
 * The two business verticals.
 *
 * Everything a vertical page renders lives here. Adding a third line (say
 * "Skylights & Canopies") means appending one entry to `verticals` — the
 * route, nav entry, sitemap and quote-form option all follow from it.
 *
 * Copy uses the client's own catalog terminology: Sliding Systems, Shower
 * Hardware, Pull Handles, Railings, Entrance Systems.
 */

export interface ProductItem {
  name: string;
  note: string;
  image: string;
  /** Finishes visible in the catalog photography. Not an ordering spec. */
  finishes?: string[];
}

export interface CategoryItem {
  title: string;
  body: string;
  image: string;
}

export interface ProcessStep {
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

export interface Vertical {
  slug: 'commercial' | 'residential';
  nav: string;
  eyebrow: string;
  headline: string;
  lead: string;
  hero: { image: string; alt: string };
  intro: { title: string; body: string[] };
  categories: CategoryItem[];
  products: ProductItem[];
  plans: PlanItem[];
  planIntro: { title: string; body: string };
  process: ProcessStep[];
  gallery: GalleryItem[];
  cta: { headline: string; body: string };
  /** Material the client still owes us. Surfaced by <MaterialNote>. */
  gaps: { where: string; needs: string }[];
}

const PROCESS_TITLES = ['Consultation', 'Field Measurement', 'Fabrication', 'Installation'] as const;

export const commercial: Vertical = {
  slug: 'commercial',
  nav: 'Commercial',
  eyebrow: 'Commercial',
  headline: 'Glass systems that hold a building open',
  lead:
    'Entrance systems, office partitions and railings in tempered glass and stainless steel — specified, fabricated and installed as one package.',
  hero: {
    image: 'scenes/storefront-entrance.jpg',
    alt: 'Commercial storefront in structural glass with stainless steel entrance framing',
  },
  intro: {
    title: 'Built for occupied buildings',
    body: [
      'Commercial work is measured in tolerances and in schedule. A partition that arrives 3mm out is a partition that goes back on the truck, and an entrance that cannot be re-hung on a Friday afternoon is a tenant without a door on Monday.',
      'We carry the whole chain — hardware specification, shop drawings, fabrication and installation — so the responsibility for fit sits in one place instead of being negotiated between three vendors on site.',
    ],
  },
  categories: [
    {
      title: 'Entrance Systems',
      body: 'Storefront doors, patch fittings and floor-spring assemblies for all-glass entrances that take daily traffic without sagging.',
      image: 'scenes/storefront-entrance.jpg',
    },
    {
      title: 'Office Partitions & Framing',
      body: 'Glass office divisions with stainless and aluminium framing — meeting rooms, workstation runs and full-height demountable walls.',
      image: 'scenes/office-glass-doors.jpg',
    },
    {
      title: 'Railings & Guardrails',
      body: 'Spigot, U-channel and post-mounted glass railing systems for stairs, mezzanines, balconies and roof terraces.',
      image: 'scenes/railing-exterior-stair.jpg',
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
    {
      title: PROCESS_TITLES[0],
      body: 'We review drawings or the space itself, agree the system — framed, frameless, spigot or channel — and confirm hardware, finish and glass make-up before a quote goes out.',
    },
    {
      title: PROCESS_TITLES[1],
      body: 'We measure on site once the opening is built, not from the architectural set. Openings move; templates are cut to what is actually there.',
    },
    {
      title: PROCESS_TITLES[2],
      body: 'Glass is cut, tempered and processed to the templates in this section. Hardware is prepared and dry-fitted before it leaves the shop.',
    },
    {
      title: PROCESS_TITLES[3],
      body: 'Installed by our own crew, sequenced around the trades still working around us, with adjustment and hand-over on the same visit.',
    },
  ],
  gallery: [
    {
      image: 'scenes/storefront-entrance.jpg',
      label: 'Storefront Entrance',
      note: 'Full-height glazed entrance with stainless patch fittings.',
    },
    {
      image: 'scenes/office-glass-doors.jpg',
      label: 'Office Partition',
      note: 'Glazed office division with framed door leaves.',
    },
    {
      image: 'scenes/curtain-wall-facade.jpg',
      label: 'Curtain Wall',
      note: 'Structural glass envelope over a steel frame.',
    },
    {
      image: 'scenes/skylight-structure.jpg',
      label: 'Skylight Structure',
      note: 'Framed glass roof engineered for light and load.',
    },
    {
      image: 'scenes/railing-exterior-stair.jpg',
      label: 'Exterior Stair Railing',
      note: 'Frameless glass guardrail with brass handrail.',
    },
    {
      image: 'scenes/railing-glass-brass.jpg',
      label: 'Guardrail Detail',
      note: 'Glass-to-handrail junction at the stair return.',
    },
  ],
  cta: {
    headline: 'Send us the opening',
    body: 'Drawings, a sketch or a photo with a tape in it — enough to size the system and come back with a real number.',
  },
  gaps: [
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
    'Shower hardware, sliding systems and glass railing for the home — where the fitting is at eye level and the finish has to survive being touched every day.',
  hero: {
    image: 'scenes/bath-walkin-modern.jpg',
    alt: 'Contemporary bathroom with a frameless glass shower enclosure and stainless fittings',
  },
  intro: {
    title: 'The hardware is the detail',
    body: [
      'In a bathroom nobody stands back to admire the elevation. They stand at arm\'s length from a hinge, and they touch it twice a day. So the argument is made close up: how the plate meets the glass, whether the finish matches the tapware, whether the door still closes true in year three.',
      'We specify to the fitting rather than to the opening — hinge, clamp, knob and roller chosen for the glass thickness and the way the door will actually be used, then cut to the templates that hardware requires.',
    ],
  },
  categories: [
    {
      title: 'Shower Hardware',
      body: 'Wall-mount and glass-to-glass hinges, clamps, knobs and support bars for frameless and semi-frameless enclosures.',
      image: 'scenes/bath-fixed-panel.jpg',
    },
    {
      title: 'Sliding Systems',
      body: 'Barn-style and bypass sliding shower kits — track, rollers, stops and guides supplied as a matched set.',
      image: 'scenes/shower-sliding-black.jpg',
    },
    {
      title: 'Bath Screens & Railings',
      body: 'Over-bath screens and interior glass railing in the same finish family as the enclosure hardware.',
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
    {
      title: PROCESS_TITLES[0],
      body: 'We look at the bathroom — or the drawing — and settle the layout, the glass thickness and the finish, matching the hardware to the tapware you have already chosen.',
    },
    {
      title: PROCESS_TITLES[1],
      body: 'We measure after tiling, never before. A shower opening tapers; the enclosure is cut to the opening that exists, plumb checked corner to corner.',
    },
    {
      title: PROCESS_TITLES[2],
      body: 'Glass is cut, notched to the hinge templates, polished and toughened. Hardware is matched as a set so finishes come from one batch.',
    },
    {
      title: PROCESS_TITLES[3],
      body: 'Installed, sealed and adjusted so the door holds where you leave it — typically inside a day, with the bathroom usable that evening.',
    },
  ],
  gallery: [
    {
      image: 'scenes/bath-walkin-modern.jpg',
      label: 'Walk-In Enclosure',
      note: 'Fixed panel with a slim stainless support bar.',
    },
    {
      image: 'scenes/shower-sliding-black.jpg',
      label: 'Sliding Shower Door',
      note: 'Barn-style track in matte black over textured glass.',
    },
    {
      image: 'scenes/tub-screen-gold.jpg',
      label: 'Over-Bath Screen',
      note: 'Bath screen with brass track and brackets.',
    },
    {
      image: 'scenes/bath-fixed-panel.jpg',
      label: 'Fixed Panel',
      note: 'Frameless return panel, clamped top and bottom.',
    },
    {
      image: 'scenes/shower-marble-sliding.jpg',
      label: 'Sliding Over Stone',
      note: 'Black hardware against full-height marble.',
    },
    {
      image: 'scenes/shower-enclosure-stone.jpg',
      label: 'Corner Enclosure',
      note: 'Two-panel corner with a glass-to-glass hinge.',
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

export const verticals: Vertical[] = [commercial, residential];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}
