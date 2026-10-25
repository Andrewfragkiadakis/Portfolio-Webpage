import { Mark } from '@/components/ui/Mark'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageLink from '@/components/work/LanguageLink'
import { LOCALES, localePath, type Locale } from '@/data/locales'

/**
 * The bar on the case-study pages: the same frosted 52px bar as the main nav, with the
 * name (home), the case-study index, the other language and the appearance toggle.
 */
export default function WorkHeader({ lang, name, navLabel, indexLabel, sub, onIndex = false }: {
    lang: Locale
    name: string
    navLabel: string
    indexLabel: string
    /** This page's path below the language root, e.g. "/work/zero-touch-onboarding". */
    sub: string
    onIndex?: boolean
}) {
    const other = LOCALES.find((l) => l.code !== lang) ?? LOCALES[0]
    return (
        <header className="fixed top-0 inset-x-0 z-50">
            <nav
                aria-label={navLabel}
                className="h-[var(--nav-h)] border-b border-[var(--nav-line)] text-[var(--foreground)] bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8] reduced-transparency:backdrop-blur-none reduced-transparency:bg-[var(--background)]"
            >
                <div className="h-full px-6 sm:px-10 md:px-[max(3rem,7vw)]">
                    <div className="mx-auto h-full max-w-[71rem] flex items-center justify-between gap-3 md:gap-6">
                        <a href={localePath(lang)} className="flex items-center gap-2.5 min-w-0 min-h-11 rounded-full">
                            <Mark size={30} alt="" className="-my-1" />
                            <span className="font-[family-name:var(--font-display)] text-[1.0625rem] md:text-[1.3125rem] font-semibold leading-none tracking-[0.011em] whitespace-nowrap truncate">
                                <span className="min-[25rem]:hidden">{name.split(' ')[0]}</span>
                                <span className="hidden min-[25rem]:inline">{name}</span>
                            </span>
                        </a>
                        <div className="flex items-center">
                            <a
                                href={localePath(lang, '/work')}
                                aria-current={onIndex ? 'page' : undefined}
                                className={`inline-flex items-center min-h-11 md:min-h-0 mr-2 md:mr-4 t-caption whitespace-nowrap transition-colors ${onIndex ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/65 hover:text-[var(--foreground)]'}`}
                            >
                                {indexLabel}
                            </a>
                            <LanguageLink href={localePath(other.code, sub)} code={other.code} short={other.short} label={`${other.short} — ${other.label}`} />
                            <ThemeToggle className="-mr-2.5 md:mr-0" />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

/** Right-pointing chevron, as in the deck's links (inline, so these pages ship no extra script). */
export function ChevronRight({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 8 14" className={`kn-chevron ${className}`} aria-hidden="true" fill="none">
            <path d="M1.5 1.5 6.5 7l-5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
