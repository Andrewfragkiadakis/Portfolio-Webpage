'use client'

import { useContent } from '@/hooks/useContent'
import { useDesktop } from '@/contexts/DesktopContext'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import Window from '@/components/ui/Window'
import { ToolTile } from '@/components/ui/ToolBadge'
import { GlyphTile } from '@/components/ui/AppIcon'
import Icon, { symbolFor } from '@/components/ui/Icon'
import { FinderSidebar, PathBar } from '@/components/ui/Finder'
import { SERVICE_TINTS } from '@/data/apps'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

export default function Services() {
    const t = useContent()
    const { launch } = useDesktop()
    const [active, setActive] = useState<Service | null>(null)
    const activeIndex = active ? t.services.indexOf(active) : -1

    return (
        <Window
            wid="services"
            app="services"
            as="section"
            anchor="services"
            labelledBy="services-title"
            title={t.os.windows.services}
            subtitle={`${t.services.length} ${t.os.items}`}
            sidebar={<FinderSidebar current="services" />}
            className="w-full md:max-w-[76rem] md:max-h-full"
            footer={
                <PathBar
                    folder={t.os.menus.services}
                    count={t.services.length}
                    action={
                        <span className="inline-flex items-center gap-3">
                            <span className="hidden sm:inline text-body-sm text-[var(--foreground)] caps-gr">{t.servicesCta}</span>
                            <button type="button" onClick={() => launch('contact')} className="os-btn os-btn--primary">
                                <span className="caps-gr">{t.servicesCtaButton}</span>
                                <Icon name="arrow.right" />
                            </button>
                        </span>
                    }
                />
            }
        >
            <div className="p-4 sm:p-5 md:px-6 md:py-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <h2 id="services-title" className="os-eyebrow caps-gr">{t.servicesTitle}</h2>
                    <p className="text-caption uppercase tracking-[0.04em] text-[var(--muted)]">{t.servicesSubtitle.replace(/^\/\/\s*/, '')}</p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {t.services.map((service: Service, index: number) => (
                        <li key={service.title}>
                            <button
                                type="button"
                                onClick={() => setActive(service)}
                                aria-label={`${service.title} — ${t.servicesLabels.details}`}
                                className="group os-card w-full h-full text-left p-4 flex flex-col gap-3 transition-[background-color] duration-200 hover:bg-[var(--control-hover)]"
                            >
                                <span className="flex items-center gap-3">
                                    <GlyphTile symbol={symbolFor(service.icon)} tint={SERVICE_TINTS[index % SERVICE_TINTS.length]} size={40} />
                                    <span className="text-[0.9375rem] font-semibold tracking-[-0.01em] leading-tight caps-gr">{service.title}</span>
                                </span>
                                <span className="text-body-sm text-[var(--muted)] leading-relaxed line-clamp-3 md:line-clamp-4">{service.description}</span>
                                <span className="mt-auto flex items-center justify-between gap-3 pt-1">
                                    <span className="flex gap-1" aria-hidden="true">
                                        {toolsFor(service).slice(0, 5).map((tool) => (
                                            <ToolTile key={tool.label} tool={tool} className="[--tile:1.75rem] [--mark:1rem] [--mark-wide:1.375rem]" />
                                        ))}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-caption font-medium text-[var(--accent)]">
                                        <span className="caps-gr">{service.tools.length} {t.servicesLabels.tools}</span>
                                        <Icon name="chevron.right" className="text-[0.625rem] transition-transform motion-safe:group-hover:translate-x-0.5" />
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
                            <GlyphTile symbol={symbolFor(active.icon)} tint={SERVICE_TINTS[Math.max(0, activeIndex) % SERVICE_TINTS.length]} size={52} />
                            <h3 id="service-modal-title" className="text-xl font-bold tracking-[-0.015em] leading-tight caps-gr">
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{active.detail}</p>

                        <h4 className="os-eyebrow mb-2.5 caps-gr">{t.servicesLabels.highlights}</h4>
                        <ul className="space-y-2 mb-6">
                            {active.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm">
                                    <Icon name="checkmark.circle" className="text-[var(--accent)] text-base mt-0.5" />
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
