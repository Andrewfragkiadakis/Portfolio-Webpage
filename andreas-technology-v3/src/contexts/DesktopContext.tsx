'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { WINDOW_IDS, sectionOf, type AppId, type WindowId } from '@/data/apps'
import { sectionIndex, type SectionId } from '@/data/sections'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { readActiveSection, useActiveSection } from '@/hooks/useActiveSection'
import { scrollToSection } from '@/utils/smooth-scroll'

/**
 * The window manager. It owns the z-order stack, which window is key (focused), and
 * whether each window is open, minimised to the Dock or closed. Windows register their
 * own handlers so that menu items and Dock clicks run the same animated code paths as
 * the traffic lights. Nothing is ever lost: every hidden window can be restored from
 * its Dock icon, from Window ▸ Restore All, or from the hint left in its place.
 *
 * Performance: the state lives in a small external store, not in context. Components
 * subscribe to exactly the slice they draw (`useDesktopState(s => s.status.about)`), so
 * focusing a window re-renders that window's frame and the menu bar, not the whole
 * page. The actions are a stable object in context and never cause a render.
 */

export type WindowStatus = 'open' | 'minimized' | 'closed'
export type ProjectsView = 'icons' | 'list'

export interface WindowHandlers {
    minimize: () => void
    close: () => void
    restore: () => void
    toggleZoom: () => void
}

export interface DesktopState {
    isDesktop: boolean | null
    /** The section (space) currently in front. */
    active: SectionId
    /** Back to front. */
    stack: WindowId[]
    keyId: WindowId | null
    status: Record<WindowId, WindowStatus>
    /** Increments on every status change of a window, so a window can tell fresh transitions apart. */
    statusCount: Record<WindowId, number>
    zoomed: Record<WindowId, boolean>
    /** Increments when the viewport is resized: windows snap back to their home positions. */
    layoutEpoch: number
    bounce: { app: AppId; n: number } | null
    projectsView: ProjectsView
    /** Mission Control: every space laid out side by side. */
    overview: boolean
}

export interface DesktopActions {
    setProjectsView: (view: ProjectsView) => void
    focus: (id: WindowId | null) => void
    setStatus: (id: WindowId, status: WindowStatus) => void
    setZoomed: (id: WindowId, zoomed: boolean) => void
    register: (id: WindowId, handlers: WindowHandlers) => () => void
    minimize: (id: WindowId) => void
    close: (id: WindowId) => void
    toggleZoom: (id: WindowId) => void
    restoreAll: () => void
    /** Bring a window forward the way a Dock click does: restore, travel to its space, bounce, focus. */
    launch: (id: WindowId) => void
    bounceApp: (app: AppId) => void
    setOverview: (open: boolean) => void
    getState: () => DesktopState
}

const allOpen = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, 'open'])) as Record<WindowId, WindowStatus>
const allZero = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, 0])) as Record<WindowId, number>
const noneZoomed = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, false])) as Record<WindowId, boolean>

const INITIAL: DesktopState = {
    isDesktop: null,
    active: 'hero',
    stack: ['terminal', 'about', 'services', 'experience', 'projects', 'contact', 'hero'],
    keyId: 'hero',
    status: allOpen(),
    statusCount: allZero(),
    zoomed: noneZoomed(),
    layoutEpoch: 0,
    bounce: null,
    projectsView: 'icons',
    overview: false,
}

/** Time for the horizontal journey to arrive before a restored window flies out of the Dock. */
const RESTORE_AFTER_TRAVEL_MS = 620

function createStore() {
    let state = INITIAL
    const listeners = new Set<() => void>()
    return {
        get: () => state,
        set(update: (s: DesktopState) => Partial<DesktopState> | null) {
            const patch = update(state)
            if (!patch) return
            let changed = false
            for (const k in patch) {
                if (patch[k as keyof DesktopState] !== state[k as keyof DesktopState]) { changed = true; break }
            }
            if (!changed) return
            state = { ...state, ...patch }
            listeners.forEach((l) => l())
        },
        subscribe(listener: () => void) {
            listeners.add(listener)
            return () => { listeners.delete(listener) }
        },
    }
}

type Store = ReturnType<typeof createStore>

const StoreContext = createContext<Store | undefined>(undefined)
const ActionsContext = createContext<DesktopActions | undefined>(undefined)

