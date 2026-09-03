/**
 * View Transitions API helper.
 *
 * The browser snapshots the old DOM, applies `update()`, then animates between the two
 * states on the compositor. That is strictly better than animating the same moment by
 * hand in JS — but it is progressive enhancement, so every path here has to end with the
 * DOM updated whether or not the API exists.
 */

type ViewTransitionCapableDocument = Document & {
    startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> }
}

function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Run `update` inside a view transition when the browser supports one.
 *
 * Falls back to calling `update` directly on Firefox/older Safari and whenever the user
 * has asked for reduced motion. Never throws: a failed transition still commits the
 * update, because the alternative is a UI frozen in its old state.
 */
export function startViewTransition(update: () => void): void {
    const doc = typeof document !== 'undefined' ? (document as ViewTransitionCapableDocument) : undefined

    if (!doc || typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
        update()
        return
    }

    try {
        doc.startViewTransition(update)
    } catch {
        update()
    }
}

/**
 * Same as `startViewTransition`, but stamps a class on `<html>` for the duration so CSS
 * can select a specific animation for this transition rather than the global default.
 */
export function startNamedViewTransition(name: string, update: () => void): void {
    const doc = typeof document !== 'undefined' ? (document as ViewTransitionCapableDocument) : undefined

    if (!doc || typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
        update()
        return
    }

    const root = doc.documentElement
    root.dataset.viewTransition = name

    try {
        const transition = doc.startViewTransition(update)
        transition.finished
            .catch(() => { /* a skipped transition is not a failure */ })
            .finally(() => { delete root.dataset.viewTransition })
    } catch {
        delete root.dataset.viewTransition
        update()
    }
}
