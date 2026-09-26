'use client'

import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import Window, { AppTile } from '@/components/ui/Window'
import { ToolTile } from '@/components/ui/ToolBadge'
import { SECTION_APPS, SERVICE_TILES, uiIcon } from '@/data/apps'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))


export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)
    const activeIndex = active ? t.services.indexOf(active) : -1

    return (
        <Window
            as="section"
            id="services"
            labelledBy="services-title"
            title={t.os.windows.services}
            app={SECTION_APPS.services}
            className="w-full md:max-w-[76rem] md:max-h-full"
            bodyClassName="flex"
            footer={
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-caption text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                        <i className="fas fa-hard-drive" aria-hidden="true" />
                        <span>andreas</span>
                        <i className="fas fa-chevron-right text-[0.5rem]" aria-hidden="true" />
                        <span className="text-[var(--foreground)] font-medium">{t.os.menus.services}</span>
                        <span className="ml-2">{t.services.length} {t.os.items}</span>
                    </span>
                    <span className="inline-flex items-center gap-3">
                        <span className="hidden sm:inline text-body-sm text-[var(--foreground)] caps-gr">{t.servicesCta}</span>
                        <button
                            type="button"
                            onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                            className="os-btn os-btn--primary h-8 px-3.5"
                        >
                            <span className="caps-gr">{t.servicesCtaButton}</span>
                            <i className="fas fa-arrow-right text-[0.625rem]" aria-hidden="true" />
                        </button>
                    </span>
                </div>
            }
        >
            <aside className="os-sidebar hidden lg:flex flex-col w-48 shrink-0 border-r border-[var(--hairline)] p-3 pt-4 gap-0.5">
                <p className="px-2 pb-1.5 text-caption font-semibold text-[var(--muted)]">{t.os.favorites}</p>
                {/* Finder-style sidebar: every window as a favourite; this one is selected. */}
                {SECTION_IDS.map((id) =>
                    id === 'services' ? (
                        <span key={id} aria-current="page" className="flex items-center gap-2 px-2 h-8 rounded-md text-body-sm font-semibold bg-[var(--control-hover)]">
                            <AppTile app={SECTION_APPS[id]} size="xs" />
                            {t.os.menus[id]}
                        </span>
                    ) : (
                        <button
                            key={id}
                            type="button"
                            onClick={() => scrollToSection(sectionIndex(id), id)}
                            className="flex items-center gap-2 px-2 h-8 rounded-md text-body-sm font-medium text-left hover:bg-[var(--control-hover)]"
                        >
                            <AppTile app={SECTION_APPS[id]} size="xs" />
                            {t.os.menus[id]}
                        </button>
                    )
                )}
            </aside>

            <div className="flex-1 min-w-0 p-4 sm:p-5 md:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <h2 id="services-title" className="os-eyebrow">{t.servicesTitle}</h2>
                    <p className="text-caption font-medium uppercase tracking-[0.08em] text-[var(--muted)]">{t.servicesSubtitle.replace(/^\/\/\s*/, '')}</p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {t.services.map((service: Service, index: number) => (
                        <li key={service.title}>
                            <button
                                type="button"
                                onClick={() => setActive(service)}
                                aria-label={`${service.title} — ${t.servicesLabels.details}`}
                                className="group os-card w-full h-full text-left p-4 flex flex-col gap-3 transition-[background-color,box-shadow] duration-200 hover:bg-[var(--accent-soft)] hover:shadow-[0_0_0_1px_var(--accent-brand)]"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="app-tile w-11 h-11 text-lg" style={{ background: SERVICE_TILES[index % SERVICE_TILES.length] }} aria-hidden="true">
                                        <i className={uiIcon(service.icon)} />
                                    </span>
                                    <span className="text-[0.9375rem] font-bold tracking-tight leading-tight caps-gr">{service.title}</span>
                                </span>
                                <span className="text-body-sm text-[var(--muted)] leading-relaxed line-clamp-3 md:line-clamp-4">{service.description}</span>
                                <span className="mt-auto flex items-center justify-between gap-3 pt-1">
                                    <span className="flex gap-1" aria-hidden="true">
                                        {toolsFor(service).slice(0, 5).map((tool) => (
                                            <ToolTile key={tool.label} tool={tool} className="[--tile:1.75rem] [--mark:1rem] [--mark-wide:1.375rem]" />
                                        ))}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-[var(--accent)]">
                                        <span className="caps-gr">{service.tools.length} {t.servicesLabels.tools}</span>
                                        <i className="fas fa-chevron-right text-[0.55rem] transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={t.projectsSection.close}
                title={t.os.windows.services}
                className="max-w-xl w-full"
            >
                {active && (
                    <div className="p-6 sm:p-7">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="app-tile w-14 h-14 text-2xl" style={{ background: SERVICE_TILES[Math.max(0, activeIndex) % SERVICE_TILES.length] }} aria-hidden="true">
                                <i className={uiIcon(active.icon)} />
                            </span>
                            <h3 id="service-modal-title" className="text-xl font-bold tracking-tight leading-tight caps-gr">
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{active.detail}</p>

                        <h4 className="os-eyebrow mb-2.5 caps-gr">{t.servicesLabels.highlights}</h4>
                        <ul className="space-y-2 mb-6">
                            {active.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm">
                                    <i className="fas fa-circle-check text-[var(--accent)] text-caption mt-1 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h4 className="os-eyebrow mb-2.5 caps-gr">{t.servicesLabels.toolkit}</h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {toolsFor(active).map((tool) => (
                                <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                    <ToolTile tool={tool} />
                                    <span className="text-body-sm leading-tight">{tool.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </Window>
    )
}
