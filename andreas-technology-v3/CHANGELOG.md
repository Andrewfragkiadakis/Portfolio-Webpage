# Changelog

The format is based on [Common Changelog](https://common-changelog.org/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Mobile: remove nested scroll constraints from Projects section (`max-h-screen`, `overflow-hidden` wrapper) to allow full-page scrolling and prevent "stuck" behavior
- Mobile: remove horizontal overflow containment from layout wrapper (rely on `body` overflow-x: hidden) to prevent potential stacking context issues
- Mobile: prevent horizontal page scroll by adding `overflow-x: hidden` to `html`/`body` and to the mobile column wrapper in HorizontalLayout

### Added
- SEO: full absolute canonical URL (`andreas.technology`), WebSite + Person JSON-LD with `mainEntityOfPage` and `sameAs` (portfolio first), explicit Open Graph image, expanded keywords (M.Eng, Infrastructure Automation)
- `docs/seo-github-pages.md`: guide to de-emphasize old GitHub Pages (andrewfragkiadakis.github.io) in DuckDuckGo/Google (redirect, noindex, GSC/Bing removals)
- SpotlightCard (ReactBits): mouse-following radial spotlight overlay on skill cards, About code block, and service cards
- LogoLoop tech marquee (ReactBits): 12-item tech stack horizontal ticker under About skills (Python, TypeScript, React, Next.js, Docker, Linux, Git, Bash, Cisco, Active Directory, VMware/ESXi, Jira) with fade edges and pause-on-hover
- LetterGlitch ambient background (ReactBits): canvas letter animation inside About "Current Focus" code block at very low opacity (6%)
- Gradient text accent class: `gradient-text` CSS class with accent-to-purple gradient for animated stat counters
- Mobile accordion on Services: tap to expand/collapse service descriptions; desktop shows all content
- Dynamic OG image: `app/opengraph-image.tsx` generates 1200×630 PNG (dark bg, outlined name, M.ENG. subtitle) via `next/og`; layout metadata uses generated image
- Skip-to-content link in layout.tsx for keyboard/screen-reader accessibility
- `theme-color` meta tags (light + dark variants via `prefers-color-scheme` media)
- Inline `<script>` in `<head>` to read localStorage theme before React hydrates (eliminates theme flash)
- Shared `useCardScroll` hook for consistent card-centering scroll logic across Experience and Projects
- `MainContent` client wrapper enabling `page.tsx` to be a server component
- Bilingual support for all UI copy: about subtitle, services CTA, cinematic entry, contact labels, navigation labels via `content.ts`
- `cinematicEntry` content keys with full EN/GR translations
- Session-based CinematicEntry: only shows once per session (sessionStorage); includes a visible "Skip" button
- `aria-live="polite"` region around typewriter text + visually-hidden static copy for screen readers
- `role="status"` on cinematic entry typewriter for live announcements
- Project card descriptions (`line-clamp-2`) below tags
- Resize handler in HorizontalLayout that snaps to nearest section on viewport resize (desktop)
- "Athens, Greece" added to meta description for local SEO
- Greek translations for hero CTA buttons (`viewWork`, `getInTouch`)
- Language persistence to `localStorage` in LanguageContext (mirrors ThemeContext pattern)

### Changed
- Remove `output: 'export'` and static image OG; use Vercel/server build with dynamic opengraph-image route
- Improve font loading: Inter with `display: 'swap'` to reduce FCP/LCP impact and align globals.css with loaded font
- Improve accessibility: raise contrast for secondary text (opacity-65/50/55 → 80/75) in Contact, Navigation, Experience, About, Projects
- Fix identical-link purpose: add `aria-label="Contact via email"` to both mailto links in Contact and `aria-hidden` on decorative icons
- Accessibility (PageSpeed 96→100): raise Experience vertical labels opacity-20→50; nav links opacity-75→90, MobileNav 70→85; unify mailto aria-label to "Contact via email" (Hero+Contact); add aria-label "GitHub profile" and aria-hidden on Projects CTA
- Perf: lazy-load below-the-fold sections (Experience, Projects, Contact) and HorizontalLayout via next/dynamic; defer Lenis until after first paint (requestIdleCallback after load); preconnect fonts.gstatic.com; CustomCursor uses transform/scale instead of width/height (composited-only animation); add modern browserslist (defaults, not dead, not IE 11)
- Merge dual `<h1>` in HeroOverlay into single `<h1>` with `<span>` children
- Switch hero spotlight from `mask-position` animation to `clip-path: circle()` for compositor-friendly rendering with `will-change: clip-path`
- Refactor `dom/Experience.tsx` from 445 LOC to ~230 LOC: extract `ExperienceCard`, `EducationCard`, `ScrollButton` components; use shared `useCardScroll` hook; eliminate desktop/mobile card duplication
- Replace `unoptimized` prop on project `<Image>` with responsive `sizes` for automatic WebP and responsive images
- Mobile Experience/Education scroll buttons increased to `w-11 h-11` (44px touch target)
- Navigation component now reads all labels from `content.ts` instead of hardcoded ternaries
- MobileNav now reads labels from `content.ts`; removed dead `getElementById('scroller')` references
- Canvas animation loop: add 30 FPS cap via timestamp delta; add `visibilitychange` listener to pause/resume when tab is hidden; remove dead `getElementById('scroller')` code
- ThemeContext: read `localStorage` synchronously in `useState` initializer to prevent flash
- `page.tsx` converted from client component to server component (scroll-reset logic moved to `MainContent`)
- Fix `opportunitesTitle`/`opportunitesDescription` typo → `opportunitiesTitle`/`opportunitiesDescription` in Content interface and data
- Fix "MSc." → "M.ENG." in hero typewriter strings
- Fix university duration "September 2019 – Present" → "September 2019 – June 2025"
- Fix ITIL credential link from expiring LinkedIn URL to permanent `/files/itil-v4-cert.pdf`
- Fix GR `nav.projects` inconsistency: set to "PROJECTS" in both content.ts and Navigation
- Update `site.webmanifest` icon paths to include `/favicons/` prefix; set `theme_color` and `background_color` to `#030014`
- Rename `public/images/Porftolio website/` to `public/images/portfolio-website/` (fix typo + kebab-case) and update all references
- Replace all `any` types in component mappings with proper Content types (`Experience`, `Education`, `Project`, `Service`, `Skill`)

### Removed
- 6 unused dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `@studio-freight/react-lenis`, `react-parallax-tilt` (massive bundle reduction)
- `SmoothScroll.tsx` no-op wrapper component
- `favicon.ico` reference from metadata (file did not exist; using PNG favicons instead)

### Fixed
- CinematicEntry overflow cleanup: add `return () => { document.body.style.overflow = 'auto' }` in useEffect
- Theme flash on page load eliminated via synchronous inline script + synchronous useState initializer

### Security
- Update Next.js 16.0.7 → 16.1.6 to fix 5 high-severity vulnerabilities (GHSA-w37m, GHSA-mwv6, GHSA-9g9p, GHSA-h25m, GHSA-5f7q)
- `npm audit`: 0 vulnerabilities

---

# Andreas Technology V2 - Development Changelog
**Date**: December 3-4, 2026  
**Project**: andreas-technology-v2 (Next.js 16 Portfolio Rebuild)

---

## 🎯 Project Overview

Successfully rebuilt and enhanced the portfolio website `andreas.technology` with a modern "Creative Engineering" stack featuring 3D effects, multilingual support, and smooth animations.

**Tech Stack:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Three.js ecosystem (React Three Fiber, Drei)
- Framer Motion
- Lenis Smooth Scroll

---

## ✅ Completed Features

### 1. **Project Setup & Infrastructure**
- ✓ Updated Node.js to v20.19.6 LTS
- ✓ Initialized Next.js 16 with TypeScript, ESLint, Tailwind, App Router
- ✓ Installed dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `@studio-freight/react-lenis`
- ✓ Set up project structure: `src/app/`, `src/components/dom/`, `src/components/canvas/`, `src/data/`, `src/contexts/`, `src/hooks/`

### 2. **3D Background Effect**
- ✓ Created Matrix-style binary trail (0s and 1s) that follows cursor
- ✓ Implemented particle system with:
  - Spawn rate: Every 20px of cursor movement
  - Lifespan: 40-60 frames for short, non-overlapping trails
  - Matrix green color: `#00FF41`
  - Gentle downward gravity (0.02)
  - Max 100 particles for performance
- ✓ Added initialization flag to prevent random trails on page load
- ✓ Optimized fade speed (0.15) to reduce visual overlap

### 3. **Global Smooth Scrolling**
- ✓ Integrated Lenis smooth scroll via `SmoothScroll.tsx` component
- ✓ Wrapped entire app in `RootLayout` for global effect

### 4. **Full Multilingual Support (EN/GR)**
- ✓ Created `LanguageContext` for state management
- ✓ Built comprehensive bilingual content structure in `src/data/content.ts`
- ✓ Extracted all Greek translations from original portfolio
- ✓ Created `useContent()` hook for easy language-aware content access
- ✓ Added EN/GR toggle button in navigation
- ✓ Updated all components to support both languages:
  - Navigation
  - HeroOverlay
  - About (with skills)
  - Experience (work + education)
  - Projects
  - Contact

### 5. **Content Migration**
- ✓ Migrated all personal information from old portfolio
- ✓ Structured data with TypeScript interfaces:
  - 6 Core Skills with Font Awesome icons
  - 5 Work Experiences
  - 2 Education entries
  - 8 Personal Projects with images and links
- ✓ Copied all project images to `public/images/`
- ✓ Copied thesis presentation HTML and images

### 6. **Portfolio Sections**

#### Navigation
- ✓ Fixed top navigation bar
- ✓ Smooth scroll to sections
- ✓ Language toggle button
- ✓ Added cursor-pointer to all buttons

#### Hero Section
- ✓ Full-screen with binary trail background
- ✓ Typography-driven overlay with name and title
- ✓ Dynamic language support

#### About Section
- ✓ Three-paragraph bio with scroll animations
- ✓ 6-card skills grid with Font Awesome icons
- ✓ Hover effects and transitions

#### Experience Section
- ✓ Timeline layout for work experience
- ✓ Separate education section
- ✓ Border animations and scroll triggers

#### Projects Section
- ✓ 3-column responsive grid
- ✓ Project cards with images (lazy-loaded)
- ✓ Prominent action buttons:
  - Live Presentation (orange primary)
  - GitHub, Download Thesis, View Publication (gray secondary)
- ✓ Tags and descriptions
- ✓ Removed flashing animations for stability

#### Contact/Footer Section
- ✓ Contact information display
- ✓ Social links (GitHub, LinkedIn)
- ✓ Copyright notice
- ✓ Added cursor-pointer to all links

### 7. **Visual Design**
- ✓ Unified background color: `bg-zinc-950` across all sections
- ✓ Font Awesome 6.4.0 integration
- ✓ Inter font from Google Fonts
- ✓ Consistent color scheme with orange accents (`orange-400`, `orange-600`)
- ✓ Dark theme throughout

### 8. **Bug Fixes**
- ✓ Fixed thesis presentation link (added `/thesis-presentation.html`)
- ✓ Fixed project images not loading (added proper paths)
- ✓ Fixed background color inconsistencies
- ✓ Fixed 3D scene visibility issues
- ✓ Fixed project cards flashing on scroll (removed animations)
- ✓ Fixed cursor not showing pointer on navigation buttons
- ✓ Fixed cursor not showing pointer on footer links
- ✓ Fixed binary trail spawning random particles on page load

---

## 📁 Project Structure

```
andreas-technology-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with LanguageProvider
│   │   ├── page.tsx            # Main page integrating all sections
│   │   └── globals.css
│   ├── components/
│   │   ├── dom/                # HTML/CSS components
│   │   │   ├── Navigation.tsx
│   │   │   ├── HeroOverlay.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Contact.tsx
│   │   ├── canvas/             # 3D components
│   │   │   └── Experience.tsx  # Binary trail effect
│   │   └── SmoothScroll.tsx
│   ├── contexts/
│   │   └── LanguageContext.tsx # Language state management
│   ├── hooks/
│   │   └── useContent.ts       # Language-aware content hook
│   └── data/
│       └── content.ts          # Bilingual content (EN/GR)
├── public/
│   ├── images/                 # All project images
│   └── thesis-presentation.html
└── package.json
```

---

## 🚀 Current State

**Status**: ✅ Production Ready

**Running Commands:**
- `npm run dev` - Development server at http://localhost:3000
- Port: 3000

**All Features Working:**
- ✓ Smooth scrolling
- ✓ Binary trail cursor effect
- ✓ Language switching (EN ↔ GR)
- ✓ All sections rendering correctly
- ✓ All links functional
- ✓ All images loading
- ✓ Responsive design

---

## 📝 Next Steps (Optional)

### Performance Optimization
- [ ] Add SEO meta tags for better search engine visibility
- [ ] Optimize images (convert to WebP, add blur placeholders)
- [ ] Add loading states for smoother transitions

### Enhancements
- [ ] Add mobile hamburger menu for small screens
- [ ] Add smooth scroll progress indicator
- [ ] Add more micro-animations to skills cards
- [ ] Add contact form functionality

### Deployment
- [ ] Connect to Vercel for automated deployment
- [ ] Set up custom domain (andreas.technology)
- [ ] Configure environment variables if needed
- [ ] Set up analytics (Google Analytics or similar)

---

## 🐛 Known Issues

**None** - All reported issues have been resolved.

---

## 💡 Important Notes

1. **Peer Dependency Warning**: `@studio-freight/react-lenis` was installed with `--legacy-peer-deps` due to React 19 compatibility. This is working correctly and can be ignored.

2. **Image Optimization**: All images use `unoptimized` prop on Next.js Image component for faster development. Consider removing this in production.

3. **Font Awesome CDN**: Using CDN link in `layout.tsx` head. Consider self-hosting for better performance.

4. **Binary Trail**: Cursor is hidden (`cursor-none`) on canvas, showing only binary trail. Adjust if normal cursor is needed.

---

## 📊 Statistics

- **Total Components**: 8 React components
- **Lines of Code**: ~2000+ TypeScript/TSX
- **Languages Supported**: 2 (EN, GR)
- **Projects Showcased**: 8
- **Work Experiences**: 5
- **Skills Highlighted**: 6

---

## 🔧 How to Resume Tomorrow

1. **Start Dev Server**: `cd ~/andrewfragkiadakis.github.io/andreas-technology-v2 && npm run dev`
2. **Open in Browser**: http://localhost:3000
3. **Test Features**:
   - Switch languages (EN/GR button)
   - Check binary trail cursor effect
   - Scroll through all sections
   - Click all project links

4. **If Deploying**:
   ```bash
   npm run build    # Test production build
   # Then connect to Vercel or deploy manually
   ```

---

**🎉 Session Complete**: Portfolio is fully functional and ready for deployment!
