import { describe, it, expect } from 'vitest';
import { getStatus } from '../logic.js';

// getStatus is a pure function with no side-effects: it maps a percentage
// to a localised status string by walking the STATUS threshold array.
// These tests document each boundary and the ranges between them.

describe('getStatus', () => {
  describe('exact threshold boundaries', () => {
    it('returns "not started" at exactly 0%', () => {
      expect(getStatus(0)).toBe("還沒開始，但你能做到的 💪");
    });

    it('returns "started" at exactly 20%', () => {
      expect(getStatus(20)).toBe("已經開始了，做得好 👍");
    });

    it('returns "cat protected" at exactly 40%', () => {
      expect(getStatus(40)).toBe("貓咪有保護了，安心一點 🐱");
    });

    it('returns "over half" at exactly 60%', () => {
      expect(getStatus(60)).toBe("過半了，環境在慢慢變乾淨 ✨");
    });

    it('returns "done a lot" at exactly 80%', () => {
      expect(getStatus(80)).toBe("做很多了，焦慮可以少一半了 😌");
    });

    it('returns "almost done" at exactly 99%', () => {
      expect(getStatus(99)).toBe("快完成了，剩下交給時間 🌿");
    });

    it('returns "all done" at exactly 100%', () => {
      expect(getStatus(100)).toBe("全部都做到了！");
    });
  });

  describe('mid-range values between thresholds', () => {
    it('returns "started" at 10% (between 0 and 20)', () => {
      expect(getStatus(10)).toBe("已經開始了，做得好 👍");
    });

    it('returns "cat protected" at 30% (between 20 and 40)', () => {
      expect(getStatus(30)).toBe("貓咪有保護了，安心一點 🐱");
    });

    it('returns "over half" at 50% (between 40 and 60)', () => {
      expect(getStatus(50)).toBe("過半了，環境在慢慢變乾淨 ✨");
    });

    it('returns "done a lot" at 70% (between 60 and 80)', () => {
      expect(getStatus(70)).toBe("做很多了，焦慮可以少一半了 😌");
    });

    it('returns "almost done" at 90% (between 80 and 99)', () => {
      expect(getStatus(90)).toBe("快完成了，剩下交給時間 🌿");
    });
  });

  describe('values just above each threshold (next bucket)', () => {
    it('returns "started" at 1% (just above 0)', () => {
      expect(getStatus(1)).toBe("已經開始了，做得好 👍");
    });

    it('returns "cat protected" at 21% (just above 20)', () => {
      expect(getStatus(21)).toBe("貓咪有保護了，安心一點 🐱");
    });

    it('returns "over half" at 41% (just above 40)', () => {
      expect(getStatus(41)).toBe("過半了，環境在慢慢變乾淨 ✨");
    });

    it('returns "done a lot" at 61% (just above 60)', () => {
      expect(getStatus(61)).toBe("做很多了，焦慮可以少一半了 😌");
    });

    it('returns "almost done" at 81% (just above 80)', () => {
      expect(getStatus(81)).toBe("快完成了，剩下交給時間 🌿");
    });
  });

  describe('out-of-range values', () => {
    // calcTotal() caps at 100, so getStatus is never called with >100 in
    // normal use.  The implementation falls through to the last entry, so
    // the behaviour is well-defined and worth pinning.
    it('returns the last message for values over 100', () => {
      expect(getStatus(101)).toBe("全部都做到了！");
      expect(getStatus(200)).toBe("全部都做到了！");
    });

    // Negative values: calcTotal never produces them, but getStatus should
    // still return the first message (0% bucket catches pct <= 0).
    it('returns "not started" for negative values', () => {
      expect(getStatus(-1)).toBe("還沒開始，但你能做到的 💪");
    });
  });
});