export function DesktopProvider({ children }: { children: ReactNode }) {
    const [store] = useState(createStore)
    const handlers = useRef(new Map<WindowId, WindowHandlers>())

    const isDesktop = useIsDesktop()
    const active = useActiveSection()

    const actions = useMemo<DesktopActions>(() => {
        const focus = (id: WindowId | null) =>
            store.set((s) => ({ keyId: id, stack: !id || s.stack[s.stack.length - 1] === id ? s.stack : [...s.stack.filter((w) => w !== id), id] }))

        const setStatus = (id: WindowId, next: WindowStatus) =>
            store.set((s) => ({
                status: s.status[id] === next ? s.status : { ...s.status, [id]: next },
                statusCount: { ...s.statusCount, [id]: s.statusCount[id] + 1 },
                // The frontmost open window left on the same space becomes key, like macOS.
                keyId:
                    next !== 'open' && s.keyId === id
                        ? ([...s.stack].reverse().find((w) => w !== id && sectionOf(w) === sectionOf(id) && s.status[w] === 'open') ?? null)
                        : s.keyId,
            }))

        const setZoomed = (id: WindowId, value: boolean) =>
            store.set((s) => (s.zoomed[id] === value ? null : { zoomed: { ...s.zoomed, [id]: value } }))

        const bounceApp = (app: AppId) => store.set((s) => ({ bounce: { app, n: (s.bounce?.n ?? 0) + 1 } }))

        const minimize = (id: WindowId) => {
            const h = handlers.current.get(id)
            if (h) h.minimize()
            else setStatus(id, 'minimized')
        }
        const close = (id: WindowId) => {
            const h = handlers.current.get(id)
            if (h) h.close()
            else setStatus(id, 'closed')
        }
        const restore = (id: WindowId) => {
            const h = handlers.current.get(id)
            if (h) h.restore()
            else setStatus(id, 'open')
        }
        const restoreAll = () => {
            const current = readActiveSection()
            for (const id of WINDOW_IDS) {
                if (store.get().status[id] === 'open') continue
                // Windows on the visible space animate out of the Dock; the rest simply reopen.
                if (sectionOf(id) === current) restore(id)
                else setStatus(id, 'open')
            }
        }
        const launch = (id: WindowId) => {
            const section = sectionOf(id)
            const current = readActiveSection()
            const travel = section !== current
            const hidden = store.get().status[id] !== 'open'
            if (store.get().overview) store.set(() => ({ overview: false }))
            if (travel || hidden) bounceApp(id)
            if (travel) scrollToSection(sectionIndex(section), section)
            if (hidden) {
                if (travel) window.setTimeout(() => restore(id), RESTORE_AFTER_TRAVEL_MS)
                else restore(id)
            }
            focus(id)
        }

        return {
            setProjectsView: (view) => store.set(() => ({ projectsView: view })),
            focus,
            setStatus,
            setZoomed,
            register: (id, h) => {
                handlers.current.set(id, h)
                return () => {
                    if (handlers.current.get(id) === h) handlers.current.delete(id)
                }
            },
            minimize,
            close,
            toggleZoom: (id) => handlers.current.get(id)?.toggleZoom(),
            restoreAll,
            launch,
            bounceApp,
            setOverview: (open) => store.set(() => ({ overview: open })),
            getState: store.get,
        }
    }, [store])

    // The window on the space in front becomes key when the visitor travels there.
    useEffect(() => {
        store.set((s) => ({
            active,
            keyId: s.keyId && sectionOf(s.keyId) === active && s.status[s.keyId] === 'open' ? s.keyId : s.status[active] === 'open' ? active : null,
        }))
    }, [active, store])

    // Phones have no Dock, so nothing may stay hidden there.
    useEffect(() => {
        store.set(() => (isDesktop === false ? { isDesktop, status: allOpen(), zoomed: noneZoomed(), overview: false } : { isDesktop }))
    }, [isDesktop, store])

    // Resizing resets positions (and zoom).
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>
        const onResize = () => {
            clearTimeout(timer)
            timer = setTimeout(() => store.set((s) => ({ layoutEpoch: s.layoutEpoch + 1 })), 150)
        }
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
            clearTimeout(timer)
        }
    }, [store])

    return (
        <StoreContext.Provider value={store}>
            <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
        </StoreContext.Provider>
    )
}

/** Stable window-manager actions. Never causes a re-render. */
export function useDesktopActions(): DesktopActions {
    const ctx = useContext(ActionsContext)
    if (!ctx) throw new Error('useDesktopActions must be used within a DesktopProvider')
    return ctx
}

/**
 * Subscribe to one slice of the window-manager state. The selector must return a
 * primitive or a reference that already lives in the state (never a new object).
 */
export function useDesktopState<T>(selector: (s: DesktopState) => T): T {
    const store = useContext(StoreContext)
    if (!store) throw new Error('useDesktopState must be used within a DesktopProvider')
    return useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(INITIAL))
}
