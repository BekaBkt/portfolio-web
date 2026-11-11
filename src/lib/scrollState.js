// Shared, non-React scroll state. Written by the scroll engine, read every
// frame by the WebGL world and the section animations (no re-renders).
export const scrollState = {
  y: 0,
  progress: 0,
  vh: typeof window !== "undefined" ? window.innerHeight : 800,
  anchors: null, // { hero: 0, intro: 0.14, ... } — section centers in progress units
};

export function measureAnchors() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const anchors = {};
  document.querySelectorAll("[data-scene]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    // the moment the section's middle crosses the middle of the screen
    const center = top + r.height / 2 - window.innerHeight / 2;
    anchors[el.dataset.scene] = Math.min(1, Math.max(0, center / max));
  });
  anchors.hero = 0;
  anchors.contact = 1;
  scrollState.anchors = anchors;
}

export function updateScroll() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollState.y = window.scrollY;
  scrollState.vh = window.innerHeight;
  scrollState.progress = Math.min(1, Math.max(0, window.scrollY / max));
}
