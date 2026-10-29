/**
 * Hero light ribbons — one full-screen WebGL fragment shader, no libraries.
 *
 * Colours, intensities and rendering limits are read from the CSS tokens in
 * src/styles/tokens/semantic.css (§11 "WebGL hero parameters"). The ribbon
 * paths and wave-shape constants below are the documented geometry
 * parameters (DESIGN_TOKENS.md → WebGL). Nothing here re-renders the page:
 * the canvas is driven by requestAnimationFrame alone.
 */

/** Vertical centre at mid-width (0 = bottom, 1 = top), rise across the width,
 *  two wave frequencies (cycles across the width), phase and relative speed. */
interface RibbonPath {
  base: number;
  tilt: number;
  freq: [number, number];
  phase: number;
  drift: number;
}

export const RIBBON_PATHS: [RibbonPath, RibbonPath, RibbonPath] = [
  { base: 0.66, tilt: 0.22, freq: [0.9, 1.7], phase: 0.0, drift: 1.0 }, // Electric Cyan
  { base: 0.6, tilt: 0.34, freq: [0.7, 2.1], phase: 2.1, drift: 0.8 }, // Performance Blue
  { base: 0.76, tilt: -0.16, freq: [1.1, 0.8], phase: 4.2, drift: 1.2 }, // Racing Red
];

/** Wave-shape constants shared by the three ribbons. */
export const RIBBON_SHAPE = {
  /** Weight of the first harmonic; the second gets 1 − this. */
  harmonicMix: 0.6,
  /** Speed of the second harmonic relative to the first (runs backwards). */
  counterDrift: 0.7,
  /** Phase offset of the second harmonic, as a multiple of the ribbon phase. */
  phaseSpread: 1.7,
  /** How much each ribbon's width breathes along its length (±). */
  breathing: 0.35,
  /** Breathing frequency relative to the first harmonic. */
  breathingRate: 0.5,
  /** Horizontal stretch of the elliptical light field around the focus. */
  focusStretch: 0.6,
  /** Cyan/blue balance of the crossing bloom (0 = cyan, 1 = blue). */
  bloomBlend: 0.5,
  /** How far crossing blooms lean towards Ice White (0 = ribbon colour). */
  bloomWhitening: 0.35,
  /** Time used for the single still frame (reduced motion, save-data). */
  stillTime: 3.2,
} as const;

