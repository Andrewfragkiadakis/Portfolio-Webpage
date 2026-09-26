import type { SectionId } from '@/data/sections'

/**
 * Each section is presented as an "app" on the desktop. These are original,
 * generic app tiles (a gradient square with a Font Awesome glyph), not any
 * vendor's icon artwork.
 */
export interface AppTile {
    /** Font Awesome class for the white glyph. */
    icon: string
    /** CSS background for the tile. */
    tile: string
}

export const SECTION_APPS: Record<SectionId, AppTile> = {
    hero: { icon: 'fas fa-house', tile: 'linear-gradient(160deg, #5BC0FF 0%, #0A66FF 100%)' },
    about: { icon: 'fas fa-user', tile: 'linear-gradient(160deg, #B79CFF 0%, #6A3DF0 100%)' },
    services: { icon: 'fas fa-toolbox', tile: 'linear-gradient(160deg, #4FE0B0 0%, #0E9F76 100%)' },
    experience: { icon: 'fas fa-timeline', tile: 'linear-gradient(160deg, #FFC857 0%, #F2711C 100%)' },
    projects: { icon: 'fas fa-folder-open', tile: 'linear-gradient(160deg, #7FD3FF 0%, #2F7DF6 100%)' },
    contact: { icon: 'fas fa-paper-plane', tile: 'linear-gradient(160deg, #FF8FB8 0%, #E0306E 100%)' },
}

/** Tiles for the shortcut apps in the dock and on the desktop. */
export const LINK_APPS = {
    github: { icon: 'fab fa-github', tile: 'linear-gradient(160deg, #3A3F47 0%, #16181C 100%)' },
    linkedin: { icon: 'fab fa-linkedin-in', tile: 'linear-gradient(160deg, #2B8CE0 0%, #0A5AB0 100%)' },
    resume: { icon: 'fas fa-file-lines', tile: 'linear-gradient(160deg, #FF7A6B 0%, #D93A2B 100%)' },
    credential: { icon: 'fas fa-award', tile: 'linear-gradient(160deg, #6FA8FF 0%, #1F4FD8 100%)' },
} satisfies Record<string, AppTile>

/**
 * Glyphs from the content file, made safe for the OS chrome: the interface is
 * macOS-*inspired*, so it never draws the Apple logo itself — a laptop stands in.
 */
export function uiIcon(icon: string): string {
    return icon === 'fab fa-apple' ? 'fas fa-laptop' : icon
}

/** Service cards get their own tile colours, in the order of `content.services`. */
export const SERVICE_TILES = [
    'linear-gradient(160deg, #FF8A7A 0%, #D83A4A 100%)',
    'linear-gradient(160deg, #9AA3B5 0%, #4A5263 100%)',
    'linear-gradient(160deg, #4FE0B0 0%, #0E9F76 100%)',
    'linear-gradient(160deg, #B79CFF 0%, #6A3DF0 100%)',
    'linear-gradient(160deg, #FFC857 0%, #F2711C 100%)',
    'linear-gradient(160deg, #7FD3FF 0%, #2F7DF6 100%)',
] as const
