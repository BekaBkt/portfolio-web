// All copy for the site, in English and Russian.

export const projects = [
  { id: "cosmo", image: "/work/cosmo.webp", width: 1600, height: 927, link: "https://www.cosmocode.studio/", host: "cosmocode.studio", stack: ["React", "Tailwind CSS", "Framer Motion"] },
  { id: "absolut", image: "/work/absolut.webp", width: 1600, height: 918, link: "https://absalute.vercel.app/", host: "absalute.vercel.app", stack: ["React", "TypeScript", "Tailwind CSS"] },
  { id: "era", image: "/work/era.webp", width: 1600, height: 930, link: "https://www.eraophthalmica.com/", host: "eraophthalmica.com", stack: ["React", "Tailwind CSS"] },
  { id: "ozzySite", image: "/work/ozzy-site.webp", width: 1600, height: 929, link: "https://www.ozzyfocus.app/", host: "ozzyfocus.app", stack: ["React", "TypeScript", "Tailwind CSS"] },
];

export const links = {
  appStore: "https://apps.apple.com/kz/app/ozzy-adhd-focus-pal/id6760987195",
  ozzySite: "https://www.ozzyfocus.app/",
  whatsapp: "77754202783",
  phoneLabel: "+7 775 420 27 83",
  email: "b.bakytkaliyev@gmail.com",
};

