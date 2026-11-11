import { useRef } from "react";
import { useScrub, scrollToTarget } from "../lib/scroll.js";

export default function Hero({ t }) {
  const ref = useRef(null);

  // as the hero scrolls away, the name opens up and the copy drifts off
  useScrub(
    ref,
    (p) => {
      ref.current.style.setProperty("--leave", p.toFixed(4));
    },
    "leave"
  );

  const chars = [...t.hero.name];

  return (
    <section className="hero" id="top" data-scene="hero" ref={ref}>
      <div className="hero__inner">
        <p className="hero__role rise" style={{ "--d": "0.15s" }}>{t.hero.role}</p>
        <h1 className="hero__name" aria-label={t.hero.name}>
          {chars.map((c, i) => (
            <span className="hero__char-mask" key={`${c}-${i}`} aria-hidden="true">
              <span className="hero__char" style={{ "--i": i }}>{c}</span>
            </span>
          ))}
        </h1>
        <p className="hero__lead rise" style={{ "--d": "0.9s" }}>{t.hero.lead}</p>
        <div className="hero__actions rise" style={{ "--d": "1.05s" }}>
          <a className="btn btn--solid" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>
            {t.hero.primary}
          </a>
          <a className="btn btn--glass" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>
            {t.hero.secondary}
          </a>
        </div>
      </div>

      <div className="hero__foot rise" style={{ "--d": "1.3s" }}>
        <span>{t.hero.place}</span>
        <span className="hero__status">
          <span className="dot" aria-hidden="true" />
          {t.hero.status}
        </span>
        <span className="hero__scroll" aria-hidden="true">
          {t.hero.scroll}
          <span className="hero__scroll-line" />
        </span>
      </div>
    </section>
  );
}
