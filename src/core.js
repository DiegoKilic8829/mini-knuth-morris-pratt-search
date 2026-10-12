/**
 * Knuth-Morris-Pratt substring search.
 *
 * The prefix function (a.k.a. "failure function") for a pattern P records, for
 * every position i, the length of the longest proper prefix of P[0..i] that is
 * also a suffix of P[0..i]. Precomputing it lets the search phase skip forward
 * on a mismatch instead of restarting at the previous character in the text —
 * the core advantage over the naive O(n·m) scan.
 */

/**
 * Build the KMP prefix (failure) function for a pattern.
 *
 * @param {string} pattern - Non-empty search pattern.
 * @returns {number[]} Array where entry i is the length of the longest proper
 *   prefix of pattern[0..i] that is also a suffix of pattern[0..i].
 * @throws {Error} If pattern is empty.
 */
export function buildPrefixFunction(pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (pattern.length === 0) {
    throw new Error('pattern must not be empty');
  }

  const prefix = new Array(pattern.length).fill(0);
  let k = 0; // length of the current matching prefix-suffix

  for (let q = 1; q < pattern.length; q++) {
    while (k > 0 && pattern.charCodeAt(k) !== pattern.charCodeAt(q)) {
      // Mismatch: fall back to the longest prefix-suffix of the prefix we
      // had matched so far. Using charCodeAt avoids allocating substrings.
      k = prefix[k - 1];
    }
    if (pattern.charCodeAt(k) === pattern.charCodeAt(q)) {
      k++;
    }
    prefix[q] = k;
  }

  return prefix;
}

/**
 * Search for the first occurrence of `pattern` in `text` using KMP.
 *
 * Returns the starting index of the first match, or -1 if not found.
 * Comparisons are done on UTF-16 code units via charCodeAt, so the returned
 * index counts code units (not Unicode code points). For BMP-only text this
 * is the same as character count.
 *
 * @param {string} text - The haystack.
 * @param {string} pattern - The needle; must be non-empty.
 * @returns {number} Starting index of the first match, or -1.
 */
export function kmpSearch(text, pattern) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (pattern.length === 0) {
    throw new Error('pattern must not be empty');
  }

  const prefix = buildPrefixFunction(pattern);
  let q = 0; // characters of pattern matched so far

  for (let i = 0; i < text.length; i++) {
    while (q > 0 && pattern.charCodeAt(q) !== text.charCodeAt(i)) {
      q = prefix[q - 1];
    }
    if (pattern.charCodeAt(q) === text.charCodeAt(i)) {
      q++;
    }
    if (q === pattern.length) {
      return i - pattern.length + 1;
    }
  }

  return -1;
}

/**
 * Find every occurrence of `pattern` in `text` using KMP.
 *
 * After a full match is found the prefix function is consulted to restart the
 * search, which correctly handles overlapping matches (e.g. pattern "aa" in
 * text "aaa" yields indices [0, 1]).
 *
 * @param {string} text - The haystack.
 * @param {string} pattern - The needle; must be non-empty.
 * @returns {number[]} Array of starting indices of all matches, in ascending order.
 */
export function kmpSearchAll(text, pattern) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (pattern.length === 0) {
    throw new Error('pattern must not be empty');
  }

  const prefix = buildPrefixFunction(pattern);
  const result = [];
  let q = 0;

  for (let i = 0; i < text.length; i++) {
    while (q > 0 && pattern.charCodeAt(q) !== text.charCodeAt(i)) {
      q = prefix[q - 1];
    }
    if (pattern.charCodeAt(q) === text.charCodeAt(i)) {
      q++;
    }
    if (q === pattern.length) {
      result.push(i - pattern.length + 1);
      // Fall back to the prefix function so overlapping matches are reported.
      q = prefix[q - 1];
    }
  }

  return result;
}
