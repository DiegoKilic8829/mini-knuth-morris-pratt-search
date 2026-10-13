import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { kmpSearch, kmpSearchAll, buildPrefixFunction } from '../src/core.js';

describe('buildPrefixFunction', () => {
  it('builds the prefix array for a simple pattern', () => {
    assert.deepEqual(buildPrefixFunction('ababaca'), [0, 0, 1, 2, 3, 0, 1]);
  });

  it('handles a pattern with no self-overlap', () => {
    assert.deepEqual(buildPrefixFunction('abcdef'), [0, 0, 0, 0, 0, 0]);
  });

  it('handles a single-character pattern', () => {
    assert.deepEqual(buildPrefixFunction('x'), [0]);
  });

  it('throws on empty pattern', () => {
    assert.throws(() => buildPrefixFunction(''), { message: 'pattern must not be empty' });
  });

  it('throws on non-string', () => {
    assert.throws(() => buildPrefixFunction(42), { name: 'TypeError' });
  });
});

describe('kmpSearch', () => {
  it('finds a pattern at the start', () => {
    assert.equal(kmpSearch('hello world', 'hello'), 0);
  });

  it('finds a pattern in the middle', () => {
    assert.equal(kmpSearch('the quick brown fox', 'brown'), 10);
  });

  it('finds a pattern at the end', () => {
    assert.equal(kmpSearch('abcdef', 'def'), 3);
  });

  it('returns -1 when not found', () => {
    assert.equal(kmpSearch('abcdef', 'xyz'), -1);
  });

  it('handles overlapping pattern correctly (first occurrence)', () => {
    assert.equal(kmpSearch('aaaa', 'aa'), 0);
  });

  it('throws on empty pattern', () => {
    assert.throws(() => kmpSearch('abc', ''), { message: 'pattern must not be empty' });
  });

  it('throws on non-string text', () => {
    assert.throws(() => kmpSearch(null, 'abc'), { name: 'TypeError' });
  });
});

describe('kmpSearchAll', () => {
  it('finds all non-overlapping occurrences', () => {
    assert.deepEqual(kmpSearchAll('ababab', 'ab'), [0, 2, 4]);
  });

  it('finds all overlapping occurrences', () => {
    assert.deepEqual(kmpSearchAll('aaaa', 'aa'), [0, 1, 2]);
  });

  it('returns an empty array when no match', () => {
    assert.deepEqual(kmpSearchAll('abcdef', 'zz'), []);
  });

  it('returns [0] for pattern equal to text', () => {
    assert.deepEqual(kmpSearchAll('exact', 'exact'), [0]);
  });

  it('throws on empty pattern', () => {
    assert.throws(() => kmpSearchAll('abc', ''), { message: 'pattern must not be empty' });
  });
});
