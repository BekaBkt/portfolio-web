import { useEffect, useRef } from "react";
import { useScrub, useReveal } from "../lib/scroll.js";
import { projects } from "../content.js";

const DESKTOP = "(min-width: 820px)";

export default function Work({ t }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const geo = useRef({ distance: 0, centers: [], vw: 1 });
  const panels = useRef([]);
  const counterRef = useRef(null);

  useReveal(headRef);

  // the section is as tall as the horizontal distance the track travels
  useEffect(() => {
    const section = ref.current;
    const track = trackRef.current;
    const mq = window.matchMedia(DESKTOP);
    const measure = () => {
      if (!mq.matches) {
        section.style.height = "";
        track.style.transform = "";
        panels.current.forEach((p) => p && (p.style.transform = "", p.style.opacity = ""));
        return;
      }
      const vw = window.innerWidth;
      const distance = Math.max(0, track.scrollWidth - vw);
      geo.current = {
        vw,
        distance,
        centers: panels.current.map((p) => (p ? p.offsetLeft + p.offsetWidth / 2 : 0)),
      };
      section.style.height = `${distance + window.innerHeight * 1.15}px`;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useScrub(
    ref,
    (p) => {
      if (!window.matchMedia(DESKTOP).matches) return;
      const { distance, centers, vw } = geo.current;
      // hold briefly at both ends so the first and last panels can settle
      const q = Math.min(1, Math.max(0, (p - 0.04) / 0.92));
      const x = -q * distance;
      trackRef.current.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      let active = 0;
      let best = Infinity;
      centers.forEach((c, i) => {
        const el = panels.current[i];
        if (!el) return;
        const off = (c + x - vw * 0.5) / vw; // -1..1 around the screen center
        if (Math.abs(off) < best) {
          best = Math.abs(off);
          active = i;
        }
        const a = Math.max(-1, Math.min(1, off));
        el.style.transform = `perspective(1400px) rotateY(${(-a * 16).toFixed(2)}deg) translateZ(${(-Math.abs(a) * 120).toFixed(1)}px)`;
        el.style.opacity = (1 - Math.min(0.55, Math.abs(a) * 0.6)).toFixed(3);
        el.style.setProperty("--parallax", a.toFixed(4));
      });
      if (counterRef.current) counterRef.current.textContent = `${active + 1} ${t.work.of} ${projects.length}`;
    },
    "pin"
  );

  return (
    <section className="work" id="work" data-scene="work" ref={ref}>
      <div className="work__sticky">
        <div className="work__head reveal" ref={headRef}>
          <h2 className="section-title">{t.work.title}</h2>
          <p className="work__lead">{t.work.lead}</p>
          <p className="work__counter" ref={counterRef} aria-hidden="true">1 {t.work.of} {projects.length}</p>
        </div>
        <div className="work__track" ref={trackRef}>
          {projects.map((p, i) => {
            const item = t.work.items[p.id];
            return (
              <article className="panel" key={p.id} ref={(el) => (panels.current[i] = el)}>
                <a className="panel__shot" href={p.link} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                  <img src={p.image} alt="" loading="lazy" width="1600" height="925" />
                </a>
                <div className="panel__info">
                  <h3 className="panel__title">{item.title}</h3>
                  <p className="panel__text">{item.text}</p>
                  <p className="panel__stack">{p.stack.join(", ")}</p>
                  <a className="panel__link" href={p.link} target="_blank" rel="noreferrer">
                    {t.work.visit}
                    <span className="panel__host">{p.host}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
