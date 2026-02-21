import { describe, it, expect, beforeEach } from 'vitest';
import { updateUI, CIRC } from '../logic.js';
import { setupDOM, markDone } from './fixtures.js';

// updateUI() reads the current DOM state via calcTotal(), then writes
// percentage values, ring geometry, progress bar width, and shows/hides
// the completion message.

describe('updateUI', () => {
  beforeEach(() => {
    setupDOM();
  });

  describe('progress text elements', () => {
    it('shows 0% when no items are done', () => {
      updateUI();
      expect(document.getElementById('pctNum').innerHTML).toBe('0<sup>%</sup>');
      expect(document.getElementById('ringPct').textContent).toBe('0%');
    });

    it('shows 35% when only cat1 (pct=35) is done', () => {
      markDone('cat1');
      updateUI();
      expect(document.getElementById('pctNum').innerHTML).toBe('35<sup>%</sup>');
      expect(document.getElementById('ringPct').textContent).toBe('35%');
    });

    it('shows 100% when all items are done', () => {
      markDone('cat1', 'cat2', 'laundry', 'petbed', 'vacuum',
               'spray1', 'spray2', 'others', 'vet');
      updateUI();
      expect(document.getElementById('ringPct').textContent).toBe('100%');
    });
  });

  describe('progress bar width', () => {
    it('sets bar width to 0% when nothing is done', () => {
      updateUI();
      expect(document.getElementById('barFill').style.width).toBe('0%');
    });

    it('sets bar width to match the calculated percentage', () => {
      markDone('cat1'); // 35
      updateUI();
      expect(document.getElementById('barFill').style.width).toBe('35%');
    });
  });

  describe('ring (SVG circle) stroke-dashoffset', () => {
    it('sets dashoffset to CIRC (full circle) at 0%', () => {
      updateUI();
      const ring = document.getElementById('ringFill');
      // At 0%, offset = CIRC - 0 = CIRC (empty ring)
      expect(parseFloat(ring.style.strokeDashoffset)).toBeCloseTo(CIRC);
    });

    it('sets dashoffset to 0 at 100%', () => {
      markDone('cat1', 'cat2', 'laundry', 'petbed', 'vacuum',
               'spray1', 'spray2', 'others', 'vet');
      updateUI();
      const ring = document.getElementById('ringFill');
      // At 100%, offset = CIRC - CIRC = 0 (full ring drawn)
      expect(parseFloat(ring.style.strokeDashoffset)).toBeCloseTo(0);
    });

    it('sets dashoffset to half of CIRC at 50%', () => {
      // 35 (cat1) + 20 (cat2) - 5 borrowed from petbed(2)+vacuum(3) = 55
      // Easier: just use cat1(35)+cat2(20) = 55, close enough.
      // Use laundry(10)+spray1(10)+spray2(10)+others(5)+vet(5) = 40 — nope.
      // For exactly 50% we need items summing to 50: cat1(35)+petbed(2)+vacuum(3)+others(5)+vet(5) = 50
      markDone('cat1', 'petbed', 'vacuum', 'others', 'vet');
      updateUI();
      const ring = document.getElementById('ringFill');
      expect(parseFloat(ring.style.strokeDashoffset)).toBeCloseTo(CIRC / 2);
    });
  });

  describe('status text vs completion message', () => {
    it('shows statusText and hides completeMsg when pct < 100', () => {
      updateUI(); // 0%
      expect(document.getElementById('statusText').style.display).toBe('block');
      expect(document.getElementById('completeMsg').style.display).toBe('none');
    });

    it('hides statusText and shows completeMsg when pct === 100', () => {
      markDone('cat1', 'cat2', 'laundry', 'petbed', 'vacuum',
               'spray1', 'spray2', 'others', 'vet');
      updateUI();
      expect(document.getElementById('statusText').style.display).toBe('none');
      expect(document.getElementById('completeMsg').style.display).toBe('block');
    });

    it('statusText content matches the getStatus bucket for the current pct', () => {
      markDone('cat1'); // 35% → "貓咪有保護了，安心一點 🐱" (21–40 bucket)
      updateUI();
      expect(document.getElementById('statusText').textContent)
        .toBe("貓咪有保護了，安心一點 🐱");
    });

    it('updates statusText as more items are checked', () => {
      markDone('cat1', 'cat2'); // 55% → "過半了，環境在慢慢變乾淨 ✨"
      updateUI();
      expect(document.getElementById('statusText').textContent)
        .toBe("過半了，環境在慢慢變乾淨 ✨");
    });
  });
});
