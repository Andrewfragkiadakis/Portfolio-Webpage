/**
 * Single source of truth for the horizontal journey's geometry.
 *
 * The desktop track couples four numbers that must stay in sync:
 *   SECTION_COUNT sections → TRACK_HEIGHT_VH tall → TRACK_TRAVEL_VW of travel
 *   → scroll progress is divided by SECTION_STEPS to map to a section index.
 *
 * Change SECTION_IDS and everything else follows.
 */
export const SECTION_IDS = ['hero', 'about', 'services', 'experience', 'projects', 'contact'] as const

export type SectionId = (typeof SECTION_IDS)[number]

export const SECTION_COUNT = SECTION_IDS.length

/** Number of gaps between sections — progress 0..1 spans this many steps. */
export const SECTION_STEPS = SECTION_COUNT - 1

/** Scroll runway: one viewport per section. */
export const TRACK_HEIGHT_VH = SECTION_COUNT * 100

/** Horizontal distance travelled across the whole track. */
export const TRACK_TRAVEL_VW = SECTION_STEPS * 100

export function sectionIndex(id: SectionId): number {
    return SECTION_IDS.indexOf(id)
}
