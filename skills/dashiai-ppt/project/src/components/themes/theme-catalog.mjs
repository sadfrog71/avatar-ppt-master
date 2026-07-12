import { GENERATED_THEME_PACKS, GENERATED_THEME_PAGES } from './generated-metadata.js';
import { theme as theme13, pages as theme13Pages } from './theme13/metadata.js';

// Keep extension themes separate from the generated legacy catalog so they can
// be reviewed, versioned and removed independently.
export const THEME_PACKS = [...GENERATED_THEME_PACKS, theme13];
export const THEME_PAGES = [...GENERATED_THEME_PAGES, ...theme13Pages];
