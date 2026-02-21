import { describe, it, expect, beforeEach } from 'vitest';
import { calcTotal } from '../logic.js';
import { setupDOM, markDone, ITEMS } from './fixtures.js';

// calcTotal() walks the DOM for .item.done elements and sums their data-pct
// attributes, capping the result at 100.

describe('calcTotal', () => {
  beforeEach(() => {
    setupDOM();
  });

  it('returns 0 when no items are marked done', () => {
    expect(calcTotal()).toBe(0);
  });

  it('returns the pct of a single done item (cat1 = 35)', () => {
    markDone('cat1');
    expect(calcTotal()).toBe(35);
  });

  it('returns the pct of a single done item (cat2 = 20)', () => {
    markDone('cat2');
    expect(calcTotal()).toBe(20);
  });

  it('sums pct values for multiple done items', () => {
    markDone('cat1', 'cat2'); // 35 + 20 = 55
    expect(calcTotal()).toBe(55);
  });

  it('sums all items and stays at 100 when every item is done', () => {
    const allIds = ITEMS.map(i => i.id);
    markDone(...allIds); // sum = 100
    expect(calcTotal()).toBe(100);
  });

  it('caps the result at 100 even if DOM pct values would exceed it', () => {
    // Artificially increase one item's pct to force an overflow.
    const el = document.querySelector('[data-id="cat1"]');
    el.dataset.pct = '999';
    el.classList.add('done');
    expect(calcTotal()).toBe(100);
  });

  it('ignores .item elements that have no "done" class', () => {
    // vacuum starts with class "ongoing" — it should not be counted.
    expect(calcTotal()).toBe(0);
  });

  it('counts the vacuum item once it is marked done', () => {
    markDone('vacuum'); // 3
    expect(calcTotal()).toBe(3);
  });
});
