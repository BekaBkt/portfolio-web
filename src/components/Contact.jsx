import { useRef, useState } from "react";
import { useReveal, scrollToTarget } from "../lib/scroll.js";
import { links } from "../content.js";

const WEB3FORMS_KEY = "b188129f-374f-4eee-aea5-6e7b8e3f7cc0";

export default function Contact({ t }) {
  const f = t.contact.form;
  const headRef = useRef(null);
  const bodyRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);
  useReveal(headRef);
  useReveal(bodyRef, { threshold: 0.15 });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    data.set("services", data.getAll("service").join(", "));
    data.delete("service");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      setStatus(json.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = links.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="contact" id="contact" data-scene="contact">
      <div className="contact__head reveal" ref={headRef}>
        <h2 className="contact__title">{t.contact.title}</h2>
        <p className="contact__lead">{t.contact.lead}</p>
      </div>

      <div className="contact__grid reveal" ref={bodyRef}>
        <div className="glass contact__form-wrap">
          {status === "sent" ? (
            <p className="form__done" role="status">{f.success}</p>
          ) : (
            <form className="form" onSubmit={submit}>
              <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
              <input type="hidden" name="subject" value={f.subject} />
              <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} aria-hidden="true" />

              <div className="form__row">
                <label className="field">
                  <span className="field__label">{f.name}</span>
                  <input name="name" required autoComplete="name" placeholder={f.namePh} />
                </label>
                <label className="field">
                  <span className="field__label">{f.reach}</span>
                  <input name="contact" required autoComplete="email" placeholder={f.reachPh} />
                </label>
              </div>

              <fieldset className="field">
                <legend className="field__label">{f.topics}</legend>
                <div className="topics">
                  {f.topicList.map((topic) => (
                    <label className="topic" key={topic}>
                      <input type="checkbox" name="service" value={topic} />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field">
                <span className="field__label">{f.message}</span>
                <textarea name="message" rows={4} placeholder={f.messagePh} />
              </label>

              {status === "error" && <p className="form__error" role="alert">{f.error}</p>}

              <button className="btn btn--solid form__submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? f.sending : f.send}
              </button>
            </form>
          )}
        </div>

        <div className="glass contact__direct">
          <p className="contact__direct-title">{t.contact.direct}</p>
          <a
            className="direct"
            href={`https://wa.me/${links.whatsapp}?text=${encodeURIComponent(t.contact.whatsappText)}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="direct__label">{t.contact.whatsapp}</span>
            <span className="direct__value">{links.phoneLabel}</span>
          </a>
          <button type="button" className="direct" onClick={copyEmail}>
            <span className="direct__label">{copied ? t.contact.copied : t.contact.copyEmail}</span>
            <span className="direct__value">{links.email}</span>
          </button>
          <p className="contact__remote">{t.contact.remote}</p>
        </div>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Bexultan</span>
        <span>{t.footer.built}</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget("#top"); }}>{t.footer.top}</a>
      </footer>
    </section>
  );
}
