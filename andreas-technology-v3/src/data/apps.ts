import type { SectionId } from '@/data/sections'

/**
 * The desktop's "apps". Every section is a window owned by an app with an original
 * Big Sur-style icon (see components/ui/AppIcon.tsx); the Terminal lives on the
 * Desktop space next to the Welcome window. Shortcut apps link out.
 */
export type WindowId = SectionId | 'terminal'
export type AppId = WindowId | 'github' | 'linkedin' | 'resume' | 'credential'

/** Windows in DOM (and keyboard) order. */
export const WINDOW_IDS: WindowId[] = ['hero', 'terminal', 'about', 'services', 'experience', 'projects', 'contact']

/** The space (section) each window lives on. */
export function sectionOf(id: WindowId): SectionId {
    return id === 'terminal' ? 'hero' : id
}

/** Service and skill tiles, in the order of `content.services` / `content.skills`: system-colour gradients. */
export const SERVICE_TINTS = [
    ['#FF8A80', '#E0303F'],
    ['#9DA7BA', '#4D5669'],
    ['#4FE3AE', '#0A9A6C'],
    ['#C79BFF', '#7437E6'],
    ['#FFC173', '#F0650F'],
    ['#7CC8FF', '#1F6BF0'],
] as const

/** Title-bar text of each window, from the content file's `os.windows`. */
export function windowTitle(windows: { welcome: string; terminal: string; about: string; services: string; experience: string; projects: string; contact: string }, id: WindowId): string {
    return id === 'hero' ? windows.welcome : windows[id]
}

/**
 * The app that owns a window, as the menu bar names it: "Services — Finder" → "Finder",
 * "About.app" → "About", the Terminal → "Terminal".
 */
export function appNameOf(title: string, id: WindowId, terminalName: string): string {
    if (id === 'terminal') return terminalName
    return title.includes(' — ') ? (title.split(' — ').pop() as string) : title.replace(/\.app$/, '')
}
