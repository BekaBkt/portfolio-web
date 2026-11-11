import { useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useScrub } from "../lib/scroll.js";
import { links } from "../content.js";

// Shows the whole artboard at its native proportions (no cropping, no stretching).
function OzzyRive({ onAspect, settledRef }) {
  const { rive, RiveComponent } = useRive({
    src: "/Ozzy.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (!rive) return;
    const w = rive.artboardWidth || (rive.bounds && rive.bounds.maxX - rive.bounds.minX);
    const h = rive.artboardHeight || (rive.bounds && rive.bounds.maxY - rive.bounds.minY);
    if (w > 0 && h > 0) onAspect(w / h);
    // the window is tilted in 3D while it scrolls in; re-measure once it's flat
    settledRef.current = () => rive.resizeDrawingSurfaceToCanvas();
    requestAnimationFrame(() => rive.resizeDrawingSurfaceToCanvas());
  }, [rive, onAspect, settledRef]);

  return <RiveComponent className="ozzy__rive" />;
}

export default function Ozzy({ t }) {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const [near, setNear] = useState(false);
  const [aspect, setAspect] = useState(null);
  const settledRef = useRef(null);
  const wasFlat = useRef(false);

  // only download the Rive file once the section is close
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "60% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the device window tilts up from the water as it comes into view
  useScrub(ref, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.04) / 0.42));
    const e = 1 - Math.pow(1 - t, 3);
    ref.current.style.setProperty("--tilt", e.toFixed(4));
    ref.current.style.setProperty("--drift", p.toFixed(4));
    const flat = e > 0.999;
    if (flat && !wasFlat.current && settledRef.current) settledRef.current();
    wasFlat.current = flat;
  });

  return (
    <section className="ozzy" id="ozzy" data-scene="ozzy" ref={ref}>
      <div className="ozzy__grid">
        <div className="ozzy__copy">
          <h2 className="ozzy__title">{t.ozzy.title}</h2>
          <p className="ozzy__tagline">{t.ozzy.tagline}</p>
          <p className="ozzy__body">{t.ozzy.body}</p>
          <ul className="chips" aria-label="Stack">
            {t.ozzy.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="ozzy__actions">
            <a href={links.appStore} target="_blank" rel="noreferrer" className="ozzy__store">
              <img src="/app-store-badge.svg" alt={t.ozzy.appStore} width="150" height="50" />
            </a>
            <a href={links.ozzySite} target="_blank" rel="noreferrer" className="btn btn--glass">{t.ozzy.site}</a>
          </div>
        </div>

        <figure className="ozzy__stage" ref={stageRef}>
          <div className="ozzy__window" style={aspect ? { aspectRatio: String(aspect) } : undefined}>
            {near ? <OzzyRive onAspect={setAspect} settledRef={settledRef} /> : <div className="ozzy__rive" />}
          </div>
          <figcaption className="ozzy__caption">{t.ozzy.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
