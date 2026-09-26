import { useContent } from '@/hooks/useContent'
import type { SectionId } from '@/data/sections'

/** Short nav label for every slide, in the current language. */
export function useSectionLabels(): Record<SectionId, string> {
    const nav = useContent().keynote.nav
    return {
        hero: nav.home,
        about: nav.about,
        services: nav.services,
        specs: nav.specs,
        experience: nav.experience,
        projects: nav.projects,
        contact: nav.contact,
    }
}
