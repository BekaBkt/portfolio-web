import { vertexSource, fragmentSource } from "./shader.js";
import { scrollState } from "../lib/scrollState.js";

/* ───────────── helpers ───────────── */
const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const lerp = (a, b, t) => a + (b - a) * t;
const lerpArr = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* ───────────── moods (time of day) ───────────── */
const MOODS = {
  dusk: {
    skyTop: hex("#1d2252"), skyHor: hex("#f1a68c"), sun: hex("#ffc89e"), sunDir: norm([0.16, 0.045, -1]),
    disc: 1, water: hex("#141a38"), mtnFar: hex("#6d5d92"), mtnNear: hex("#2a2552"), stars: 0, alpen: 0.6, glow: 0.7, glitter: 2.2,
  },
  blue: {
    skyTop: hex("#111737"), skyHor: hex("#8a7cba"), sun: hex("#e9a7bb"), sunDir: norm([0.05, -0.01, -1]),
    disc: 0, water: hex("#0e1431"), mtnFar: hex("#4a4679"), mtnNear: hex("#1d1b3e"), stars: 0.4, alpen: 0.2, glow: 1, glitter: 1.5,
  },
  night: {
    skyTop: hex("#060918"), skyHor: hex("#28336a"), sun: hex("#d2dbff"), sunDir: norm([-0.38, 0.3, -1]),
    disc: 0.85, water: hex("#060a1b"), mtnFar: hex("#262b55"), mtnNear: hex("#10122b"), stars: 1, alpen: 0, glow: 1.4, glitter: 0.9,
  },
  predawn: {
    skyTop: hex("#151b3e"), skyHor: hex("#c98faa"), sun: hex("#ffb7a0"), sunDir: norm([0.28, -0.012, -1]),
    disc: 0, water: hex("#121736"), mtnFar: hex("#5b4d82"), mtnNear: hex("#231e46"), stars: 0.3, alpen: 0.5, glow: 1.1, glitter: 1.6,
  },
  dawn: {
    skyTop: hex("#33447f"), skyHor: hex("#f6b897"), sun: hex("#ffd2a8"), sunDir: norm([0.1, 0.012, -1]),
    disc: 1, water: hex("#25305f"), mtnFar: hex("#9c86b9"), mtnNear: hex("#393263"), stars: 0, alpen: 1, glow: 0.8, glitter: 1.5,
  },
};

// which mood and orb placement belongs to each section; orb = [right, up, forward, radius]
const SCENES = {
  hero:    { mood: "dusk",    orb: [2.9, 0.8, 10, 1.05], orbM: [0, 1.55, 8.5, 1.0] },
  intro:   { mood: "blue",    orb: [4.2, 1.9, 13, 0.85],    orbM: [0, 2.1, 10, 0.85] },
  ozzy:    { mood: "blue",    orb: [0.4, 2.3, 13, 0.75],   orbM: [0, 2.6, 12, 0.7] },
  work:    { mood: "night",   orb: [0, 3.1, 17, 1.0],      orbM: [0, 3.0, 15, 0.8] },
  craft:   { mood: "predawn", orb: [3.6, 1.3, 12, 0.95],    orbM: [0, 2.2, 11, 0.85] },
  contact: { mood: "dawn",    orb: [0.6, 0.0, 12, 1.4],   orbM: [0, 0.4, 12, 1.2] },
};
const ORDER = ["hero", "intro", "ozzy", "work", "craft", "contact"];
const DEFAULT_ANCHORS = { hero: 0, intro: 0.14, ozzy: 0.3, work: 0.55, craft: 0.8, contact: 1 };

function mixMood(a, b, t) {
  const out = {};
  for (const k of Object.keys(a)) {
    out[k] = Array.isArray(a[k]) ? lerpArr(a[k], b[k], t) : lerp(a[k], b[k], t);
  }
  out.sunDir = norm(out.sunDir);
  return out;
}

