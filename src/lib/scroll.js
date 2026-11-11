import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { scrollState, updateScroll, measureAnchors } from "./scrollState.js";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/* ───────── scrub registry ─────────
   mode "pass":  0 when the element's top enters the bottom of the screen,
                 1 when its bottom leaves the top.
   mode "pin":   0 when the element's top reaches the top of the screen,
                 1 when its bottom reaches the bottom (for sticky scenes).
   mode "leave": 0 at the top of the page, 1 when the element has scrolled away. */
const scrubs = new Set();

export function runScrubs(force = false) {
  const vh = window.innerHeight;
  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    let p;
    if (s.mode === "pin") p = -r.top / Math.max(1, r.height - vh);
    else if (s.mode === "leave") p = -r.top / Math.max(1, r.height);
    else p = (vh - r.top) / (vh + r.height);
    p = clamp01(p);
    if (force || Math.abs(p - s.last) > 0.0004) {
      s.last = p;
      s.fn(p, r);
    }
  }
}

export function useScrub(ref, fn, mode = "pass") {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const s = { el, mode, last: -1, fn: (p, r) => fnRef.current(p, r) };
    scrubs.add(s);
    runScrubs(true);
    return () => scrubs.delete(s);
  }, [ref, mode]);
}

/* ───────── reveal-on-enter (one-shot) ───────── */
export function useReveal(ref, { threshold = 0.25 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
}

/* ───────── smooth scroll engine ───────── */
let lenis = null;

export function scrollToTarget(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (lenis) lenis.scrollTo(el ?? 0, { duration: 1.8 });
  else if (el && el.scrollIntoView) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function useScrollEngine() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
    }
    let raf = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (lenis) lenis.raf(t);
      updateScroll();
      runScrubs();
    };
    raf = requestAnimationFrame(loop);

    const remeasure = () => {
      measureAnchors();
      updateScroll();
      runScrubs(true);
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("resize", remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    remeasure();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
      if (lenis) lenis.destroy();
      lenis = null;
    };
  }, []);
  return scrollState;
}
