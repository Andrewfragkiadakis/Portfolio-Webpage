/**
 * localStorage throws (SecurityError) when site data is blocked or inside sandboxed
 * frames, so every read and write goes through these guards.
 */
export function readStorage(key: string): string | null {
    try {
        return window.localStorage.getItem(key)
    } catch {
        return null
    }
}

export function writeStorage(key: string, value: string): void {
    try {
        window.localStorage.setItem(key, value)
    } catch {
        // Storage blocked: the preference lasts for this page only.
    }
}
