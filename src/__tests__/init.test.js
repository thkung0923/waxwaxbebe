import { describe, it, expect, beforeEach } from 'vitest';
import { init } from '../logic.js';
import { setupDOM } from './fixtures.js';

// init() restores persisted state into the DOM and then calls updateUI().
// The exported signature accepts an optional savedState argument so tests
// don't have to reach through localStorage.

describe('init', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
  });

  describe('with an empty saved state', () => {
    it('marks no items as done', () => {
      init({});
      const done = document.querySelectorAll('.item.done');
      expect(done.length).toBe(0);
    });

    it('shows 0% in the ring', () => {
      init({});
      expect(document.getElementById('ringPct').textContent).toBe('0%');
    });

    it('keeps the vacuum item in the "ongoing" class', () => {
      init({});
      const vacuum = document.querySelector('[data-id="vacuum"]');
      expect(vacuum.classList.contains('ongoing')).toBe(true);
    });
  });

  describe('with a partial saved state', () => {
    it('marks only the saved-done items as done', () => {
      init({ cat1: true, cat2: true });
      expect(document.querySelector('[data-id="cat1"]').classList.contains('done')).toBe(true);
      expect(document.querySelector('[data-id="cat2"]').classList.contains('done')).toBe(true);
      expect(document.querySelector('[data-id="laundry"]').classList.contains('done')).toBe(false);
    });

    it('sets checkboxes to ✓ for done items', () => {
      init({ cat1: true });
      expect(document.getElementById('chk-cat1').innerHTML).toBe('✓');
    });

    it('leaves checkboxes empty for items not in saved state', () => {
      init({ cat1: true });
      expect(document.getElementById('chk-cat2').textContent).toBe('');
    });

    it('removes "ongoing" class from vacuum if it was saved as done', () => {
      init({ vacuum: true });
      const vacuum = document.querySelector('[data-id="vacuum"]');
      expect(vacuum.classList.contains('done')).toBe(true);
      expect(vacuum.classList.contains('ongoing')).toBe(false);
    });

    it('updates the percentage display to match restored items', () => {
      init({ cat1: true, cat2: true }); // 35 + 20 = 55
      expect(document.getElementById('ringPct').textContent).toBe('55%');
    });
  });

  describe('with a full saved state (all items done)', () => {
    it('shows the completion message instead of status text', () => {
      init({
        cat1: true, cat2: true, laundry: true, petbed: true,
        vacuum: true, spray1: true, spray2: true, others: true, vet: true,
      });
      expect(document.getElementById('completeMsg').style.display).toBe('block');
      expect(document.getElementById('statusText').style.display).toBe('none');
    });
  });

  describe('localStorage fallback (no savedState argument)', () => {
    it('reads from localStorage when no savedState is provided', () => {
      localStorage.setItem('flea_v2', JSON.stringify({ cat1: true }));
      init(); // no argument → reads localStorage
      expect(document.querySelector('[data-id="cat1"]').classList.contains('done')).toBe(true);
    });

    it('handles corrupt localStorage JSON without throwing', () => {
      localStorage.setItem('flea_v2', 'not-valid-json');
      expect(() => init()).not.toThrow();
      // All items should remain in their default (not-done) state.
      const done = document.querySelectorAll('.item.done');
      expect(done.length).toBe(0);
    });

    it('handles missing localStorage entry gracefully', () => {
      // Nothing in localStorage.
      expect(() => init()).not.toThrow();
      expect(document.querySelectorAll('.item.done').length).toBe(0);
    });
  });
});
