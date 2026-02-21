// Minimal DOM fixture mirroring the structure of index.html.
// Call setupDOM() in beforeEach to get a clean slate for each test.

export const ITEMS = [
  { id: 'cat1',    pct: 35, classes: '' },
  { id: 'cat2',    pct: 20, classes: '' },
  { id: 'laundry', pct: 10, classes: '' },
  { id: 'petbed',  pct: 2,  classes: '' },
  { id: 'vacuum',  pct: 3,  classes: 'ongoing' },
  { id: 'spray1',  pct: 10, classes: '' },
  { id: 'spray2',  pct: 10, classes: '' },
  { id: 'others',  pct: 5,  classes: '' },
  { id: 'vet',     pct: 5,  classes: '' },
];

// Total of all pct values = 100 (35+20+10+2+3+10+10+5+5)

export function setupDOM() {
  document.body.innerHTML = `
    <div id="pctNum">0<sup>%</sup></div>
    <div id="ringPct">0%</div>
    <div id="barFill" style="width:0%"></div>
    <circle id="ringFill" style=""></circle>
    <div id="statusText" style="display:block">placeholder</div>
    <div id="completeMsg" style="display:none"></div>

    ${ITEMS.map(({ id, pct, classes }) => `
      <div class="item ${classes}" data-pct="${pct}" data-id="${id}">
        <div class="checkbox" id="chk-${id}"></div>
      </div>
    `).join('\n')}
  `;
}

// Mark specific items as done directly in the DOM (bypasses toggle logic).
export function markDone(...ids) {
  ids.forEach(id => {
    const el = document.querySelector(`[data-id="${id}"]`);
    el.classList.remove('ongoing');
    el.classList.add('done');
    document.getElementById('chk-' + id).innerHTML = '✓';
  });
}
