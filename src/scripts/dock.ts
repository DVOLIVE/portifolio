/**
 * Scroll dock (home page). Over the hero's scroll — from the top of the page
 * until Band 2 reaches the header — the hero name zooms out into the header
 * wordmark and the hero's CV button glides into the header's contact button,
 * where its label changes to "Get in Touch". The rest of the hero fades out
 * before anything moving could cross it, and the ribbons trail behind with a
 * light parallax. The header stays transparent until the dock ends.
 *
 * Roles: [data-dock-scene] is the hero, and the dock ends when its bottom
 * reaches the header. [data-dock-flyer="x"] lands on [data-dock-target="x"] in
 * the header; [data-dock-fade] fades out; [data-dock-parallax] trails the scroll.
 *
 * Every move eases in and out — position, speed and acceleration all blend, so
 * nothing jolts — and leaves no faster than the page scrolls. The name zooms at
 * an even rate in perceived size; its second line slides out from under the
 * first, then rises beside it. At the end the header's own elements fade in
 * over the landed copies, so the hand-over has no seam.
 *
 * Positions are measured from the live layout and rebuilt on resize; timing
 * comes from the --dock-* tokens (semantic.css §9). The animations run on a
 * ScrollTimeline where supported — on the compositor, in step with scrolling —
 * and follow scroll events otherwise. With reduced motion nothing moves; the
 * header elements fade in at the end.
 */

type Range = [number, number];

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where a flyer is, as a viewport box, at dock progress u (0–1). */
type Path = (u: number) => Box;

/** Zoom progress over which the second name line slides out from under the
 *  first; it then rises beside it, arriving at RISE_END. */
const SLIDE: Range = [0.2, 0.62];
const RISE_END = 0.96;
/** Gap the second line keeps from the first before it rises, in em of the hero name. */
const LINE_GAP = 0.06;
/** Gentlest start for the name, as a multiple of its average zoom speed (0–2). */
const PUSH = 0.5;
/** Share of the dock over which the CV button's label changes: the old label
 *  fades out as the button settles, then the header button fades in over it. */
const SWAP = 0.08;
/** Keyframes sampled per curve; the browser interpolates between them. */
const SAMPLES = 64;
/** Steps used to find where hero copy would first meet something moving. */
const PROBES = 200;
/** Fallback timeline length in ms; progress is normalised, so any value works. */
const DURATION = 1000;

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smootherstep: speed and acceleration are zero at both ends. */
const smoother = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (x * (6 * x - 15) + 10);
};
/** Eased progress through `range` at t. */
const phase = (t: number, [from, to]: Range) => smoother((t - from) / (to - from));
const fontSize = (el: Element) => parseFloat(getComputedStyle(el).fontSize);

/**
 * Progress of a trip that leaves at `push` times its average speed (0–2) and
 * comes to rest with no jolt: smootherstep plus a quintic kick that is zero,
 * flat and without curvature at both ends.
 */
function glide(t: number, push: number) {
  const x = clamp01(t);
  return smoother(x) + push * x * (1 - x) ** 3 * (1 + 3 * x);
}

/** The point in `range` where `phase` reaches `share`. */
function phaseAt(share: number, range: Range) {
  let [low, high] = range;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (phase(mid, range) < share) low = mid;
    else high = mid;
  }
  return high;
}

/** Evenly spaced offsets across [from, to], plus any extra ones, in order. */
const offsetsIn = (from: number, to: number, extra: number[] = []) =>
  [...new Set([...Array.from({ length: SAMPLES + 1 }, (_, i) => lerp(from, to, i / SAMPLES)), ...extra])].sort(
    (a, b) => a - b,
  );

/** Viewport box, or page box when the current scroll offset is passed. */
function box(el: Element, scrollY = 0): Box {
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.top + scrollY, width: rect.width, height: rect.height };
}

const overlaps = (a: Box, b: Box, gap: number) =>
  a.x - gap < b.x + b.width && b.x < a.x + a.width + gap && a.y - gap < b.y + b.height && b.y < a.y + a.height + gap;

/** Hidden until `from`, then visible. */
const showFrom = (from: number): Keyframe[] => [
  { offset: 0, visibility: 'hidden' },
  { offset: from, visibility: 'hidden' },
  { offset: 1, visibility: 'visible' },
];

/** Transparent until `from`, opaque from `to` on. */
const fadeIn = ([from, to]: Range): Keyframe[] => [
  { offset: 0, opacity: 0 },
  { offset: from, opacity: 0 },
  { offset: to, opacity: 1 },
  { offset: 1, opacity: 1 },
];

/** Opaque until `from`, transparent from `to` on. */
const fadeOut = ([from, to]: Range): Keyframe[] => [
  { offset: 0, opacity: 1 },
  { offset: from, opacity: 1 },
  { offset: to, opacity: 0 },
  { offset: 1, opacity: 0 },
];

