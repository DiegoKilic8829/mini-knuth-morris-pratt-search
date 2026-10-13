# mini-knuth-morris-pratt-search

Substring search using the Knuth-Morris-Pratt prefix function to skip forward on mismatches rather than restarting the scan at the previous character.

## Usage

```js
import { kmpSearch, kmpSearchAll } from 'mini-knuth-morris-pratt-search';

kmpSearch('the quick brown fox', 'brown'); // 10
kmpSearchAll('aaaa', 'aa');                 // [0, 1, 2]
```

## Why

The naive O(n·m) substring scan is fine for most inputs but degrades badly on pathological text — long runs of near-matches that force repeated backtracking. KMP precomputes a prefix (failure) function over the pattern in O(m) and scans the text in O(n) with no backtracking, so cost depends only on input length, not on how often partial matches occur.

The trade-off: the prefix function and per-character loop add constant overhead, so for short patterns and benign text the naive approach is faster in wall-clock terms. Use this when you want guaranteed linear behaviour regardless of input shape.

## Edge cases

- `kmpSearch` and `kmpSearchAll` throw on an empty pattern. There is no sensible single index for "match everything"; the caller must decide what emptiness means.
- `kmpSearchAll` reports overlapping matches. Pattern `"aa"` in text `"aaa"` yields `[0, 1]`, not `[0]`. This follows from the algorithm falling back to the prefix function after a full match.
- Indices count UTF-16 code units, not Unicode code points. This matches the built-in `String.prototype.indexOf`. Text outside the Basic Multilingual Plane will report code-unit offsets.

## Exports

- `kmpSearch(text, pattern)` → `number` — first match index, or `-1`.
- `kmpSearchAll(text, pattern)` → `number[]` — all match indices in ascending order.
- `buildPrefixFunction(pattern)` → `number[]` — exposed for inspection/testing.
