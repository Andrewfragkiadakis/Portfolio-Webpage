'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Locale } from '@/data/locales'
import type { Content } from '@/data/content/types'

interface LocaleContextValue {
    locale: Locale
    copy: Content
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

/**
 * The page's language and its copy. The server picks both from the URL ("/" or "/el")
 * and passes only that language down, so the client never carries the other one.
 */
export function LocaleProvider({ locale, copy, children }: { locale: Locale; copy: Content; children: ReactNode }) {
    const value = useMemo(() => ({ locale, copy }), [locale, copy])
    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

function useLocaleContext() {
    const context = useContext(LocaleContext)
    if (!context) throw new Error('useLocale and useContent must be used within a LocaleProvider')
    return context
}

export function useLocale(): Locale {
    return useLocaleContext().locale
}

export function useCopy(): Content {
    return useLocaleContext().copy
}