export function mountDock(): () => void {
  const root = document.documentElement;
  const scene = document.querySelector<HTMLElement>('[data-dock-scene]');
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');
  const link = document.querySelector<HTMLElement>('[data-dock-link]');
  const fades = [...document.querySelectorAll<HTMLElement>('[data-dock-fade]')];
  const trails = [...document.querySelectorAll<HTMLElement>('[data-dock-parallax]')];
  const pairs = [...document.querySelectorAll<HTMLElement>('[data-dock-flyer]')].flatMap((flyer) => {
    const target = document.querySelector<HTMLElement>(`[data-dock-target="${flyer.dataset.dockFlyer}"]`);
    return target ? [{ flyer, target }] : [];
  });
  const lines = pairs.filter(({ flyer }) => flyer.dataset.dockFlyer?.startsWith('name-'));
  const buttons = pairs.filter((pair) => !lines.includes(pair));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timeline =
    'ScrollTimeline' in window && 'rangeStart' in Animation.prototype
      ? new ScrollTimeline({ source: root, axis: 'block' })
      : null;

  let animations: Animation[] = [];
  let distance = 0;
  let rebuild = 0;
  let frame = 0;

  function animate(el: Element, keyframes: Keyframe[]) {
    const animation = timeline
      ? el.animate(keyframes, { timeline, rangeStart: '0px', rangeEnd: `${distance}px`, fill: 'both' })
      : el.animate(keyframes, { duration: DURATION, fill: 'both' });
    if (!timeline) animation.pause();
    animations.push(animation);
  }

  /** Moves a hero element along `path`, from its box `start`, and hides it at
   *  the end, when the header's own element has taken over. */
  function fly(el: Element, start: Box, path: Path, offsets: number[]) {
    animate(
      el,
      offsets.map((u) => {
        const at = path(u);
        // By progress u the page has scrolled u × distance and carried the element up with it.
        return {
          offset: u,
          transform: `translate(${at.x - start.x}px, ${at.y - start.y + u * distance}px) scale(${at.width / start.width}, ${at.height / start.height})`,
        };
      }),
    );
    animate(el, [
      { offset: 0, visibility: 'visible' },
      { offset: 1, visibility: 'hidden' },
    ]);
  }

  function build() {
    rebuild = 0;
    animations.forEach((animation) => animation.cancel());
    animations = [];

    const tokens = getComputedStyle(root);
    const token = (name: string) => parseFloat(tokens.getPropertyValue(name));
    const land = token('--dock-button-land');
    const handover = token('--dock-handover');
    const lag = token('--dock-parallax');
    const [first, ...rest] = lines;
    if (!scene || !header || !first || !(SWAP < land && land + SWAP <= handover && handover < 1)) return finish(false);

    // Hero boxes in page coordinates (where they sit at scroll 0), header boxes
    // in viewport coordinates (the header is sticky at the top).
    const scrollY = window.scrollY;
    const bar = box(header);
    const headerBottom = bar.y + bar.height;
    const stage = box(scene, scrollY);
    distance = stage.y + stage.height - headerBottom;
    const start = box(first.flyer, scrollY);
    const end = box(first.target);
    const scale = fontSize(first.target) / fontSize(first.flyer);
    if (!(distance > 0 && start.y > end.y && scale < 1)) return finish(false);

    const motion = !reducedMotion.matches;
    const gap = bar.height / 4;
    const paths: Path[] = [];
    // A button with no header slot at this width fades with the copy.
    const fading = [...fades, ...buttons.filter(({ target }) => !box(target).width).map(({ flyer }) => flyer)];

    if (link) animate(link, showFrom(handover));
    lines.forEach(({ target }) => animate(target, fadeIn([handover, 1])));

    // Hero copy fades as it nears the header, unless something moving reaches it first.
    const fadeSpan = (token('--dock-fade-span') * window.innerHeight) / distance;
    const copy = fading.map((el) => {
      const from = box(el, scrollY);
      const at = (u: number): Box => ({ ...from, y: from.y - u * distance });
      return { el, at, end: Math.min(1, (from.y - headerBottom - gap) / distance) };
    });
    /** First progress at which `path` meets the copy (pairs that start side by side don't count). */
    const meets = (at: (u: number) => Box, path: Path, until: number) => {
      if (overlaps(at(0), path(0), gap)) return until;
      for (let i = 1; i <= PROBES && i / PROBES < until; i++) {
        if (overlaps(at(i / PROBES), path(i / PROBES), gap)) return i / PROBES;
      }
      return until;
    };

    if (motion) {
      // The name zooms out towards the point that maps it onto the wordmark, at
      // an even rate in perceived size (log scale), and its second line slides
      // out from under the first, then rises beside it.
      const focus = { x: (end.x - scale * start.x) / (1 - scale), y: (end.y - scale * start.y) / (1 - scale) };
      const ln = Math.log(scale);
      const namePaths = (push: number): Path[] => {
        const zoom = (u: number) => {
          const q = glide(u, push);
          const k = Math.exp(ln * q);
          return { q, k, x: focus.x + (start.x - focus.x) * k, y: focus.y + (start.y - focus.y) * k };
        };
        const firstPath: Path = (u) => {
          const { k, x, y } = zoom(u);
          return { x, y, width: start.width * k, height: start.height * k };
        };
        return [
          firstPath,
          ...rest.map(({ flyer, target }): Path => {
            const from = box(flyer, scrollY);
            const to = box(target);
            // Offset from the first line at hero size: below it at the start, beside it at the end.
            const below = { x: from.x - start.x, y: from.y - start.y };
            const beside = { x: (to.x - end.x) / scale, y: (to.y - end.y) / scale };
            // It rises only once it has slid clear of the first line.
            const clear = (start.width + LINE_GAP * fontSize(first.flyer) - below.x) / (beside.x - below.x);
            const rise: Range = [clear <= 0 ? SLIDE[0] : clear >= 1 ? SLIDE[1] : phaseAt(clear, SLIDE), RISE_END];
            return (u) => {
              const { q, k, x, y } = zoom(u);
              const dx = lerp(below.x, beside.x, phase(q, SLIDE));
              const dy = lerp(below.y, beside.y, phase(q, rise));
              return { x: x + dx * k, y: y + dy * k, width: from.width * k, height: from.height * k };
            };
          }),
        ];
      };
      // A slow start spreads the zoom over the whole dock, so the name trails
      // the page; but the copy below must not run into it before it would have
      // faded near the header anyway. Take the gentlest start that allows that,
      // or else leave at page speed, which keeps the copy longest.
      const pageSpeed = Math.min(2, distance / ((start.y - focus.y) * -ln));
      const pushes = Array.from({ length: 9 }, (_, i) => lerp(Math.min(PUSH, pageSpeed), pageSpeed, i / 8));
      const push =
        pushes.find((p) => {
          const candidate = namePaths(p);
          return copy.every(({ at, end }) => candidate.every((path) => meets(at, path, end) >= end));
        }) ?? pageSpeed;
      namePaths(push).forEach((path, i) => {
        fly(lines[i].flyer, box(lines[i].flyer, scrollY), path, offsetsIn(0, 1));
        paths.push(path);
      });
    }

    buttons.forEach(({ flyer, target }) => {
      const to = box(target);
      if (!to.width) return;
      animate(target, showFrom(land));
      animate(target, fadeIn([land, land + SWAP]));
      if (!motion) return;

      const from = box(flyer, scrollY);
      const push = Math.min(2, (land * distance) / Math.max(from.y - to.y, 1));
      // Sized to the header button by the time it lands, so the swap has no seam.
      const path: Path = (u) => {
        const p = glide(u / land, push);
        return {
          x: lerp(from.x, to.x, p),
          y: lerp(from.y, to.y, p),
          width: lerp(from.width, to.width, p),
          height: lerp(from.height, to.height, p),
        };
      };
      fly(flyer, from, path, offsetsIn(0, land, [1]));
      paths.push(path);
      // The old label fades out as the button settles.
      flyer.querySelectorAll(':scope > * > *').forEach((el) => animate(el, fadeOut([land - SWAP, land])));
    });

    if (motion) {
      copy.forEach(({ el, at, end: near }) => {
        const end = Math.max(Math.min(near, ...paths.map((path) => meets(at, path, near))), 1 / PROBES);
        const fade: Range = [Math.max(0, end - fadeSpan), end];
        animate(
          el,
          offsetsIn(fade[0], fade[1], [0, 1]).map((u) => {
            const f = phase(u, fade);
            // It sinks a little as it fades, so it seems to fall behind.
            return { offset: u, opacity: 1 - f, transform: `translateY(${f * gap}px)` };
          }),
        );
      });
      trails.forEach((el) =>
        animate(el, [{ transform: 'translateY(0)' }, { transform: `translateY(${lag * distance}px)` }]),
      );
    }

    finish(true, motion);
  }

  function finish(active: boolean, motion = false) {
    root.toggleAttribute('data-dock', active);
    // Keep the header transparent while hero elements travel underneath it.
    if (sentinel) sentinel.style.height = active && motion ? `${distance}px` : '';
    sync();
  }

  /** Without ScrollTimeline: move the paused animations to the scroll position. */
  function sync() {
    frame = 0;
    if (timeline || !distance) return;
    const time = clamp01(window.scrollY / distance) * DURATION;
    animations.forEach((animation) => (animation.currentTime = time));
  }

  const schedule = () => {
    if (!rebuild) rebuild = requestAnimationFrame(build);
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(sync);
  };
  const resizeObserver = new ResizeObserver(schedule);
  if (scene) resizeObserver.observe(scene);
  pairs.forEach(({ flyer, target }) => {
    resizeObserver.observe(flyer);
    resizeObserver.observe(target);
  });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  document.fonts.ready.then(schedule);
  if (!timeline) window.addEventListener('scroll', onScroll, { passive: true });
  build();

  return () => {
    cancelAnimationFrame(rebuild);
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    window.removeEventListener('resize', schedule);
    window.removeEventListener('scroll', onScroll);
    reducedMotion.removeEventListener('change', schedule);
    animations.forEach((animation) => animation.cancel());
    if (sentinel) sentinel.style.height = '';
    root.removeAttribute('data-dock');
  };
}
