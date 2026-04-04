import { useRef, useState } from "react";
import { motion, useInView, useAnimationFrame, useMotionValue } from "framer-motion";
import { Mail, Video, Globe, Send, ChevronRight, PlayCircle, Users, Clapperboard, TrendingUp } from "lucide-react";
import { translations } from "./translations";

/* ─────────── animation variants ─────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─────────── animated section wrapper ─────────── */
function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────── video card ─────────── */
const VIDEO_SRCS = [
  "/videos/reel1.mp4",
  "/videos/reel2.mp4",
  "/videos/reel3.mp4",
];

function VideoCard({ index, t }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setPlaying(false);
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0d14] to-[#12101e] border border-purple-900/30 shadow-lg cursor-pointer"
      style={{ aspectRatio: "9/16" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* purple glow ring on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{ boxShadow: "0 0 40px 6px rgba(168,85,247,0.35), inset 0 0 0 1.5px rgba(168,85,247,0.5)" }}
      />

      {/* video element */}
      <video
        ref={videoRef}
        src={VIDEO_SRCS[index]}
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* play overlay — visible when paused, fades out on hover */}
      <div
        className={`
          absolute inset-0 z-20 flex flex-col items-center justify-center gap-3
          bg-gradient-to-br from-black/70 to-purple-950/60 rounded-2xl
          transition-opacity duration-400
          ${playing ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/40 scale-150" />
          <PlayCircle
            size={56}
            className="relative text-purple-400"
            style={{ filter: "drop-shadow(0 0 14px rgba(168,85,247,0.9))" }}
            strokeWidth={1.5}
          />
        </div>
        <span className="text-[11px] font-medium text-white/50 tracking-[0.15em] uppercase">
          {t.video.hoverPlay}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────── Infinite Marquee ─────────── */
const MARQUEE_ITEMS = [
  "Яндекс Музыка",
  "Жека Fatbelly",
  "Арман Юсупов",
  "Карина Оксукпаева",
  "Айтим Жакупов",
  "Jet.Kazakhstan",
  "Tanuki",
  "Ryadom.kz",
  "Малика Хо",
  "Данияр Джумадилов",
];

function InfiniteMarquee() {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const speed = 0.6; // px per frame

  useAnimationFrame(() => {
    if (!trackRef.current) return;
    const halfW = trackRef.current.scrollWidth / 2;
    const next = x.get() - speed;
    x.set(next <= -halfW ? 0 : next);
  });

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative w-full overflow-hidden py-4" aria-hidden>
      {/* left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #07070f, transparent)" }} />
      {/* right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #07070f, transparent)" }} />

      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex gap-3 w-max"
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/70 text-gray-300 text-sm font-medium whitespace-nowrap backdrop-blur-sm select-none"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────── checkbox option ─────────── */
function ServiceCheckbox({ id, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input type="checkbox" id={id} name="service" value={label} className="peer sr-only" />
        <div
          className="
            w-5 h-5 rounded-md border border-white/20 bg-white/5
            peer-checked:bg-indigo-600 peer-checked:border-indigo-500
            transition-all duration-200 flex items-center justify-center
          "
        >
          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{label}</span>
    </label>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function ServicesAndContact({ lang = 'ru' }) {
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(t.contact.errorMsg);
      }
    } catch (error) {
      alert(t.contact.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans py-24 px-4 sm:px-6 lg:px-8">
      {/* subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto space-y-24">

        {/* ══════════ BLOCK 1: Video Production ══════════ */}
        <AnimatedSection>
          {/* outer dark wrapper with subtle purple ambient */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #07070f 0%, #0d0a1a 60%, #07070f 100%)",
              boxShadow: "0 0 120px 0px rgba(126,34,206,0.12), inset 0 0 0 1px rgba(126,34,206,0.12)",
            }}
          >
            {/* subtle purple corner glow */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(126,34,206,0.10) 0%, transparent 70%)" }}
            />

            <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-14 pb-16 space-y-12">

              {/* pill badge */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-400 text-xs font-semibold tracking-widest uppercase">
                  <Video size={12} />
                  {t.video.badge}
                </span>
              </motion.div>

              {/* heading */}
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-center text-white leading-tight"
              >
                {t.video.titleStart}{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #c084fc, #a855f7, #7c3aed)" }}
                >
                  {t.video.titleEnd}
                </span>
              </motion.h2>

              {/* description */}
              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-2xl mx-auto text-center text-gray-400 text-base sm:text-lg leading-relaxed"
              >
                {t.video.descP1}
                <a
                  href="https://www.instagram.com/souliiixce"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                >
                  {t.video.descLink}
                </a>
                {t.video.descP2}
                <span className="text-white font-semibold">{t.video.descP3}</span>
                {t.video.descP4}
              </motion.p>

              {/* ── STATS BLOCK ── */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="rounded-2xl border border-purple-800/30 overflow-hidden"
                style={{ background: "rgba(88,28,135,0.08)" }}
              >
                {/* top: hero stat */}
                <div
                  className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-b border-purple-800/20"
                  style={{ background: "linear-gradient(180deg, rgba(126,34,206,0.13) 0%, transparent 100%)" }}
                >
                  <TrendingUp size={20} className="text-purple-400/70" />
                  <div className="flex items-end gap-2">
                    <span
                      className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight text-purple-400"
                      style={{
                        filter: "drop-shadow(0 0 28px rgba(168,85,247,0.7))",
                        textShadow: "0 0 40px rgba(168,85,247,0.5)",
                      }}
                    >
                      {t.video.stat1Number}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base font-medium tracking-wide">
                    {t.video.stat1Text}
                  </p>
                </div>

                {/* bottom: two supporting stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* stat 2 */}
                  <div className="flex items-start gap-4 p-6 sm:border-r border-purple-800/20">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(168,85,247,0.15)", boxShadow: "0 0 16px rgba(168,85,247,0.2)" }}
                    >
                      <Users size={18} className="text-purple-400" />
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {t.video.stat2P1}
                      <span className="text-white font-semibold">{t.video.stat2Highlight}</span>
                      {t.video.stat2P2}
                    </p>
                  </div>
                  {/* stat 3 */}
                  <div className="flex items-start gap-4 p-6">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(168,85,247,0.15)", boxShadow: "0 0 16px rgba(168,85,247,0.2)" }}
                    >
                      <Clapperboard size={18} className="text-purple-400" />
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {t.video.stat3P1}
                      <span className="text-white font-semibold">{t.video.stat3Highlight}</span>
                      {t.video.stat3P2}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── MARQUEE ── */}
              <motion.div variants={fadeUp} custom={4} className="-mx-6 sm:-mx-10 lg:-mx-16">
                <p className="text-center text-gray-600 text-xs uppercase tracking-widest mb-4 font-medium">{t.video.clients}</p>
                <InfiniteMarquee />
              </motion.div>

              {/* ── VIDEO GRID ── */}
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[0, 1, 2].map((i) => <VideoCard key={i} index={i} t={t} />)}
              </motion.div>

            </div>
          </div>

          {/* divider */}
          <div className="mt-20 border-t border-white/5" />
        </AnimatedSection>

        {/* ══════════ BLOCK 2: Contact ══════════ */}
        <AnimatedSection>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 text-xs font-medium tracking-widest uppercase">
              <Send size={12} />
              {t.contact.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 leading-tight"
          >
            {t.contact.titleStart}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {t.contact.titleEnd}
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} custom={2} className="max-w-xl mx-auto text-center text-white/50 text-base mb-14">
            {t.contact.description}
          </motion.p>

          {/* two-column layout */}
          <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ── LEFT: Form ── */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="rounded-3xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm p-8 sm:p-10"
            >
              <h3 className="text-xl font-semibold text-white mb-8">{t.contact.formTitle}</h3>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-emerald-400 font-medium text-lg leading-relaxed">{t.contact.successMsg}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="access_key" value="b188129f-374f-4eee-aea5-6e7b8e3f7cc0" />
                  <input type="hidden" name="subject" value="Новая заявка с портфолио" />
                  <input type="checkbox" name="botcheck" className="hidden" />

                  {/* name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-widest">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t.contact.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/70 focus:bg-indigo-500/5 transition-all duration-200"
                    />
                  </div>

                  {/* contact */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-widest">{t.contact.contactLabel}</label>
                    <input
                      type="text"
                      name="contact"
                      required
                      placeholder={t.contact.contactPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/70 focus:bg-indigo-500/5 transition-all duration-200"
                    />
                  </div>

                  {/* checkboxes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-3">{t.contact.serviceLabel}</label>
                    <div className="space-y-3">
                      <ServiceCheckbox id="service-web"   label={t.contact.serviceWeb} />
                      <ServiceCheckbox id="service-video" label={t.contact.serviceVideo} />
                    </div>
                  </div>

                  {/* textarea */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-widest">{t.contact.taskLabel}</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder={t.contact.taskPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/70 focus:bg-indigo-500/5 transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                    className={`
                      w-full py-4 px-6 rounded-xl
                      bg-gradient-to-r from-indigo-600 to-indigo-500
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-500 hover:to-indigo-400 cursor-pointer'}
                      text-white font-semibold text-sm tracking-wide
                      shadow-[0_0_24px_rgba(99,102,241,0.4)]
                      hover:shadow-[0_0_36px_rgba(99,102,241,0.6)]
                      transition-all duration-300 flex items-center justify-center gap-2
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.contact.submittingBtn}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t.contact.submitBtn}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* ── RIGHT: Direct Contacts ── */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-col justify-center space-y-6">
              <h3 className="text-xl font-semibold text-white">{t.contact.directTitle}</h3>

              {/* WhatsApp */}
              <motion.a
                href={`https://wa.me/905384114970?text=${encodeURIComponent("Здравствуйте, Бексултан! Я по поводу разработки сайта...")}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 hover:bg-emerald-500/[0.14] hover:border-emerald-400/40 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-400">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base">WhatsApp</p>
                  <p className="text-emerald-400/80 text-sm mt-0.5">+90 538 411 49 70</p>
                </div>
                <ChevronRight size={18} className="text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:b.bakytkaliyev@gmail.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 hover:bg-indigo-500/[0.14] hover:border-indigo-400/40 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <Mail size={28} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base">Email</p>
                  <p className="text-indigo-400/80 text-sm mt-0.5 truncate">b.bakytkaliyev@gmail.com</p>
                </div>
                <ChevronRight size={18} className="text-indigo-400/50 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>

              {/* info note */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 mt-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center">
                    <Globe size={14} className="text-indigo-400" />
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">
                    {t.contact.infoP1}
                    <span className="text-white/70 font-medium">{t.contact.infoHighlight1}</span>
                    {t.contact.infoP2}
                    <span className="text-white/70 font-medium">{t.contact.infoHighlight2}</span>{t.contact.infoP3}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
}
