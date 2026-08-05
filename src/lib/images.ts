import type { ImageMetadata } from 'astro';

/**
 * Every file under src/assets, keyed by its path relative to that folder
 * (e.g. `scenes/storefront-entrance.jpg`).
 *
 * Data files reference imagery by string key so a new product line is a data
 * entry, not a new import — while still going through `astro:assets`, which is
 * what gets us AVIF/WebP + responsive srcset.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

export function hasAsset(key: string): boolean {
  return Boolean(files[`/src/assets/${key}`]);
}

export function asset(key: string): ImageMetadata {
  const entry = files[`/src/assets/${key}`];
  if (!entry) {
    throw new Error(
      `[vetro] Missing asset "src/assets/${key}". Available:\n` +
        Object.keys(files).map((k) => `  ${k.replace('/src/assets/', '')}`).join('\n')
    );
  }
  return entry.default;
}
