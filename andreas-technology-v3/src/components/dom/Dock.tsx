'use client'

import type { ReactNode } from 'react'
import { useContent } from '@/hooks/useContent'
import { useActiveSection } from '@/hooks/useActiveSection'
import { scrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, sectionIndex } from '@/data/sections'
import { SECTION_APPS, LINK_APPS, type AppTile as AppTileData } from '@/data/apps'
import { RESUME_URL } from '@/data/content'
import { AppTile } from '@/components/ui/Window'

/** Icon + tooltip. Magnifies a little on hover, only when motion is welcome. */
function DockItem({ app, label, active, children }: { app: AppTileData; label: string; active?: boolean; children: (inner: ReactNode) => ReactNode }) {
    const inner = (
        <>
            <AppTile
                app={app}
                size="lg"
                className="transition-transform duration-200 ease-out origin-bottom motion-safe:group-hover:scale-[1.18] motion-safe:group-hover:-translate-y-1.5 motion-safe:group-focus-visible:scale-[1.12]"
            />
            <span className="os-tooltip" aria-hidden="true">{label}</span>
            <span
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--foreground)] transition-opacity ${active ? 'opacity-80' : 'opacity-0'}`}
                aria-hidden="true"
            />
        </>
    )
    return <li className="relative">{children(inner)}</li>
}

const ITEM = 'group relative flex items-end justify-center rounded-xl outline-offset-4'

/** Desktop dock: one app per section, then shortcuts to GitHub, LinkedIn and the CV. */
export default function Dock() {
    const t = useContent()
    const active = useActiveSection()

    return (
        <nav aria-label="Dock" className="hidden md:block fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
            <ul className="os-dock flex items-end gap-2.5 px-2.5 pt-2.5 pb-2.5 rounded-[1.375rem]">
                {SECTION_IDS.map((id) => (
                    <DockItem key={id} app={SECTION_APPS[id]} label={t.os.menus[id]} active={active === id}>
                        {(inner) => (
                            <button
                                type="button"
                                onClick={() => scrollToSection(sectionIndex(id), id)}
                                aria-label={t.os.menus[id]}
                                aria-current={active === id ? 'true' : undefined}
                                className={ITEM}
                            >
                                {inner}
                            </button>
                        )}
                    </DockItem>
                ))}

                <li className="self-stretch w-px my-1 bg-[var(--hairline-strong)]" aria-hidden="true" />

                <DockItem app={LINK_APPS.github} label={t.os.desktop.github}>
                    {(inner) => (
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub profile (${t.os.aria.newTab})`} className={ITEM}>
                            {inner}
                        </a>
                    )}
                </DockItem>
                <DockItem app={LINK_APPS.linkedin} label={t.os.desktop.linkedin}>
                    {(inner) => (
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile (${t.os.aria.newTab})`} className={ITEM}>
                            {inner}
                        </a>
                    )}
                </DockItem>
                <DockItem app={LINK_APPS.resume} label={t.os.desktop.resume}>
                    {(inner) => (
                        <a href={RESUME_URL} download aria-label={t.os.aria.resume} className={ITEM}>
                            {inner}
                        </a>
                    )}
                </DockItem>
            </ul>
        </nav>
    )
}
