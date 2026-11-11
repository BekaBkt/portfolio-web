import { scrollToTarget } from "../lib/scroll.js";

export default function Header({ t, lang, setLang }) {
  const go = (id) => (e) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <header className="header">
      <a className="skip-link" href="#main">{t.nav.skip}</a>
      <a className="header__mark" href="#top" onClick={go("#top")}>
        Bexultan
      </a>
      <nav className="header__nav" aria-label="Primary">
        <a href="#work" onClick={go("#work")} className="header__link header__link--hide-sm">{t.nav.work}</a>
        <a href="#ozzy" onClick={go("#ozzy")} className="header__link header__link--hide-sm">{t.nav.ozzy}</a>
        <a href="#contact" onClick={go("#contact")} className="header__link">{t.nav.contact}</a>
        <div className="lang" role="group" aria-label="Language">
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
          <button type="button" aria-pressed={lang === "ru"} onClick={() => setLang("ru")}>RU</button>
        </div>
      </nav>
    </header>
  );
}
