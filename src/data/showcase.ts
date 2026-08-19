/**
 * "Drawing → Built" material.
 *
 * IMPORTANT — provenance. The clips in `stages` and `transitions` are
 * AI-generated visualisations (Google Veo; the files carry a `beam` atom and
 * five of them the Gemini sparkle). They illustrate how a job moves from
 * drawing to finished work; they are NOT footage of completed Vetro Steel
 * installations, and the UI labels them as visualisations for that reason.
 *
 * `projects` is the opposite: photographs of real, completed installations.
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
  /**
   * Playback window, in seconds. Every source clip is exactly 10s, and every
   * one of them degrades in its back half: the generator hallucinates spec
   * labels that read as gibberish ("STAIPLEED GLA", "OLA'L STAINLESS STEEL
   * FIXINGS", "STANIEGS 304"), leaks filenames ("image_3.png") and even the
   * typeface name ("Montserrat") into callouts, mixes Spanish into an English
   * site, and closes on a generated brand card.
   *
   * So these windows are not only about length — the opening seconds are the
   * only publishable part. Each one is cut to end before its first bad frame,
   * which is why they land at 3.6-5.6s rather than a round number.
   */
  start: number;
  end: number;
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
    // Plan, then the built partitions. Cuts at 4.0: the callouts that follow
    // read "SAFET" and "image_3.png".
    start: 0.15,
    end: 4.0,
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
    // Anchor, accessory and glass callouts — the one clip whose labels stay
    // legible. Cuts before the generated brand card.
    start: 0.0,
    end: 5.4,
  },
  {
    step: '03',
    label: 'The finish',
    slug: 'office-glass-suite',
    title: 'Set, levelled, adjusted',
    note: 'Panels clamped and levelled until the joint lines run true. At this scale the joint is the finish.',
    watermark: true,
    // No overlaid text at all: wide room pushing in to the clamp detail.
    start: 0.0,
    end: 5.6,
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
    // Split drawing/facade, then the facade clean. Cuts before the callouts
    // start dropping characters.
    start: 0.0,
    end: 4.4,
  },
  {
    slug: 'elevation-to-portico',
    title: 'Portico framing',
    note: 'Structural framing drawing against the finished colonnade and glazing line.',
    before: 'Framing plan',
    after: 'Built',
    watermark: true,
    // Cuts at 4.6: at 5.7 the clip draws red X marks over its own callouts
    // and the labels switch to Spanish.
    start: 0.0,
    end: 4.6,
  },
];

/** Finished spaces, shown as a supporting strip. */
export const spaces: Clip[] = [
  {
    slug: 'office-railing-dolly',
    title: 'Mezzanine guardrail',
    note: 'Frameless glass guardrail with a continuous stainless top rail.',
    watermark: true,
    start: 0.0,
    end: 4.0,
  },
  {
    slug: 'stair-railing-office',
    title: 'Stair and landing',
    note: 'Handrail returning into the landing balustrade without a visible joint.',
    watermark: true,
    start: 0.0,
    end: 4.0,
  },
  {
    slug: 'office-partitions-run',
    title: 'Workstation partitions',
    note: 'A run of low glass divisions on a shared aluminium base channel.',
    watermark: true,
    // Only the first few seconds survive: by 4.3 the labels read "STAIPLEED
    // GLA" and the exploded view is annotated "Montserrat".
    start: 0.0,
    end: 3.6,
  },
];

export interface Project {
  image: string;
  label: string;
  note: string;
}

/**
 * Photographs of completed installations. Real work, real sites.
 *
 * Cut from 21 to 10. The files for the other eleven are still in
 * src/assets/projects — nothing was deleted, so putting one back is a single
 * line here. They were dropped for these reasons:
 *
 *   terrace-railing-restaurant  a McDonald's sign dominates the frame
 *   steel-timber-cross          a wall crucifix; nothing to do with the offer
 *   gym-stainless-frames (+ -2) exercise-bike frames, off-message for glazing
 *   steel-bench-orange          orange powder-coat, fights the palette
 *   clinic-glass-screen         640x480, heavy green cast, shows a dental chair
 *   clinic-partition-blue       720x480, cluttered, glass barely reads
 *   display-case-glass          640x853, flat light, packing box in shot
 *   facade-balcony-railing      639x428, too small to enlarge
 *   stair-handrail-interior     shot upward mid-works, reads unfinished
 *   pavilion-glass-balustrade-2 same run, weaker angle than the one kept
 *
 * The keepers are the ones that are both sharp enough to enlarge and show the
 * glass-and-stainless work as the subject rather than the background.
 */
export const projects: Project[] = [
  { image: 'projects/curved-glass-partition.jpg', label: 'Curved Partition', note: 'Radiused glass screen with floor and ceiling patch fixings.' },
  { image: 'projects/poolside-glass-railing.jpg', label: 'Poolside Guardrail', note: 'Glass guardrail on stainless posts at a pool terrace.' },
  { image: 'projects/rooftop-railing-city.jpg', label: 'Rooftop Terrace', note: 'Post-and-glass guardrail on an exposed city terrace.' },
  { image: 'projects/stair-railing-timber-treads.jpg', label: 'Feature Stair', note: 'Stainless balustrade against timber treads and a steel stringer.' },
  { image: 'projects/deck-railing-lakeside.jpg', label: 'Lakeside Deck', note: 'Post-mounted glass railing on a timber deck.' },
  { image: 'projects/pavilion-glass-balustrade.jpg', label: 'Pavilion Balustrade', note: 'Glass guardrail on a steel frame, set over a rendered base wall.' },
  { image: 'projects/terrace-railing-bar.jpg', label: 'Terrace Railing', note: 'Stainless posts with glass infill along a paved terrace edge.' },
  { image: 'projects/rooftop-railing-hillside.jpg', label: 'Hillside Terrace', note: 'Slim-post glass guardrail on a hillside roof terrace.' },
  { image: 'projects/timber-door-steel-inlay.jpg', label: 'Door Inlay', note: 'Timber leaf with brushed stainless inlay and flush hardware.' },
];

/** Generated stills. Kept separate so they are never captioned as built work. */
export const renders: Project[] = [
  { image: 'renders/handrail-detail-lit.jpg', label: 'Handrail Detail', note: 'Visualisation of an illuminated handrail junction.' },
  { image: 'renders/residence-approach.jpg', label: 'Residence Approach', note: 'Visualisation of a residential glazing package.' },
  { image: 'renders/terrace-railing-render.jpg', label: 'Terrace Railing', note: 'Visualisation of a post-and-glass terrace guardrail.' },
];
