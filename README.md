# bexultan.space

Personal portfolio of Bexultan, frontend & AI engineer.

The page is one continuous scroll through a 3D landscape that moves from dusk, through the night, to sunrise. The landscape (sky, stars, the Almaty mountains, water and the floating orb) is a single WebGL2 fragment shader with no 3D library.

## Stack

- React 19 + Vite
- WebGL2, custom shader (`src/world/`)
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- Rive (`@rive-app/react-canvas`) for the Ozzy character
- Plain CSS (`src/styles.css`), fonts: Fraunces and Geist (Google Fonts), Jellee for the Ozzy wordmark

## Structure

```
src/
  App.jsx                 page layout and language switch (EN / RU)
  content.js              all copy, projects and links
  styles.css              all styles
  components/             Header, Hero, Intro, Ozzy, Work, Craft, Contact, WorldCanvas
  lib/scroll.js           Lenis setup + scroll-driven animation helpers (useScrub, useReveal)
  lib/scrollState.js      shared scroll progress read by the 3D world
  world/World.js          camera path, time-of-day moods, orb choreography, adaptive resolution
  world/shader.js         the GLSL shader
```

Each section has a `data-scene` attribute. The world reads where those sections sit on the page and blends the time of day and the orb position between them, so the scene stays in sync if sections change height.

## Editing

- Text and projects: `src/content.js`
- Colors of each time of day and the orb position per section: `MOODS` and `SCENES` in `src/world/World.js`
- Project screenshots live in `public/work/` (WebP, 1600px wide)

## Develop

```bash
npm install
npm run dev
npm run build
```

Respects `prefers-reduced-motion`: smooth scrolling and entrance animations are turned off and the scene moves more slowly.
