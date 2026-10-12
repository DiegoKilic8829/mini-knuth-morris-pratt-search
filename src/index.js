/**
 * Re-export of the public search API.
 *
 * Keeping index.js as a thin barrel so callers import from the package
 * root (`mini-knuth-morris-pratt-search`) without needing to know about
 * the internal module layout.
 */
export { kmpSearch, kmpSearchAll } from './core.js';
