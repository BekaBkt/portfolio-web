import { useEffect, useRef, useState } from "react";
import { createWorld } from "../world/World.js";
import { prefersReducedMotion } from "../lib/scroll.js";

export default function WorldCanvas() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let world = null;
    try {
      world = createWorld(ref.current, { reducedMotion: prefersReducedMotion() });
    } catch (err) {
      console.error(err);
    }
    if (!world) setFailed(true);
    return () => world && world.destroy();
  }, []);

  return (
    <div className={`world ${failed ? "world--fallback" : ""}`} aria-hidden="true">
      <canvas ref={ref} className="world__canvas" />
    </div>
  );
}
