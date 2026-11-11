import { useEffect, useState } from "react";
import { content } from "./content.js";
import { useScrollEngine } from "./lib/scroll.js";
import WorldCanvas from "./components/WorldCanvas.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Intro from "./components/Intro.jsx";
import Ozzy from "./components/Ozzy.jsx";
import Work from "./components/Work.jsx";
import Craft from "./components/Craft.jsx";
import Contact from "./components/Contact.jsx";

function initialLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("ru") || nav.startsWith("kk") ? "ru" : "en";
}

export default function App() {
  const [lang, setLang] = useState(initialLang);
  const t = content[lang];
  useScrollEngine();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, t]);

  return (
    <>
      <WorldCanvas />
      <Header t={t} lang={lang} setLang={setLang} />
      <main className="page">
        <Hero t={t} />
        <Intro t={t} />
        <Ozzy t={t} />
        <Work t={t} />
        <Craft t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
