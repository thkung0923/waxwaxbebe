// Logic extracted from index.html for testing purposes.
// The functions here mirror what is embedded in the <script> tag of index.html.

export const CIRC = 2 * Math.PI * 35;

export const STATUS = [
  { max: 0,   text: "還沒開始，但你能做到的 💪" },
  { max: 20,  text: "已經開始了，做得好 👍" },
  { max: 40,  text: "貓咪有保護了，安心一點 🐱" },
  { max: 60,  text: "過半了，環境在慢慢變乾淨 ✨" },
  { max: 80,  text: "做很多了，焦慮可以少一半了 😌" },
  { max: 99,  text: "快完成了，剩下交給時間 🌿" },
  { max: 100, text: "全部都做到了！" },
];

// Module-level state, matching the original script's top-level `let state`.
export let state = {};

export function getStatus(pct) {
  for (let s of STATUS) {
    if (pct <= s.max) return s.text;
  }
  return STATUS[STATUS.length - 1].text;
}

export function calcTotal() {
  let t = 0;
  document.querySelectorAll('.item').forEach(el => {
    if (el.classList.contains('done')) t += parseInt(el.dataset.pct);
  });
  return Math.min(t, 100);
}

export function updateUI() {
  const pct = calcTotal();
  document.getElementById('pctNum').innerHTML = pct + '<sup>%</sup>';
  document.getElementById('ringPct').textContent = pct + '%';
  document.getElementById('barFill').style.width = pct + '%';

  const offset = CIRC - (pct / 100) * CIRC;
  const ring = document.getElementById('ringFill');
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = offset;

  const statusEl = document.getElementById('statusText');
  const completeEl = document.getElementById('completeMsg');
  if (pct >= 100) {
    statusEl.style.display = 'none';
    completeEl.style.display = 'block';
  } else {
    statusEl.style.display = 'block';
    completeEl.style.display = 'none';
    statusEl.textContent = getStatus(pct);
  }
}

export function toggle(el) {
  const id = el.dataset.id;
  const chk = document.getElementById('chk-' + id);
  if (el.classList.contains('done')) {
    el.classList.remove('done');
    chk.textContent = '';
    if (id === 'vacuum') el.classList.add('ongoing');
  } else {
    el.classList.remove('ongoing');
    el.classList.add('done');
    chk.innerHTML = '✓';
  }
  state[id] = el.classList.contains('done');
  try { localStorage.setItem('flea_v2', JSON.stringify(state)); } catch (e) {}
  updateUI();
}

export function init(savedState) {
  // Accept savedState for testability; falls back to localStorage.
  if (savedState !== undefined) {
    state = savedState;
  } else {
    try { state = JSON.parse(localStorage.getItem('flea_v2') || '{}'); } catch (e) { state = {}; }
  }
  document.querySelectorAll('.item').forEach(el => {
    if (state[el.dataset.id]) {
      el.classList.remove('ongoing');
      el.classList.add('done');
      document.getElementById('chk-' + el.dataset.id).innerHTML = '✓';
    }
  });
  updateUI();
}
