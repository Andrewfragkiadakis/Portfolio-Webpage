'use client'

import type { ReactNode } from 'react'
import { useContent } from '@/hooks/useContent'
import { useDesktop } from '@/contexts/DesktopContext'
import { SECTION_IDS, type SectionId } from '@/data/sections'
import Icon, { type SymbolName } from '@/components/ui/Icon'

export const SECTION_SYMBOL: Record<SectionId, SymbolName> = {
    hero: 'desktop',
    about: 'person.crop.circle',
    services: 'slider.horizontal.3',
    experience: 'briefcase',
    projects: 'folder',
    contact: 'paperplane',
}

/** Finder source list: every window as a favourite, the current one selected. */
export function FinderSidebar({ current }: { current: SectionId }) {
    const t = useContent()
    const { launch } = useDesktop()
    return (
        <nav aria-label={t.os.favorites} className="px-2.5 pt-3 md:pt-0 pb-3">
            <p className="os-source-heading">{t.os.favorites}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-0.5">
                {SECTION_IDS.map((id) => (
                    <li key={id}>
                        {id === current ? (
                            <span aria-current="page" className="os-source-item">
                                <Icon name={SECTION_SYMBOL[id]} />
                                <span className="truncate">{t.os.menus[id]}</span>
                            </span>
                        ) : (
                            <button type="button" onClick={() => launch(id)} className="os-source-item">
                                <Icon name={SECTION_SYMBOL[id]} />
                                <span className="truncate">{t.os.menus[id]}</span>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

/** Finder path bar: drive › home › folder, then the item count and an optional action. */
export function PathBar({ folder, count, action }: { folder: string; count: number; action?: ReactNode }) {
    const t = useContent()
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 min-h-8 py-1.5 text-caption text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5 min-w-0">
                <Icon name="internaldrive" className="text-[0.875rem]" />
                <span>andreas</span>
                <Icon name="chevron.right" className="text-[0.5625rem]" />
                <Icon name="folder" className="text-[0.8125rem] text-[var(--accent-brand)]" />
                <span className="text-[var(--foreground)] font-medium truncate">{folder}</span>
                <span className="ml-2 tabular-nums whitespace-nowrap">{count} {t.os.items}</span>
            </span>
            {action}
        </div>
    )
}
