import { useState } from 'react';
import { motion } from 'framer-motion';
import './index.css';
import HeroAndProjects from './HeroAndProjects';
import ServicesAndContact from './ServicesAndContact';

function LanguageSwitcher({ lang, setLang }) {
  const toggleLang = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="fixed top-6 right-8 sm:right-12 z-50">
      <motion.button
        onClick={toggleLang}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          flex items-baseline justify-center
          px-3 py-1.5 rounded-full
          bg-gray-900/60 border border-white/10
          hover:bg-purple-900/40 hover:border-purple-500/40
          shadow-[0_0_15px_rgba(0,0,0,0.5)]
          hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]
          transition-colors duration-300
          backdrop-blur-md cursor-pointer select-none
        "
      >
        <span className={`text-xs font-bold tracking-widest transition-colors ${lang === 'ru' ? 'text-white' : 'text-white/40'}`}>
          RU
        </span>
        <span className="mx-1.5 text-white/20 text-[10px]">/</span>
        <span className={`text-xs font-bold tracking-widest transition-colors ${lang === 'en' ? 'text-white' : 'text-white/40'}`}>
          EN
        </span>
      </motion.button>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('ru');

  return (
    <main className="relative">
      <LanguageSwitcher lang={lang} setLang={setLang} />
      <HeroAndProjects lang={lang} />
      <div id="contact-section">
        <ServicesAndContact lang={lang} />
      </div>
    </main>
  );
}

export default App;
