import { describe, it, expect, beforeEach, vi } from 'vitest';
import { toggle, state } from '../logic.js';
import { setupDOM } from './fixtures.js';

// toggle(el) flips an item between done/not-done, handles the special
// "vacuum" ongoing state, persists to localStorage, and calls updateUI().

describe('toggle', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
  });

  // --- Marking an item as done ---

  it('adds "done" class when toggling an unchecked item', () => {
    const el = document.querySelector('[data-id="cat1"]');
    toggle(el);
    expect(el.classList.contains('done')).toBe(true);
  });

  it('sets the checkbox to ✓ when marking done', () => {
    const el = document.querySelector('[data-id="cat1"]');
    toggle(el);
    expect(document.getElementById('chk-cat1').innerHTML).toBe('✓');
  });

  it('removes "ongoing" class when marking an item done', () => {
    const el = document.querySelector('[data-id="vacuum"]');
    expect(el.classList.contains('ongoing')).toBe(true);
    toggle(el);
    expect(el.classList.contains('ongoing')).toBe(false);
  });

  // --- Un-marking a done item ---

  it('removes "done" class when toggling a done item', () => {
    const el = document.querySelector('[data-id="cat1"]');
    el.classList.add('done');
    toggle(el);
    expect(el.classList.contains('done')).toBe(false);
  });

  it('clears the checkbox text when un-marking an item', () => {
    const el = document.querySelector('[data-id="cat1"]');
    el.classList.add('done');
    document.getElementById('chk-cat1').innerHTML = '✓';
    toggle(el);
    expect(document.getElementById('chk-cat1').textContent).toBe('');
  });

  // --- Special "vacuum" ongoing behaviour ---

  it('restores "ongoing" class on vacuum when un-marking it', () => {
    const el = document.querySelector('[data-id="vacuum"]');
    // First mark it done, then toggle off.
    toggle(el); // → done
    toggle(el); // → back to ongoing
    expect(el.classList.contains('ongoing')).toBe(true);
    expect(el.classList.contains('done')).toBe(false);
  });

  it('does NOT restore "ongoing" on non-vacuum items when un-marking', () => {
    const el = document.querySelector('[data-id="cat1"]');
    toggle(el); // → done
    toggle(el); // → not done
    expect(el.classList.contains('ongoing')).toBe(false);
  });

  // --- localStorage persistence ---

  it('saves state to localStorage after toggling an item on', () => {
    const el = document.querySelector('[data-id="cat1"]');
    toggle(el);
    const saved = JSON.parse(localStorage.getItem('flea_v2'));
    expect(saved.cat1).toBe(true);
  });

  it('saves state to localStorage after toggling an item off', () => {
    const el = document.querySelector('[data-id="cat1"]');
    toggle(el); // on
    toggle(el); // off
    const saved = JSON.parse(localStorage.getItem('flea_v2'));
    expect(saved.cat1).toBe(false);
  });

  it('accumulates multiple item states in localStorage', () => {
    toggle(document.querySelector('[data-id="cat1"]'));
    toggle(document.querySelector('[data-id="cat2"]'));
    const saved = JSON.parse(localStorage.getItem('flea_v2'));
    expect(saved.cat1).toBe(true);
    expect(saved.cat2).toBe(true);
  });

  // --- updateUI is called ---

  it('updates the percentage display after toggling', () => {
    const el = document.querySelector('[data-id="cat1"]'); // pct=35
    toggle(el);
    expect(document.getElementById('ringPct').textContent).toBe('35%');
  });
});
