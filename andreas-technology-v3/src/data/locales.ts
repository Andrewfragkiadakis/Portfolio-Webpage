/** The site's languages. English lives at "/", Greek at "/el". */
export const LOCALES = [
    { code: 'en', label: 'English', short: 'EN', path: '/', ogLocale: 'en_GB' },
    { code: 'el', label: 'Ελληνικά', short: 'ΕΛ', path: '/el', ogLocale: 'el_GR' },
] as const

export type Locale = (typeof LOCALES)[number]['code']

export function isLocale(value: string): value is Locale {
    return LOCALES.some((locale) => locale.code === value)
}

/** The route's language, or a 404 for anything else (the routes are static, so this only guards types). */
export function toLocale(value: string): Locale {
    if (!isLocale(value)) throw new Error(`Unknown locale: ${value}`)
    return value
}

export function localeInfo(code: Locale) {
    return LOCALES.find((locale) => locale.code === code) ?? LOCALES[0]
}

/** A path inside a language: ('en', '/work') → "/work", ('el', '/work') → "/el/work", ('el') → "/el". */
export function localePath(code: Locale, sub = ''): string {
    const root = localeInfo(code).path
    if (!sub) return root
    return root === '/' ? sub : `${root}${sub}`
}
