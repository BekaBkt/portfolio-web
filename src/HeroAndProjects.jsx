import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, ExternalLink, Code2, Sparkles, Cpu, Layers, Zap } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { translations } from "./translations";

/* ─────────── animation variants ─────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─────────── tech badge ─────────── */
const techColors = {
  React: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  TypeScript: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  JavaScript: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  Rive: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  "LLM APIs": "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
  LLMs: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
  Cursor: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  Claude: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  "State Machines": "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  "Next.js": "bg-slate-500/10 border-slate-400/30 text-slate-300",
  "Tailwind CSS": "bg-teal-500/10 border-teal-500/30 text-teal-400",
  "Framer Motion": "bg-pink-500/10 border-pink-500/30 text-pink-400",
  "Responsive Architecture": "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  "Headless CMS": "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Git: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  "Cursor & Claude": "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

function TechBadge({ tech }) {
  const cls = techColors[tech] || "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium tracking-wide ${cls}`}>
      {tech}
    </span>
  );
}

/* ─────────── metrics component ─────────── */
function MetricRing({ label, value, isDelay = 0 }) {
  const isTime = typeof value === 'string';
  const valNum = isTime ? 95 : value;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-11 h-11 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="2.5" />
          <motion.circle
            cx="18" cy="18" r="16" fill="none" className="stroke-indigo-400"
            strokeWidth="2.5" strokeDasharray="100 100"
            initial={{ strokeDashoffset: 100 }}
            whileInView={{ strokeDashoffset: 100 - valNum }}
            transition={{ duration: 1.5, ease: "easeOut", delay: isDelay }}
            viewport={{ once: true }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-white tracking-tighter" style={{ textShadow: "0 0 10px rgba(129,140,248,0.5)" }}>{value}</span>
      </div>
      <span className="text-[8px] text-white/50 uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ─────────── Apple App Store Icon ─────────── */
function AppleLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-7.81-12.01-13.57-25.26-17.27-39.73-3.7-14.47-5.55-27.42-5.55-38.84 0-14.47 3.58-26.47 10.74-35.99 7.16-9.52 16.29-14.47 27.38-14.85 4.35 0 9.42 1.25 15.22 3.75 5.79 2.5 9.77 3.86 11.92 4.09 2.39-.46 6.59-1.89 12.6-4.29 6.01-2.4 11.19-3.48 15.54-3.26 11.96.65 21.6 4.78 28.91 12.39-10.44 6.31-15.55 15-15.33 26.09.22 8.7 3.53 15.98 9.95 21.85 6.41 5.87 14.13 9.13 23.15 9.78-2.61 7.61-6.14 15.71-10.6 24.3zM119.22 31.84c0-7.18 2.61-13.92 7.83-20.22 5.22-6.31 11.74-10.44 19.57-12.39.22 1.3.33 2.5.33 3.59 0 7.18-2.77 14.08-8.32 20.71-5.54 6.63-12.12 10.49-19.73 11.58-.1-1.09-.15-2.18-.15-3.27z" />
    </svg>
  );
}

