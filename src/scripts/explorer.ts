/**
 * Education explorer: the course list drives one detail panel. Hovering a row
 * with a mouse, clicking it or moving through the list with the arrow keys
 * makes it active and swaps in its panel, whose body fades in. The address
 * keeps the active course (#id), so a home-page card opens the page on it.
 *
 * Without JavaScript every panel shows, one after another, and the rows are
 * plain links to them; with it the list becomes a set of vertical tabs.
 */

interface Entry {
  tab: HTMLAnchorElement;
  panel: HTMLElement;
  body: HTMLElement | null;
}

export function mountExplorer(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-explorer-list]');
  // The data map: course id → its row and its panel.
  const entries = new Map<string, Entry>();
  root.querySelectorAll<HTMLAnchorElement>('[data-explorer-tab]').forEach((tab) => {
    const panel = document.getElementById(tab.dataset.explorerTab ?? '');
    if (panel) entries.set(panel.id, { tab, panel, body: panel.querySelector('[data-explorer-body]') });
  });
  if (!list || !entries.size) return;
  const ids = [...entries.keys()];
  let current = '';

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  entries.forEach(({ tab, panel }) => {
    tab.parentElement?.setAttribute('role', 'presentation');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  });
  root.setAttribute('data-enhanced', '');

  function select(id: string) {
    const next = entries.get(id);
    if (!next || id === current) return;
    const first = !current;
    current = id;
    entries.forEach(({ tab, panel }, key) => {
      tab.setAttribute('aria-selected', String(key === id));
      tab.tabIndex = key === id ? 0 : -1;
      panel.hidden = key !== id;
    });
    // Restart the body's fade-in (the transition lives in CSS).
    if (next.body && !first) {
      next.body.setAttribute('data-entering', '');
      void next.body.offsetWidth;
      next.body.removeAttribute('data-entering');
    }
  }

  /** Clicked or chosen from the keyboard: remember it in the address. */
  function choose(id: string) {
    select(id);
    history.replaceState(null, '', `#${id}`);
  }

  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    return entries.has(id) ? id : undefined;
  };

  entries.forEach(({ tab, panel }, id) => {
    tab.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') select(id);
    });
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      choose(id);
      // Stacked layout: the panel sits under the list, so scroll just enough to show it.
      const box = panel.getBoundingClientRect();
      if (box.top > list.getBoundingClientRect().bottom - 1 && box.bottom > window.innerHeight) {
        panel.scrollIntoView({ block: 'nearest' });
      }
    });
  });

  list.addEventListener('keydown', (event) => {
    const index = ids.indexOf(current);
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: ids.length - 1,
    };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const id = ids[(to + ids.length) % ids.length];
    choose(id);
    entries.get(id)?.tab.focus();
  });

  window.addEventListener('hashchange', () => {
    const id = fromHash();
    if (id) select(id);
  });

  const linked = fromHash();
  select(linked ?? ids[0]);
  // Opened on one course: land on its panel now that the others are hidden.
  if (linked) entries.get(linked)?.panel.scrollIntoView({ block: 'start', behavior: 'instant' });
}