export const content = {
  en: {
    meta: { title: "Bexultan — Frontend & AI engineer" },
    nav: { work: "Work", ozzy: "Ozzy", contact: "Contact", skip: "Skip to content" },
    hero: {
      name: "Bexultan",
      role: "Frontend & AI engineer",
      lead: "I build calm, fast interfaces for the web and mobile: React apps, Rive animations and AI features that feel alive.",
      primary: "See my work",
      secondary: "Get in touch",
      place: "Between Almaty and Istanbul",
      status: "Open to new work",
      scroll: "Scroll",
    },
    intro:
      "I like the quiet moment between a tap and a response. That's where I work: React interfaces that stay quick when the data gets heavy, motion that shows what changed, and AI features that help without getting in the way.",
    ozzy: {
      title: "Ozzy",
      tagline: "A focus pal for ADHD brains.",
      body:
        "Ozzy is an iOS app that helps people with ADHD start tasks and stay with them. I co-founded it with Ali Jalal and lead the front end: the app interface, the Ozzy character built as a Rive state machine, and the AI features that talk back.",
      caption: "The Ozzy character, running live in Rive.",
      appStore: "Download on the App Store",
      site: "Visit ozzyfocus.app",
      stack: ["React Native", "TypeScript", "Rive", "LLM APIs"],
    },
    work: {
      title: "Selected work",
      lead: "Products and websites I've built recently.",
      visit: "Visit site",
      of: "of",
      items: {
        cosmo: { title: "Cosmo Code Studio", text: "The studio I co-founded. I built the site, its motion system and the design system behind our client work." },
        absolut: { title: "TB Absolut-Service", text: "Website for a rail logistics company in Kazakhstan, with a bilingual layout that works on every screen." },
        era: { title: "Era Ophthalmica", text: "Website for a medical project helping patients with central vision loss, built from modular components." },
        ozzySite: { title: "Ozzy website", text: "The landing site for Ozzy, written to explain the app in seconds and send people to the App Store." },
      },
    },
    craft: {
      title: "What I bring to a team",
      items: [
        { title: "Interfaces", text: "Production React and Next.js front ends in TypeScript, with component systems that stay consistent as the product grows.", stack: "React, Next.js, TypeScript, Tailwind CSS, React Native" },
        { title: "Motion", text: "Rive state machines, Framer Motion and WebGL. Animation that explains what changed instead of decorating.", stack: "Rive, Framer Motion, WebGL, Figma" },
        { title: "AI features", text: "Assistant and chat features on top of LLM APIs, with streaming responses and interfaces people can trust.", stack: "LLM APIs, Streaming UI, Cursor, Claude" },
      ],
      note: "The landscape behind this page is a single WebGL shader, rendered live in your browser.",
    },
    contact: {
      title: "Let's build something that feels good to use.",
      lead: "Tell me about your project or role. I usually reply within a few hours.",
      form: {
        name: "Name",
        namePh: "Your name",
        reach: "Email or phone",
        reachPh: "How should I reply?",
        topics: "What do you need?",
        topicList: ["Frontend / web app", "AI / LLM features", "Rive / interactive animation"],
        message: "Message",
        messagePh: "A few lines about the project, timeline or team",
        send: "Send message",
        sending: "Sending…",
        success: "Message sent. I'll get back to you soon.",
        error: "The message didn't go through. Check your connection and try again, or write to me on WhatsApp.",
        subject: "New message from bexultan.space",
      },
      direct: "Or reach me directly",
      whatsapp: "WhatsApp",
      copyEmail: "Copy email",
      copied: "Copied",
      remote: "Working remotely with teams worldwide.",
      whatsappText: "Hello Bexultan! I'd like to talk about a project.",
    },
    footer: { built: "Built with React, WebGL and Rive.", top: "Back to top" },
  },

  ru: {
    meta: { title: "Бексултан — Frontend & AI инженер" },
    nav: { work: "Работы", ozzy: "Ozzy", contact: "Контакты", skip: "Перейти к содержанию" },
    hero: {
      name: "Бексултан",
      role: "Frontend & AI инженер",
      lead: "Создаю спокойные и быстрые интерфейсы для веба и мобильных: приложения на React, анимации на Rive и AI-функции, которые ощущаются живыми.",
      primary: "Смотреть работы",
      secondary: "Написать мне",
      place: "Между Алматы и Стамбулом",
      status: "Открыт к новым проектам",
      scroll: "Листайте",
    },
    intro:
      "Мне нравится тихий момент между нажатием и ответом. Там я и работаю: интерфейсы на React, которые остаются быстрыми под нагрузкой, анимация, которая показывает, что изменилось, и AI-функции, которые помогают и не мешают.",
    ozzy: {
      title: "Ozzy",
      tagline: "Помощник фокуса для людей с СДВГ.",
      body:
        "Ozzy — iOS-приложение, которое помогает людям с СДВГ начинать задачи и доводить их до конца. Я сооснователь проекта вместе с Али Джалалом и отвечаю за фронтенд: интерфейс приложения, персонажа Ozzy на стейт-машине Rive и AI-функции, которые отвечают пользователю.",
      caption: "Персонаж Ozzy, вживую в Rive.",
      appStore: "Загрузить в App Store",
      site: "Открыть ozzyfocus.app",
      stack: ["React Native", "TypeScript", "Rive", "LLM API"],
    },
    work: {
      title: "Избранные работы",
      lead: "Продукты и сайты, которые я сделал за последнее время.",
      visit: "Открыть сайт",
      of: "из",
      items: {
        cosmo: { title: "Cosmo Code Studio", text: "Студия, которую мы основали с партнёром. Я сделал сайт, систему анимаций и дизайн-систему для наших клиентских проектов." },
        absolut: { title: "ТБ Абсолют-Сервис", text: "Сайт железнодорожной логистической компании в Казахстане, двуязычный и удобный на любом экране." },
        era: { title: "Era Ophthalmica", text: "Сайт медицинского проекта для пациентов с потерей центрального зрения, собранный из модульных компонентов." },
        ozzySite: { title: "Сайт Ozzy", text: "Лендинг приложения Ozzy: за несколько секунд объясняет, что это, и ведёт в App Store." },
      },
    },
    craft: {
      title: "Что я приношу в команду",
      items: [
        { title: "Интерфейсы", text: "Продакшн-фронтенд на React и Next.js с TypeScript и компонентные системы, которые остаются цельными по мере роста продукта.", stack: "React, Next.js, TypeScript, Tailwind CSS, React Native" },
        { title: "Анимация", text: "Стейт-машины Rive, Framer Motion и WebGL. Анимация, которая объясняет изменения, а не украшает.", stack: "Rive, Framer Motion, WebGL, Figma" },
        { title: "AI-функции", text: "Ассистенты и чаты на базе LLM API со стримингом ответов и интерфейсом, которому доверяют.", stack: "LLM API, Стриминг, Cursor, Claude" },
      ],
      note: "Пейзаж за этой страницей — один WebGL-шейдер, который рендерится прямо в вашем браузере.",
    },
    contact: {
      title: "Давайте сделаем то, чем приятно пользоваться.",
      lead: "Расскажите о проекте или вакансии. Обычно отвечаю в течение нескольких часов.",
      form: {
        name: "Имя",
        namePh: "Как вас зовут",
        reach: "Email или телефон",
        reachPh: "Куда ответить?",
        topics: "Что нужно сделать?",
        topicList: ["Frontend / веб-приложение", "AI / LLM-функции", "Rive / интерактивная анимация"],
        message: "Сообщение",
        messagePh: "Пара строк о проекте, сроках или команде",
        send: "Отправить",
        sending: "Отправляю…",
        success: "Сообщение отправлено. Скоро отвечу.",
        error: "Сообщение не отправилось. Проверьте соединение и попробуйте снова или напишите мне в WhatsApp.",
        subject: "Новое сообщение с bexultan.space",
      },
      direct: "Или напишите напрямую",
      whatsapp: "WhatsApp",
      copyEmail: "Скопировать email",
      copied: "Скопировано",
      remote: "Работаю удалённо с командами по всему миру.",
      whatsappText: "Здравствуйте, Бексултан! Хочу обсудить проект.",
    },
    footer: { built: "Сделано на React, WebGL и Rive.", top: "Наверх" },
  },
};
