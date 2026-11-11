import { useRef } from "react";
import { useReveal, useScrub } from "../lib/scroll.js";

export default function Craft({ t }) {
  const ref = useRef(null);
  const listRef = useRef(null);
  useReveal(listRef, { threshold: 0.2 });

  // columns drift at slightly different speeds
  useScrub(ref, (p) => ref.current.style.setProperty("--pass", (p - 0.5).toFixed(4)));

  return (
    <section className="craft" data-scene="craft" ref={ref}>
      <h2 className="section-title craft__title">{t.craft.title}</h2>
      <ul className="craft__list reveal" ref={listRef}>
        {t.craft.items.map((item, i) => (
          <li className="craft__item" key={item.title} style={{ "--i": i }}>
            <h3 className="craft__name">{item.title}</h3>
            <p className="craft__text">{item.text}</p>
            <p className="craft__stack">{item.stack}</p>
          </li>
        ))}
      </ul>
      <p className="craft__note">{t.craft.note}</p>
    </section>
  );
}
