import { useMemo, useRef } from "react";
import { useScrub } from "../lib/scroll.js";

// A statement that "writes itself" as you scroll: each word brightens in turn.
export default function Intro({ t }) {
  const ref = useRef(null);
  const words = useMemo(() => t.intro.split(" "), [t.intro]);
  const wordRefs = useRef([]);

  useScrub(
    ref,
    (p) => {
      const n = words.length;
      // finish slightly before the pin releases so the full sentence can be read
      const q = Math.min(1, p * 1.3);
      for (let i = 0; i < n; i++) {
        const el = wordRefs.current[i];
        if (!el) continue;
        const w = Math.min(1, Math.max(0, (q * (n + 4) - i) / 4));
        el.style.opacity = (0.16 + 0.84 * w).toFixed(3);
        el.style.transform = `translateY(${((1 - w) * 0.18).toFixed(3)}em)`;
        el.style.filter = w < 1 ? `blur(${((1 - w) * 3).toFixed(2)}px)` : "none";
      }
    },
    "pin"
  );

  return (
    <section className="intro" data-scene="intro" ref={ref} id="main">
      <div className="intro__sticky">
        <p className="intro__text">
          {words.map((w, i) => (
            <span key={`${w}-${i}`}>
              <span ref={(el) => (wordRefs.current[i] = el)} className="intro__word">{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
