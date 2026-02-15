# Andreas Fragkiadakis – Portfolio

<div align="center">

[![Website](https://img.shields.io/badge/Website-andreas.technology-4f46e5?style=for-the-badge&logo=google-chrome)](https://andreas.technology)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

Personal portfolio and CV for **Andreas Fragkiadakis** (IT & Security Engineer, M.Eng.). Horizontal-scroll layout, blob cursor, bilingual EN/GR, and modern UI—live at **[andreas.technology](https://andreas.technology)**.

---

## Contents

- [Preview](#-preview)
- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Project structure](#-project-structure)
- [License](#-license)

---

## Preview

**[→ View live site](https://andreas.technology)**

| Light | Dark |
|-------|------|
| Clean, minimal layout | Same layout with dark theme |

*Add a screenshot or GIF here if you like—e.g. from [andreas.technology](https://andreas.technology).*

---

## Features

- **Horizontal scroll** – Section-based layout with snap and smooth scroll
- **Blob cursor** – Configurable trail on hero name with LetterGlitch inside the letters
- **SpotlightCard & LogoLoop** – Mouse-follow spotlight on cards; tech-stack marquee in About
- **Framer Motion** – Scroll and hover animations
- **Bilingual** – English / Greek with persisted preference
- **Theme** – Light and dark mode
- **SEO** – Canonical URL, JSON-LD (WebSite + Person), Open Graph, sitemap

---

## Tech stack

| Category   | Tech |
|-----------|------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language  | [TypeScript](https://www.typescriptlang.org/) |
| Styling   | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons     | [Font Awesome](https://fontawesome.com/) |

---

## Getting started

```bash
git clone https://github.com/Andrewfragkiadakis/Portfolio-Webpage.git
cd Portfolio-Webpage/andreas-technology-v3
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script        | Description        |
|---------------|--------------------|
| `npm run dev` | Start dev server   |
| `npm run build` | Production build |
| `npm run start` | Run production build |

---

## Project structure

```
Portfolio-Webpage/
├── andreas-technology-v3/     # Next.js app (deploy this, e.g. Vercel)
│   ├── src/
│   │   ├── app/               # App Router, layout, globals
│   │   ├── components/       # dom/, ui/
│   │   ├── data/              # content.ts (EN/GR)
│   │   └── ...
│   └── public/
└── README.md
```

---

## License

© 2026 Andreas Fragkiadakis. All rights reserved.

---

<p align="center">
  <sub>Crafted with TypeScript, Framer Motion & Tailwind</sub>
</p>
