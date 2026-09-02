import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Globe, Send, ChevronRight, MessageSquare, Terminal, Check, Copy } from "lucide-react";
import { translations } from "./translations";

/* ─────────── animation variants ─────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

/* ─────────── checkbox option ─────────── */
function ServiceCheckbox({ id, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group select-none">
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
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("b.bakytkaliyev@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = "b.bakytkaliyev@gmail.com";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    } catch {
      alert(t.contact.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappText = lang === 'ru' 
    ? "Здравствуйте, Бексултан! Хочу обсудить разработку Frontend / AI проекта..." 
    : "Hello Bexultan! I'd like to discuss a Frontend / AI engineering project...";

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

      <div className="relative max-w-6xl mx-auto">
        {/* ══════════ Contact Section ══════════ */}
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
              className="rounded-3xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm p-8 sm:p-10 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-2.5">
                <Terminal size={18} className="text-indigo-400" />
                {t.contact.formTitle}
              </h3>

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
                  <input type="hidden" name="subject" value="Новая заявка с портфолио (Frontend & AI Engineer)" />
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
                    <div className="space-y-2.5">
                      <ServiceCheckbox id="service-web" label={t.contact.serviceWeb} />
                      <ServiceCheckbox id="service-ai" label={t.contact.serviceAI} />
                      <ServiceCheckbox id="service-interactive" label={t.contact.serviceInteractive} />
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
              <h3 className="text-xl font-semibold text-white flex items-center gap-2.5">
                <MessageSquare size={18} className="text-purple-400" />
                {t.contact.directTitle}
              </h3>

              {/* WhatsApp */}
              <motion.a
                href={`https://wa.me/77754202783?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 hover:bg-emerald-500/[0.14] hover:border-emerald-400/40 transition-all duration-300 select-none cursor-pointer"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-400">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base">WhatsApp</p>
                  <p className="text-emerald-400/80 text-sm mt-0.5">+7 775 420 27 83</p>
                </div>
                <ChevronRight size={18} className="text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>

              {/* Email (Copy to Clipboard) */}
              <motion.button
                type="button"
                onClick={handleCopyEmail}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full text-left group flex items-center gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer select-none ${
                  copied 
                    ? "bg-emerald-500/[0.12] border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.2)]" 
                    : "bg-indigo-500/[0.08] border border-indigo-500/20 hover:bg-indigo-500/[0.14] hover:border-indigo-400/40"
                }`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  copied
                    ? "bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                }`}>
                  {copied ? (
                    <Check size={28} className="text-emerald-400" />
                  ) : (
                    <Mail size={28} className="text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-base">Email</p>
                    {copied && (
                      <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        {lang === 'ru' ? "Скопировано!" : "Copied!"}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-0.5 truncate transition-colors duration-200 ${
                    copied ? "text-emerald-400 font-medium" : "text-indigo-400/80"
                  }`}>
                    b.bakytkaliyev@gmail.com
                  </p>
                </div>
                <div className="flex items-center">
                  {copied ? (
                    <Check size={18} className="text-emerald-400" />
                  ) : (
                    <Copy size={18} className="text-indigo-400/50 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                  )}
                </div>
              </motion.button>

              {/* Technical Consultation Note */}
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