const VERTEX = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define TAU 6.28318530718
#define HARMONIC_MIX ${RIBBON_SHAPE.harmonicMix.toFixed(4)}
#define COUNTER_DRIFT ${RIBBON_SHAPE.counterDrift.toFixed(4)}
#define PHASE_SPREAD ${RIBBON_SHAPE.phaseSpread.toFixed(4)}
#define BREATHING ${RIBBON_SHAPE.breathing.toFixed(4)}
#define BREATHING_RATE ${RIBBON_SHAPE.breathingRate.toFixed(4)}
#define BLOOM_BLEND ${RIBBON_SHAPE.bloomBlend.toFixed(4)}
#define FOCUS_STRETCH ${RIBBON_SHAPE.focusStretch.toFixed(4)}
#define BLOOM_WHITENING ${RIBBON_SHAPE.bloomWhitening.toFixed(4)}

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBackground;
uniform vec3 uHighlight;
uniform vec3 uColor[3];
uniform float uIntensity[3];
uniform vec4 uPath[3];   // base, tilt, freq1, freq2
uniform vec2 uMotion[3]; // phase, drift
uniform float uWidth;
uniform float uGlow;
uniform float uGlowStrength;
uniform float uBloom;
uniform float uAmplitude;
uniform vec2 uFocus;
uniform float uFalloff;
uniform float uGrain;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  vec3 light = vec3(0.0);
  float band0 = 0.0;
  float band1 = 0.0;
  float band2 = 0.0;

  for (int i = 0; i < 3; i++) {
    vec4 path = uPath[i];
    vec2 motion = uMotion[i];
    float t = uTime * motion.y;
    float a1 = TAU * path.z * uv.x + t + motion.x;
    float a2 = TAU * path.w * uv.x - t * COUNTER_DRIFT + motion.x * PHASE_SPREAD;

    float y = path.x + path.y * (uv.x - 0.5)
      + uAmplitude * (HARMONIC_MIX * sin(a1) + (1.0 - HARMONIC_MIX) * sin(a2));
    float slope = path.y + uAmplitude * TAU
      * (HARMONIC_MIX * path.z * cos(a1) + (1.0 - HARMONIC_MIX) * path.w * cos(a2));
    slope /= aspect;

    float d = abs(uv.y - y) / sqrt(1.0 + slope * slope);
    float w = uWidth * (1.0 + BREATHING * sin(BREATHING_RATE * a1 + t));
    float core = exp(-(d * d) / (w * w));
    float g = w * uGlow;
    float band = core + uGlowStrength * exp(-(d * d) / (g * g));

    light += uColor[i] * band * uIntensity[i];
    if (i == 0) band0 = band;
    else if (i == 1) band1 = band;
    else band2 = band;
  }

  float crossing = band0 * band1 + band1 * band2 + band0 * band2;
  vec3 bloomColor = mix(mix(uColor[0], uColor[1], BLOOM_BLEND), uHighlight, BLOOM_WHITENING);
  light += bloomColor * crossing * uBloom;

  vec2 f = (uv - uFocus) * vec2(aspect * FOCUS_STRETCH, 1.0);
  light *= exp(-dot(f, f) * uFalloff);

  vec3 mapped = 1.0 - exp(-light);
  vec3 color = uBackground + mapped * (1.0 - uBackground);
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * uGrain;
  gl_FragColor = vec4(color, 1.0);
}
`;

interface Tokens {
  background: number[];
  highlight: number[];
  colors: number[];
  intensities: number[];
  width: number;
  glow: number;
  glowStrength: number;
  bloom: number;
  speed: number;
  amplitude: number;
  focus: [number, number];
  falloff: number;
  grain: number;
  maxDpr: number;
  renderScale: number;
  maxFps: number;
}

function hexToRgb(value: string): number[] {
  const hex = value.trim().replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
}

function readTokens(): Tokens {
  const style = getComputedStyle(document.documentElement);
  const raw = (name: string) => style.getPropertyValue(name).trim();
  const num = (name: string) => parseFloat(raw(name));
  return {
    background: hexToRgb(raw('--ribbon-bg')),
    highlight: hexToRgb(raw('--color-text')),
    colors: [1, 2, 3].flatMap((i) => hexToRgb(raw(`--ribbon-color-${i}`))),
    intensities: [1, 2, 3].map((i) => num(`--ribbon-intensity-${i}`)),
    width: num('--ribbon-width'),
    glow: num('--ribbon-glow'),
    glowStrength: num('--ribbon-glow-strength'),
    bloom: num('--ribbon-bloom'),
    speed: num('--ribbon-speed'),
    amplitude: num('--ribbon-amplitude'),
    focus: [num('--ribbon-focus-x'), num('--ribbon-focus-y')],
    falloff: num('--ribbon-falloff'),
    grain: num('--ribbon-grain'),
    maxDpr: num('--ribbon-max-dpr'),
    renderScale: num('--ribbon-render-scale'),
    maxFps: num('--ribbon-max-fps'),
  };
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[ribbons] shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Mounts the effect on a canvas inside `host`. Returns a cleanup function.
 * When WebGL is unavailable it returns early and the CSS fallback stays.
 */
export function mountRibbons(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  const tokens = readTokens();
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  });
  if (!gl) return () => {};

  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};

  function setup(): boolean {
    if (!gl) return false;
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return false;
    program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[ribbons] program link failed:', gl.getProgramInfoLog(program));
      return false;
    }
    gl.useProgram(program);

    // One triangle that covers the whole viewport.
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const names = [
      'uResolution', 'uTime', 'uBackground', 'uHighlight', 'uColor', 'uIntensity', 'uPath', 'uMotion',
      'uWidth', 'uGlow', 'uGlowStrength', 'uBloom', 'uAmplitude', 'uFocus', 'uFalloff', 'uGrain',
    ];
    uniforms = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program!, name)]));

    gl.uniform3fv(uniforms.uBackground, tokens.background);
    gl.uniform3fv(uniforms.uHighlight, tokens.highlight);
    gl.uniform3fv(uniforms.uColor, tokens.colors);
    gl.uniform1fv(uniforms.uIntensity, tokens.intensities);
    gl.uniform4fv(uniforms.uPath, RIBBON_PATHS.flatMap((p) => [p.base, p.tilt, p.freq[0], p.freq[1]]));
    gl.uniform2fv(uniforms.uMotion, RIBBON_PATHS.flatMap((p) => [p.phase, p.drift]));
    gl.uniform1f(uniforms.uWidth, tokens.width);
    gl.uniform1f(uniforms.uGlow, tokens.glow);
    gl.uniform1f(uniforms.uGlowStrength, tokens.glowStrength);
    gl.uniform1f(uniforms.uBloom, tokens.bloom);
    gl.uniform1f(uniforms.uAmplitude, tokens.amplitude);
    gl.uniform2fv(uniforms.uFocus, tokens.focus);
    gl.uniform1f(uniforms.uFalloff, tokens.falloff);
    gl.uniform1f(uniforms.uGrain, tokens.grain);
    return true;
  }

  if (!setup()) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const frameInterval = 1000 / tokens.maxFps;

  let raf = 0;
  let lastFrame = 0;
  let lastTick = 0;
  let elapsed = 0; // seconds of animation actually shown
  let inView = true;
  let contextLost = false;

  const still = () => reducedMotion.matches || saveData;

  function resize() {
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, tokens.maxDpr) * tokens.renderScale;
    const width = Math.max(1, Math.round(host.clientWidth * dpr));
    const height = Math.max(1, Math.round(host.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(time: number) {
    if (!gl || contextLost) return;
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!canvas.dataset.ready) canvas.dataset.ready = 'true';
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (now - lastFrame < frameInterval) return;
    // Cap one step at 100 ms so a stalled tab does not jump ahead.
    if (lastTick) elapsed += Math.min(now - lastTick, 100) / 1000;
    lastTick = now;
    lastFrame = now;
    draw(RIBBON_SHAPE.stillTime + elapsed * tokens.speed);
  }

  function start() {
    if (raf || still() || !inView || document.hidden || contextLost) return;
    lastTick = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function refresh() {
    stop();
    resize();
    if (still()) draw(RIBBON_SHAPE.stillTime);
    else start();
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!raf) draw(RIBBON_SHAPE.stillTime + elapsed * tokens.speed);
  });
  resizeObserver.observe(host);

  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  });
  visibility.observe(host);

  const onVisibility = () => (document.hidden ? stop() : start());
  const onMotionChange = () => refresh();
  const onLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    stop();
  };
  const onRestored = () => {
    contextLost = false;
    if (setup()) refresh();
  };

  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotionChange);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  refresh();

  return () => {
    stop();
    resizeObserver.disconnect();
    visibility.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMotion.removeEventListener('change', onMotionChange);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    if (gl) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  };
}
