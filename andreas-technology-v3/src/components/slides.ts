import type { ComponentType } from 'react'
import type { SectionId } from '@/data/sections'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'
import TechSpecs from '@/components/dom/TechSpecs'
import Experience from '@/components/dom/Experience'
import Projects from '@/components/dom/Projects'
import Contact from '@/components/dom/Contact'

/**
 * The slide for every section id. Adding a slide: one id in SECTION_IDS (data/sections.ts),
 * its component here, and its nav label in both locales (`keynote.nav.sections`). The
 * types fail until all three exist.
 */
export const SLIDES: Record<SectionId, ComponentType> = {
    hero: HeroOverlay,
    about: About,
    services: Services,
    specs: TechSpecs,
    experience: Experience,
    projects: Projects,
    contact: Contact,
}