/* ─────────── Ozzy Rive Canvas Animation ─────────── */
function OzzyRiveAnimation() {
  const { RiveComponent } = useRive({
    src: "/Ozzy.riv",
    stateMachine: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="w-full h-full select-none">
      <RiveComponent className="w-full h-full block" />
    </div>
  );
}

/* ─────────── projects data ─────────── */
const baseProjects = [
  {
    image: "/cosmocode-preview.png",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    link: "https://www.cosmocode.studio/",
    borderHover: "hover:border-purple-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(168,85,247,0.18)]",
  },
  {
    image: "/screenshots/absalute.jpg",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    link: "https://absalute.vercel.app/",
    borderHover: "hover:border-indigo-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(99,102,241,0.18)]",
  },
  {
    image: "/screenshots/era-ophthalmica.jpg",
    tags: ["React", "Responsive Architecture", "Tailwind CSS"],
    link: "https://www.eraophthalmica.com/",
    borderHover: "hover:border-cyan-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(34,211,238,0.18)]",
  },
  {
    image: "/screenshots/pdw.jpg",
    tags: ["React", "Headless CMS", "TypeScript"],
    link: "https://pdw.snc.mybluehost.me/",
    borderHover: "hover:border-rose-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(244,63,94,0.18)]",
  },
];

/* ─────────── Featured Ozzy Project Card ─────────── */
function FeaturedOzzyCard({ t }) {
  const ozzy = t.projects.ozzy;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        relative rounded-3xl overflow-hidden mb-16
        border border-purple-500/30 bg-gradient-to-b from-[#110e20] via-[#0d0b18] to-[#0a0a12]
        shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:shadow-[0_0_70px_rgba(168,85,247,0.25)]
        hover:border-purple-500/50 transition-all duration-500
        flex flex-col items-center text-center p-6 sm:p-10 lg:p-12
      "
    >
      {/* ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* 1. Large Prominent Edge-to-Edge Rive Animation Container */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-[#090812] mb-8 sm:mb-10 aspect-video min-h-[450px] sm:min-h-[520px] flex items-center justify-center">
        <OzzyRiveAnimation />
        
        {/* subtle floating status pill */}
        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 border border-purple-500/40 backdrop-blur-md flex items-center gap-2 text-xs text-purple-300 font-medium z-10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Interactive Rive Canvas</span>
        </div>

        {/* runtime telemetry pill at bottom-right */}
        <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[11px] text-white/70 font-mono z-10 pointer-events-none">
          <span className="text-purple-300 font-semibold">State-Machine Runtime</span>
          <span className="text-white/30">•</span>
          <span className="text-cyan-300">60 FPS</span>
        </div>
      </div>

      {/* 2. Center-Aligned Content Section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={12} className="text-purple-400" />
            {t.projects.featuredBadge}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Cpu size={12} />
            AI & Interactive State Machine
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <span className="font-jellee font-normal text-[#47A659] tracking-normal">{ozzy.title}</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-md bg-[#47A659]/15 text-[#47A659] border border-[#47A659]/30">v1.0</span>
          </h3>
          <p className="text-purple-300/90 font-medium text-base sm:text-lg mt-2">
            {ozzy.tagline}
          </p>
        </div>

        {/* Core Engineering Stack Requirement Box */}
        <div className="w-full rounded-2xl bg-black/50 border border-purple-500/25 p-5 relative overflow-hidden backdrop-blur-md shadow-inner text-center">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs uppercase font-mono tracking-widest text-purple-400 font-bold mb-2 flex items-center justify-center gap-2">
            <Layers size={13} />
            Core Engineering Stack
          </p>
          <p className="text-white/90 text-sm sm:text-base font-semibold leading-relaxed">
            {ozzy.desc}
          </p>
        </div>

        {/* Extended Description */}
        <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-xl">
          {ozzy.longDesc}
        </p>

        {/* Telemetry metrics bar */}
        <div className="w-full max-w-lg rounded-xl bg-black/30 border border-white/10 p-3.5 flex items-center justify-around">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-white font-mono flex items-center justify-center gap-1">
              <Zap size={14} className="text-yellow-400" />
              60 FPS
            </div>
            <div className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Rive Machine</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
              &lt;50ms
            </div>
            <div className="text-[10px] uppercase font-mono text-white/40 tracking-wider">LLM Latency</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
              100%
            </div>
            <div className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Type Safe</div>
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {ozzy.tags.map((tag) => (
            <TechBadge key={tag} tech={tag} />
          ))}
        </div>

        {/* 3. Official Apple "Download on the App Store" Badge */}
        <div className="pt-3 flex justify-center w-full">
          <motion.a
            href={ozzy.link || "https://apps.apple.com/kz/app/ozzy-adhd-focus-pal/id6760987195"}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block transition-transform duration-200 cursor-pointer select-none"
          >
            <img
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              className="h-[46px] sm:h-[52px] w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:brightness-110 transition-all duration-200"
            />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────── project card ─────────── */
function ProjectCard({ project, index, t }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden
        bg-white/[0.03] border border-white/[0.07]
        ${project.borderHover} ${project.glow}
        transition-all duration-300 cursor-pointer
      `}
    >
      {/* screenshot */}
      <div className="relative h-44 overflow-hidden border-b border-white/[0.06]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {/* dark overlay on hover for readability */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="
            absolute top-3 right-3 w-8 h-8 rounded-lg
            bg-white/10 border border-white/10 backdrop-blur-sm
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            translate-y-1 group-hover:translate-y-0
            transition-all duration-300
          "
          aria-label="Open project"
        >
          <ExternalLink size={14} className="text-white/90" />
        </a>
      </div>

      {/* card body */}
      <div className="flex flex-col flex-1 p-6 gap-5">
        <div className="space-y-2">
           <h3 className="text-white font-bold text-lg leading-snug">{project.title}</h3>
           <p className="text-white/45 text-sm leading-relaxed">{project.desc}</p>
        </div>
        
        {/* Tech metrics */}
        <div className="rounded-xl bg-black/20 border border-indigo-500/10 p-4 flex flex-col gap-3 shadow-inner">
          <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold">{project.techDesc}</p>
          <div className="flex justify-between items-center px-1">
            <MetricRing label="Perf" value={100} isDelay={0.1} />
            <MetricRing label="SEO" value={100} isDelay={0.2} />
            <MetricRing label="Load" value="<0.8s" isDelay={0.3} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2 mb-3">
          {project.tags.map((tag) => <TechBadge key={tag} tech={tag} />)}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 mt-auto"
        >
          {t.projects.viewCode}
          <ExternalLink size={13} />
        </a>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function HeroAndProjects({ lang = 'ru' }) {
  const t = translations[lang];
  const projectsRef = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-80px" });

  const scrollToContact = () => {
    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-[#0a0a0f]">

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* background orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 lg:py-0">

            {/* ── LEFT: Engineering Bio & Stack ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* status badge */}
              <motion.div variants={fadeUp} className="mb-7">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t.hero.status}
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight flex flex-col sm:block"
              >
                {t.hero.titleStart}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-[gradshift_4s_ease_infinite]">
                  {t.hero.titleEnd}
                </span>
              </motion.h1>

              {/* H2 */}
              <motion.h2
                variants={fadeUp}
                custom={2}
                className="text-xl sm:text-2xl font-semibold text-white/80 leading-snug mb-5"
              >
                {t.hero.subtitle}
              </motion.h2>

              {/* description */}
              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-white/50 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              >
                {t.hero.description}
              </motion.p>

              {/* tech badges */}
              <motion.div variants={fadeUp} custom={4} className="mb-10 w-full">
                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4 lg:text-left text-center">{t.hero.toolkit}</p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {["React", "TypeScript", "Rive", "LLM APIs", "Cursor & Claude", "Next.js", "Tailwind CSS", "Framer Motion", "Git"].map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} custom={5} className="flex flex-col sm:flex-row items-center gap-4">
                <motion.button
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl
                    bg-gradient-to-r from-indigo-600 to-indigo-500
                    hover:from-indigo-500 hover:to-purple-500
                    text-white font-semibold text-sm tracking-wide
                    shadow-[0_0_28px_rgba(99,102,241,0.45)]
                    hover:shadow-[0_0_40px_rgba(99,102,241,0.65)]
                    transition-all duration-300 focus:outline-none
                    focus:ring-2 focus:ring-indigo-500/50 cursor-pointer
                  "
                >
                  {t.hero.discussBtn}
                  <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                </motion.button>

                <a
                  href="#projects"
                  className="text-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5"
                >
                  <Code2 size={14} />
                  {t.hero.viewWorkBtn}
                </a>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Hologram / Interactive Animation ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-[420px] aspect-square">
                {/* orbit rings */}
                <div
                  className="absolute inset-0 rounded-full border border-indigo-500/20"
                  style={{ animation: "spin 18s linear infinite" }}
                />
                <div
                  className="absolute inset-4 rounded-full border border-purple-500/15"
                  style={{ animation: "spin 12s linear infinite reverse" }}
                />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-600/15 to-purple-600/10 blur-xl" />

                {/* dark circle base */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-950 to-gray-900 border border-white/10 overflow-hidden">

                  {/* pulsing glow backdrop */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ opacity: [0.25, 0.55, 0.25] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: "radial-gradient(circle at 50% 55%, rgba(139,92,246,0.35) 0%, transparent 70%)",
                    }}
                  />

                  {/* outer ring of code tokens */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    {[
                      { text: "Rive", angle: 0 },
                      { text: "const", angle: 60 },
                      { text: "LLM", angle: 120 },
                      { text: "Stream", angle: 180 },
                      { text: "State", angle: 240 },
                      { text: "{ }", angle: 300 },
                    ].map(({ text, angle }) => {
                      const r = 90;
                      const rad = (angle * Math.PI) / 180;
                      const x = 50 + r * Math.sin(rad);
                      const y = 50 - r * Math.cos(rad);
                      return (
                        <span
                          key={text}
                          className="absolute text-[11px] font-mono font-bold text-violet-400/70 select-none"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                            textShadow: "0 0 8px rgba(139,92,246,0.8)",
                          }}
                        >
                          {text}
                        </span>
                      );
                    })}
                  </motion.div>

                  {/* middle dashed orbit */}
                  <div className="absolute inset-[30px] rounded-full border border-dashed border-indigo-500/20" style={{ animation: "spin 20s linear infinite reverse" }} />

                  {/* medium ring, counter-rotate */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    {[
                      { text: "useRive", angle: 36 },
                      { text: "=>{", angle: 108 },
                      { text: "prompt", angle: 180 },
                      { text: "export", angle: 252 },
                      { text: "JSON", angle: 324 },
                    ].map(({ text, angle }) => {
                      const r = 62;
                      const rad = (angle * Math.PI) / 180;
                      const x = 50 + r * Math.sin(rad);
                      const y = 50 - r * Math.cos(rad);
                      return (
                        <span
                          key={text}
                          className="absolute text-[10px] font-mono font-semibold text-purple-300/60 select-none"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                            textShadow: "0 0 6px rgba(168,85,247,0.7)",
                          }}
                        >
                          {text}
                        </span>
                      );
                    })}
                  </motion.div>

                  {/* binary data streams */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  >
                     {[
                      { text: "01001", angle: 45 },
                      { text: "11010", angle: 135 },
                      { text: "00111", angle: 225 },
                      { text: "10101", angle: 315 },
                    ].map(({ text, angle }) => {
                      const r = 42;
                      const rad = (angle * Math.PI) / 180;
                      const x = 50 + r * Math.sin(rad);
                      const y = 50 - r * Math.cos(rad);
                      return (
                        <span
                          key={angle}
                          className="absolute text-[8px] font-mono font-bold text-indigo-400/40 select-none opacity-60"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                          }}
                        >
                          {text}
                        </span>
                      );
                    })}
                  </motion.div>

                  {/* inner drifting fragments */}
                  {[
                    { text: "< />", x: 28, delay: 0 },
                    { text: "O(1)", x: 65, delay: 0.8 },
                    { text: "async", x: 48, delay: 1.6 },
                  ].map(({ text, x, delay }) => (
                    <motion.span
                      key={text}
                      className="absolute text-[10px] font-mono font-bold text-violet-300/50 select-none"
                      style={{
                        left: `${x}%`,
                        top: "30%",
                        transform: "translateX(-50%)",
                        textShadow: "0 0 5px rgba(139,92,246,0.6)",
                      }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
                    >
                      {text}
                    </motion.span>
                  ))}

                  {/* center label */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none"
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span
                      className="text-[9px] font-mono font-black tracking-[0.25em] uppercase select-none"
                      style={{
                        color: "rgba(167,139,250,1)",
                        textShadow: "0 0 14px rgba(139,92,246,1), 0 0 30px rgba(139,92,246,0.6)",
                      }}
                    >
                      FRONTEND & AI
                    </span>
                    <span
                      className="text-[9px] font-mono font-black tracking-[0.18em] uppercase select-none"
                      style={{
                        color: "rgba(167,139,250,1)",
                        textShadow: "0 0 14px rgba(139,92,246,1), 0 0 30px rgba(139,92,246,0.6)",
                      }}
                    >
                      ENGINEER
                    </span>
                  </motion.div>

                </div>

                {/* floating tech badges */}
                {[
                  { label: "React", top: "8%", left: "65%", color: "bg-cyan-500" },
                  { label: "AI", top: "75%", left: "75%", color: "bg-fuchsia-500" },
                  { label: "Rive", top: "80%", left: "15%", color: "bg-purple-500" },
                  { label: "TS", top: "15%", left: "8%", color: "bg-blue-500" },
                ].map((dot) => (
                  <div
                    key={dot.label}
                    className="absolute flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm rounded-full px-2.5 py-1"
                    style={{ top: dot.top, left: dot.left }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot.color}`} />
                    <span className="text-[10px] text-white/60 font-medium">{dot.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/25 tracking-[0.2em] uppercase">{t.hero.scroll}</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ══════════ PROJECTS ══════════ */}
      <section id="projects" className="px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-6xl mx-auto">

          {/* header */}
          <motion.div
            ref={projectsRef}
            variants={stagger}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 text-xs font-medium tracking-widest uppercase">
                <Code2 size={12} />
                {t.projects.badge}
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            >
              {t.projects.titleStart}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {t.projects.titleEnd}
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/45 text-base max-w-xl mx-auto"
            >
              {t.projects.description}
            </motion.p>
          </motion.div>

          {/* ── ELEVATED FEATURED PROJECT: OZZY (CENTERED VERTICAL STACK WITH RIVE CANVAS) ── */}
          <FeaturedOzzyCard t={t} />

          {/* ── TECHNICAL PROJECTS GRID (2×2) ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {baseProjects.map((p, i) => (
              <ProjectCard 
                key={p.link} 
                project={{ ...p, ...t.projects.cards[i] }} 
                index={i} 
                t={t}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* keyframes */}
      <style>{`
        @keyframes gradshift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