/* ───────────── world ───────────── */
export function createWorld(canvas, { reducedMotion = false } = {}) {
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
  if (!gl) return null;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "aPos");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(prog, i);
    U[info.name] = gl.getUniformLocation(prog, info.name);
  }

  /* sizing + adaptive quality */
  const isMobile = () => window.innerWidth < 820;
  let quality = isMobile() ? 0.62 : 0.72;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(window.innerWidth * dpr * quality));
    const h = Math.max(1, Math.round(window.innerHeight * dpr * quality));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  resize();
  window.addEventListener("resize", resize);

  /* pointer */
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  /* section anchors in scroll progress (0..1) */
  const anchors = () => {
    const a = scrollState.anchors;
    return ORDER.map((k) => ({ key: k, at: a && a[k] != null ? a[k] : DEFAULT_ANCHORS[k] }));
  };

  const sample = (p) => {
    const list = anchors();
    let i = 0;
    while (i < list.length - 2 && p > list[i + 1].at) i++;
    const a = list[i];
    const b = list[i + 1];
    const t = smooth(clamp01((p - a.at) / Math.max(1e-4, b.at - a.at)));
    const sa = SCENES[a.key];
    const sb = SCENES[b.key];
    const mob = isMobile();
    return {
      mood: mixMood(MOODS[sa.mood], MOODS[sb.mood], t),
      orb: lerpArr(mob ? sa.orbM : sa.orb, mob ? sb.orbM : sb.orb, t),
    };
  };

  let progress = scrollState.progress;
  let velocity = 0;
  let last = performance.now();
  const start = last;
  let raf = 0;
  let frames = 0;
  let slowFrames = 0;
  let lastQualityCheck = last;

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    // adaptive resolution: drop quality if we're consistently slow
    frames++;
    if (dt > 0.026) slowFrames++;
    if (now - lastQualityCheck > 2000) {
      if (slowFrames / frames > 0.5 && quality > 0.4) {
        quality = Math.max(0.4, quality - 0.1);
        resize();
      }
      frames = 0;
      slowFrames = 0;
      lastQualityCheck = now;
    }

    const target = scrollState.progress;
    const prev = progress;
    progress = lerp(progress, target, 1 - Math.exp(-dt * 5));
    velocity = lerp(velocity, (progress - prev) / Math.max(dt, 1e-3), 1 - Math.exp(-dt * 4));

    pointer.sx = lerp(pointer.sx, pointer.x, 1 - Math.exp(-dt * 2.5));
    pointer.sy = lerp(pointer.sy, pointer.y, 1 - Math.exp(-dt * 2.5));

    const p = progress;
    const time = ((now - start) / 1000) * (reducedMotion ? 0.35 : 1);

    // camera glides forward over the water
    const cam = [
      Math.sin(p * Math.PI * 1.5) * 4 + pointer.sx * 0.35,
      2.3 + Math.sin(p * Math.PI) * 1.3 - pointer.sy * 0.15,
      10 - p * 80,
    ];
    const yaw = Math.sin(p * Math.PI * 2) * 0.16 + pointer.sx * 0.045;
    const pitch = -0.1 - Math.sin(p * Math.PI) * 0.03 - pointer.sy * 0.02;
    const F = norm([Math.sin(yaw), pitch, -Math.cos(yaw)]);
    const R = norm(cross(F, [0, 1, 0]));
    const Up = cross(R, F);

    const { mood, orb } = sample(p);
    const orbPos = [
      cam[0] + R[0] * orb[0] + Up[0] * orb[1] + F[0] * orb[2],
      cam[1] + R[1] * orb[0] + Up[1] * orb[1] + F[1] * orb[2],
      cam[2] + R[2] * orb[0] + Up[2] * orb[1] + F[2] * orb[2],
    ];
    // gentle bob
    orbPos[1] += Math.sin(time * 0.6) * 0.12;
    orbPos[1] = Math.max(orbPos[1], orb[3] * 0.3);

    const intro = reducedMotion ? 1 : smooth(clamp01((now - start) / 1800));

    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, time);
    gl.uniform3fv(U.uCamPos, cam);
    gl.uniform3fv(U.uCamF, F);
    gl.uniform3fv(U.uCamR, R);
    gl.uniform3fv(U.uCamU, Up);
    gl.uniform1f(U.uFocal, isMobile() ? 1.25 : 1.55);
    gl.uniform3fv(U.uSkyTop, mood.skyTop);
    gl.uniform3fv(U.uSkyHor, mood.skyHor);
    gl.uniform3fv(U.uSun, mood.sun);
    gl.uniform3fv(U.uSunDir, mood.sunDir);
    gl.uniform1f(U.uDisc, mood.disc);
    gl.uniform3fv(U.uWater, mood.water);
    gl.uniform3fv(U.uMtnFar, mood.mtnFar);
    gl.uniform3fv(U.uMtnNear, mood.mtnNear);
    gl.uniform1f(U.uStars, mood.stars);
    gl.uniform1f(U.uAlpenglow, mood.alpen);
    gl.uniform1f(U.uGlitter, mood.glitter);
    gl.uniform3fv(U.uOrbPos, orbPos);
    gl.uniform1f(U.uOrbR, orb[3]);
    gl.uniform1f(U.uOrbGlow, mood.glow);
    gl.uniform1f(U.uWave, 1 + Math.min(Math.abs(velocity) * 6, 0.9));
    gl.uniform1f(U.uIntro, 0.15 + 0.85 * intro);
    gl.uniform1f(U.uPx, 1.2 / (canvas.height * (isMobile() ? 1.25 : 1.55)));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    },
  };
}
