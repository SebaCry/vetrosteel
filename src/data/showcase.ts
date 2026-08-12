/**
 * "Drawing → Built" material.
 *
 * IMPORTANT — provenance. The clips in `stages` and `transitions` are
 * AI-generated visualisations (Google Veo; the files carry a `beam` atom and
 * five of them the Gemini sparkle). They illustrate how a job moves from
 * drawing to finished work; they are NOT footage of completed Vetro Steel
 * installations, and the UI labels them as visualisations for that reason.
 *
 * `projects` is the opposite: 21 photographs of real, completed installations.
 * That is the section that carries the evidence.
 */

export interface Clip {
  /** Basename in /public/video and src/assets/posters. */
  slug: string;
  title: string;
  note: string;
  /**
   * Paint the Vetro Steel badge over the bottom-right corner.
   *
   * On every current clip this is true. The Gemini sparkle only becomes
   * visible once a clip cuts from a white drawing to a darker scene, so
   * judging it from the opening frame under-counts — the badge goes on all
   * of them and doubles as consistent branding.
   */
  watermark: boolean;
}

export interface Stage extends Clip {
  step: string;
  label: string;
}

export interface Transition extends Clip {
  before: string;
  after: string;
}

/** The three-step arc, shown with arrow connectors. */
export const stages: Stage[] = [
  {
    step: '01',
    label: 'The drawing',
    slug: 'floor-plan-residence',
    title: 'Set out on plan',
    note: 'Openings, swings and glass runs are fixed on the floor plan before a single panel is cut.',
    watermark: true,
  },
  {
    step: '02',
    label: 'The detail',
    slug: 'anchor-spec-callout',
    title: 'Specified to the fixing',
    // The clip cycles through several callouts, so the copy stays general
    // rather than quoting a dimension that is only on screen for a moment.
    note: 'Anchors and accessories are called out as they go in — size, length and the finish code.',
    watermark: true,
  },
  {
    step: '03',
    label: 'The finish',
    slug: 'office-glass-suite',
    title: 'Set, levelled, adjusted',
    note: 'Panels clamped and levelled until the joint lines run true. At this scale the joint is the finish.',
    watermark: true,
  },
];

/** Split-screen clips where the drawing wipes across into the built result. */
export const transitions: Transition[] = [
  {
    slug: 'elevation-to-facade',
    title: 'Curtain wall elevation',
    note: 'A dimensioned elevation resolving into the glazed façade it describes.',
    before: 'Elevation',
    after: 'Built',
    watermark: true,
  },
  {
    slug: 'elevation-to-portico',
    title: 'Portico framing',
    note: 'Structural framing drawing against the finished colonnade and glazing line.',
    before: 'Framing plan',
    after: 'Built',
    watermark: true,
  },
];

/** Finished spaces, shown as a supporting strip. */
export const spaces: Clip[] = [
  {
    slug: 'office-railing-dolly',
    title: 'Mezzanine guardrail',
    note: 'Frameless glass guardrail with a continuous stainless top rail.',
    watermark: true,
  },
  {
    slug: 'stair-railing-office',
    title: 'Stair and landing',
    note: 'Handrail returning into the landing balustrade without a visible joint.',
    watermark: true,
  },
  {
    slug: 'office-partitions-run',
    title: 'Workstation partitions',
    note: 'A run of low glass divisions on a shared aluminium base channel.',
    watermark: true,
  },
];

export interface Project {
  image: string;
  label: string;
  note: string;
}

/** Photographs of completed installations. Real work, real sites. */
export const projects: Project[] = [
  { image: 'projects/pavilion-glass-balustrade.jpg', label: 'Pavilion Balustrade', note: 'Glass guardrail on a steel frame, set over a rendered base wall.' },
  { image: 'projects/pavilion-glass-balustrade-2.jpg', label: 'Pavilion, Corner Return', note: 'The same run turning the corner with a mitred cap rail.' },
  { image: 'projects/rooftop-railing-city.jpg', label: 'Rooftop Terrace', note: 'Post-and-glass guardrail on an exposed city terrace.' },
  { image: 'projects/terrace-railing-bar.jpg', label: 'Terrace Railing', note: 'Stainless posts with glass infill along a paved terrace edge.' },
  { image: 'projects/terrace-railing-restaurant.jpg', label: 'Restaurant Terrace', note: 'Guardrail run enclosing a raised dining deck.' },
  { image: 'projects/facade-balcony-railing.jpg', label: 'Balcony Railing', note: 'Glass balcony fronts across a commercial façade.' },
  { image: 'projects/spiral-stair-glass.jpg', label: 'Spiral Stair', note: 'Curved glass balustrade following a helical stair.' },
  { image: 'projects/stair-railing-timber-treads.jpg', label: 'Feature Stair', note: 'Stainless balustrade against timber treads and a steel stringer.' },
  { image: 'projects/stair-handrail-interior.jpg', label: 'Interior Handrail', note: 'Wall-mounted stainless handrail over a stone stair.' },
  { image: 'projects/curved-glass-partition.jpg', label: 'Curved Partition', note: 'Radiused glass screen with floor and ceiling patch fixings.' },
  { image: 'projects/clinic-partition-blue.jpg', label: 'Clinic Partition', note: 'Printed glass division between treatment bays.' },
  { image: 'projects/clinic-glass-screen.jpg', label: 'Clinic Screen', note: 'Full-height glass screen with a stainless support post.' },
  { image: 'projects/display-case-glass.jpg', label: 'Display Case', note: 'All-glass case assembled with concealed corner fittings.' },
  { image: 'projects/poolside-glass-railing.jpg', label: 'Poolside Guardrail', note: 'Glass guardrail on stainless posts at a pool terrace.' },
  { image: 'projects/deck-railing-lakeside.jpg', label: 'Lakeside Deck', note: 'Post-mounted glass railing on a timber deck.' },
  { image: 'projects/rooftop-railing-hillside.jpg', label: 'Hillside Terrace', note: 'Slim-post glass guardrail on a hillside roof terrace.' },
  { image: 'projects/gym-stainless-frames.jpg', label: 'Stainless Frames', note: 'Polished stainless equipment frames fabricated to drawing.' },
  { image: 'projects/gym-stainless-frames-2.jpg', label: 'Frames, Batch', note: 'The same run before finishing and delivery.' },
  { image: 'projects/steel-bench-orange.jpg', label: 'Steel Bench', note: 'Slatted stainless bench on a powder-coated frame.' },
  { image: 'projects/timber-door-steel-inlay.jpg', label: 'Door Inlay', note: 'Timber leaf with brushed stainless inlay and flush hardware.' },
  { image: 'projects/steel-timber-cross.jpg', label: 'Steel & Timber', note: 'Fabricated steel connection on a laminated timber member.' },
];

/** Generated stills. Kept separate so they are never captioned as built work. */
export const renders: Project[] = [
  { image: 'renders/handrail-detail-lit.jpg', label: 'Handrail Detail', note: 'Visualisation of an illuminated handrail junction.' },
  { image: 'renders/residence-approach.jpg', label: 'Residence Approach', note: 'Visualisation of a residential glazing package.' },
  { image: 'renders/terrace-railing-render.jpg', label: 'Terrace Railing', note: 'Visualisation of a post-and-glass terrace guardrail.' },
];
