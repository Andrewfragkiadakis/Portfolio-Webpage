/**
 * Display helpers for the keynote layout. They only change how existing content is
 * typeset on the slides; the full strings still appear in the dialogs.
 */

const EMOJI = /\p{Extended_Pictographic}️?/gu

/**
 * "Plano Plus - Signs & Visual Identity" → { title: "Plano Plus", subtitle: "Signs & Visual Identity" }.
 * Splits on the first " - " or ": ", like apple.com's model name + descriptor, and drops
 * emoji so product names stay typographic.
 */
export function splitName(name: string): { title: string; subtitle?: string } {
    const clean = name.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim()
    const match = clean.match(/^(.+?)(?:\s+[-–—]\s+|:\s+)(.+)$/)
    if (!match) return { title: clean }
    return { title: match[1].trim(), subtitle: match[2].trim() }
}

/** Image description for a project: its name and descriptor, without separators or emoji. */
export function projectAlt(name: string): string {
    const { title, subtitle } = splitName(name)
    return [title, subtitle].filter(Boolean).join(', ')
}

/** "September 2024 – May 2026" → "2024 – 2026"; "2025" stays "2025". Non-year text (e.g. "Present") is kept. */
export function yearSpan(duration: string): string {
    const parts = duration.split(/\s[-–—]\s/)
    const years = parts.map((part) => part.match(/\d{4}/)?.[0] ?? part.trim())
    if (years.length === 1) return years[0]
    const [from, to] = [years[0], years[years.length - 1]]
    return from === to ? from : `${from} – ${to}`
}

/**
 * "Apple Fleet & IT Automation Engineer (Team Lead, Jamf & Automations)" →
 * { title: "Apple Fleet & IT Automation Engineer", qualifier: "Team Lead, Jamf & Automations" },
 * so the slide sets the title large and the qualifier as a quieter second line.
 */
export function splitRole(role: string): { title: string; qualifier?: string } {
    const match = role.match(/^(.+?)\s*\((.+)\)$/)
    return match ? { title: match[1].trim(), qualifier: match[2].trim() } : { title: role }
}

/** "University of West Attica, Athens, Greece" → "University of West Attica". */
export function shortPlace(place: string): string {
    return place.split(',')[0].trim()
}
