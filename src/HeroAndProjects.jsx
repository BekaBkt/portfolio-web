import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, ExternalLink, Code2 } from "lucide-react";
import { translations } from "./translations";

/* ─────────── animation variants ─────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────── tech badge ─────────── */
const techColors = {
  React: "bg-cyan-500/10  border-cyan-500/30  text-cyan-400",
  JavaScript: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  Java: "bg-red-500/10 border-red-500/30 text-red-400",
  MySQL: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  Git: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  JIRA: "bg-blue-600/10 border-blue-600/30 text-blue-500",
  BitBucket: "bg-blue-400/10 border-blue-400/30 text-blue-400",
  "Tailwind CSS": "bg-teal-500/10  border-teal-500/30  text-teal-400",
  "HTML/CSS": "bg-orange-500/10 border-orange-500/30 text-orange-400",
  Tailwind: "bg-teal-500/10  border-teal-500/30  text-teal-400",
  Firebase: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  "Web Development": "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "UI/UX": "bg-purple-500/10 border-purple-500/30 text-purple-400",
  "Web App": "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  Frontend: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  CMS: "bg-gray-500/10 border-gray-500/30 text-gray-400",
  "Framer Motion": "bg-pink-500/10 border-pink-500/30 text-pink-400",
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

/* ─────────── projects data ─────────── */
const baseProjects = [
  {
    image: "/screenshots/absalute.jpg",
    tags: ["React", "Tailwind CSS"],
    link: "https://absalute.vercel.app/",
    borderHover: "hover:border-indigo-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(99,102,241,0.18)]",
  },
  {
    image: "/screenshots/cosmo.jpg",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    link: "https://www.cosmocode.studio/",
    borderHover: "hover:border-purple-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(168,85,247,0.18)]",
  },
  {
    image: "/screenshots/era-ophthalmica.jpg",
    tags: ["Web Development", "UI/UX"],
    link: "https://www.eraophthalmica.com/",
    borderHover: "hover:border-cyan-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(34,211,238,0.18)]",
  },
  {
    image: "/screenshots/pdw.jpg",
    tags: ["Frontend", "CMS"],
    link: "https://pdw.snc.mybluehost.me/",
    borderHover: "hover:border-rose-500/50",
    glow: "hover:shadow-[0_0_32px_rgba(244,63,94,0.18)]",
  },
];

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
          aria-label="Открыть проект"
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
          {project.tags.map((t) => <TechBadge key={t} tech={t} />)}
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

            {/* ── LEFT ── */}
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
                  {["React", "JavaScript", "Java", "MySQL", "Git", "JIRA", "BitBucket"].map((t) => (
                    <TechBadge key={t} tech={t} />
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
                    focus:ring-2 focus:ring-indigo-500/50
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

            {/* ── RIGHT: hologram ── */}
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

                  {/* ── pulsing glow backdrop ── */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ opacity: [0.25, 0.55, 0.25] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: "radial-gradient(circle at 50% 55%, rgba(139,92,246,0.35) 0%, transparent 70%)",
                    }}
                  />

                  {/* ── layer 1: outer ring of code tokens (28s) ── */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    {[
                      { text: "API", angle: 0 },
                      { text: "const", angle: 60 },
                      { text: "Node", angle: 120 },
                      { text: "JOIN", angle: 180 },
                      { text: "Props", angle: 240 },
                      { text: "{ }", angle: 300 },
                    ].map(({ text, angle }) => {
                      const r = 90; // px radius from center
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

                  {/* ── layer 1.5: middle dashed orbit ── */}
                  <div className="absolute inset-[30px] rounded-full border border-dashed border-indigo-500/20" style={{ animation: "spin 20s linear infinite reverse" }} />

                  {/* ── layer 2: medium ring, counter-rotate (18s) ── */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    {[
                      { text: "useEffect", angle: 36 },
                      { text: "=>{", angle: 108 },
                      { text: "map()", angle: 180 },
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

                  {/* ── layer 2.5: binary data streams ── */}
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

                  {/* ── layer 3: inner drifting fragments (y-oscillate) ── */}
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

                  {/* ── center label ── */}
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
                      CODE
                    </span>
                    <span
                      className="text-[9px] font-mono font-black tracking-[0.18em] uppercase select-none"
                      style={{
                        color: "rgba(167,139,250,1)",
                        textShadow: "0 0 14px rgba(139,92,246,1), 0 0 30px rgba(139,92,246,0.6)",
                      }}
                    >
                      ARCHITECTURE
                    </span>
                  </motion.div>

                </div>{/* end dark circle */}

                {/* floating tech badges (orbits) */}
                {[
                  { label: "React", top: "8%", left: "65%", color: "bg-cyan-500" },
                  { label: "JS", top: "75%", left: "75%", color: "bg-yellow-500" },
                  { label: "CSS", top: "80%", left: "15%", color: "bg-teal-500" },
                  { label: "UI", top: "15%", left: "8%", color: "bg-purple-500" },
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
            className="text-center mb-16"
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

          {/* 2×2 grid */}
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
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(20deg); }
          75%       { transform: rotate(-10deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
