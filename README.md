# Andreas Fragkiadakis – Portfolio

<div align="center">

[![Website](https://img.shields.io/badge/Website-andreas.technology-0071e3?style=for-the-badge&logo=google-chrome)](https://andreas.technology)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

Personal portfolio and CV for **Andreas Fragkiadakis**, Team Lead for Apple Fleet & IT Automation (M.Eng.). A product-launch-style site: seven slides on a horizontal track, bilingual EN/GR, light and dark.

---

## At a glance

![Feature map of andreas.technology: 100/100 accessibility, EN/GR bilingual, Next.js 16, compositor-first performance, the horizontal slide track, React 19, TypeScript 5, no animation library, full keyboard navigation, SEO built in, reduced-motion support, skip links and live regions, and a product-page UI of slides, sheets and dot navigation.](docs/bento-infographic.svg)

---

## Live site

**[andreas.technology](https://andreas.technology)** · Greek: **[andreas.technology/el](https://andreas.technology/el)**

---

## Features

- **Seven slides** – A horizontal track on desktop with native scroll snapping, dot navigation, arrow keys and trackpad swipes; a vertical stack on tablets and phones
- **Product-page design** – Neutral surfaces, one interactive blue, San Francisco / Inter type scale
- **Sheets, not pages** – Bio, roles, services and projects open in dialogs (bottom sheets you can swipe away on phones)
- **Bilingual** – English at `/`, Greek at `/el`, both server-rendered
- **Theme** – Light and dark, following the system until you choose
- **Fast** – No animation library: every animation is CSS on the compositor; the hero paints at first paint
- **Accessible** – WCAG 2.2 AA (axe-tested), keyboard navigation, visible focus, 44 px touch targets, reduced-motion and forced-colours support
- **SEO** – Canonical URLs, hreflang, JSON-LD (WebSite + Person), per-language Open Graph images, sitemap

---

## Tech stack

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2ead33?style=flat-square&logo=playwright)](https://playwright.dev/)

---

## Project structure

```
Portfolio-Webpage/
├── andreas-technology-v3/     # Next.js app (deploy root on Vercel)
│   ├── src/
│   │   ├── app/[lang]/        # One static page per language ("/" and "/el")
│   │   ├── components/        # dom/ (slides, nav), ui/ (shared pieces), slides.ts (registry)
│   │   ├── data/content/      # Copy: en.ts, el.ts, types.ts
│   │   ├── hooks/, utils/     # Scroll track, presence, storage, motion tokens
│   │   └── contexts/          # Theme and locale providers
│   ├── e2e/                   # Playwright tests (run with npm run check)
│   └── public/                # Images, favicons, files
└── docs/                      # Design notes, launch plan, performance log
```

See [`andreas-technology-v3/README.md`](andreas-technology-v3/README.md) for development.

---

## License

© 2026 Andreas Fragkiadakis. All rights reserved.
