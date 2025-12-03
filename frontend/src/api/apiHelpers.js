// -----------------------------------------------------------------------------
// apiHelpers.js
// -----------------------------------------------------------------------------
// Utility functions for normalizing API responses.
// DRF often returns paginated results in the shape:
//   { count, next, previous, results: [...] }
// This helper unwraps that into a plain array.
// -----------------------------------------------------------------------------

/**
 * Normalize DRF API responses into a simple array.
 * @param {object} res - Axios response
 * @returns {Array}
 */
export function unwrapResults(res) {
  if (!res || !res.data) return [];
  if (Array.isArray(res.data)) return res.data; // already an array
  if (Array.isArray(res.data.results)) return res.data.results; // paginated
  return []; // fallback
}
