'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Education, Experience as Role } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { ToolTile } from '@/components/ui/ToolBadge'
import { TOOL_BY_LABEL, type Tool, type ToolLabel } from '@/data/tools'
import { ArrowOut, Chevron, Headline, Parallax, Rise } from '@/components/ui/keynote'

/** The stack named in the current role's own task list. */
const NOW_STACK: ToolLabel[] = ['Jamf Pro', 'Bash / zsh', 'Python', 'TypeScript', 'MCP Servers', "acme.sh / Let's Encrypt"]
const nowStack = NOW_STACK.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

function Check() {
    return (
        <svg viewBox="0 0 16 16" className="w-4 h-4 mt-[0.2em] shrink-0 text-[var(--accent)]" aria-hidden="true" fill="none">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/**
 * Slide 4 — "Then. Now." The current role is the hero card; earlier roles run down a
 * timeline rail and education and credentials sit beside it. Every row opens a dialog
 * with the full detail, so the slide itself never needs to scroll.
 */
export default function Experience() {
    const t = useContent()
    const k = t.keynote
    const [role, setRole] = useState<Role | null>(null)
    const [edu, setEdu] = useState<Education | null>(null)

    const [current, ...earlier] = t.experience

    return (
        <section
            id="experience"
            aria-labelledby="experience-title"
            className="relative w-full md:h-full flex items-center px-5 sm:px-10 md:px-[max(3rem,6vw)] py-20 md:py-0"
        >
            <div className="mx-auto w-full max-w-[76rem]">
                <Parallax depth={-0.05}>
                    <Rise>
                        <p className="kn-eyebrow">{k.experience.eyebrow}</p>
                    </Rise>
                    <Headline
                        id="experience-title"
                        text={k.experience.headline}
                        className="mt-3 text-[clamp(2.5rem,12vw,4.5rem)] md:text-[min(5.6vw,9vh)]"
                    />
                </Parallax>

                <div className="mt-8 md:mt-[min(4.5vh,2.75rem)] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-x-[2.6vw]">
                    {/* Now — the hero card, outlined in the signature gradient. */}
                    <Parallax depth={0.06} className="md:col-span-5">
                        <Rise delay={0.15} className="h-full rounded-[1.75rem] p-[1.5px] bg-[image:var(--grad)]">
                            <article className="h-full rounded-[calc(1.75rem-1.5px)] bg-[var(--background)] p-6 md:p-[min(2.4vw,4vh)] flex flex-col" aria-labelledby="now-role">
                                <div className="flex items-baseline justify-between gap-4">
                                    <h3 className="kn-grad text-[1.0625rem] font-semibold">{k.experience.now}</h3>
                                    <span className="text-caption text-[var(--muted)] text-right">{current.duration}</span>
                                </div>
                                <p id="now-role" className="kn-title mt-4 text-[1.75rem] md:text-[min(2.3vw,3.9vh)]">{current.role}</p>
                                <p className="mt-2 text-body-sm text-[var(--muted)]">{current.company}</p>
                                <ul className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
                                    {current.tasks.map((task) => (
                                        <li key={task} className="flex items-start gap-3 text-[0.9375rem] md:text-[min(1.1vw,1.9vh)] leading-snug">
                                            <Check />
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="mt-auto pt-6 flex flex-wrap gap-2 short:hidden" aria-label={k.services.toolkit}>
                                    {nowStack.map((tool) => (
                                        <li key={tool.label} title={tool.label} className="inline-flex items-center gap-2 h-8 pl-1 pr-3 rounded-full bg-[var(--surface)] text-caption">
                                            <ToolTile tool={tool} className="tool-tile--sm" />
                                            {tool.label}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        </Rise>
                    </Parallax>

                    {/* Then — earlier roles on a rail. */}
                    <Parallax depth={0.03} className="md:col-span-4">
                        <Rise delay={0.25}>
                            <h3 className="text-[1.0625rem] font-semibold">{k.experience.then}</h3>
                            <ol className="mt-4 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-[var(--line)]">
                                {earlier.map((item) => (
                                    <li key={`${item.role}-${item.duration}`} className="relative pl-7">
                                        <span className="absolute left-0 top-[0.95rem] w-[11px] h-[11px] rounded-full border-2 border-[var(--muted)] bg-[var(--background)]" aria-hidden="true" />
                                        <button
                                            type="button"
                                            onClick={() => setRole(item)}
                                            aria-label={`${item.role}, ${item.company} — ${k.experience.more}`}
                                            className="group w-full text-left py-2 md:py-[min(0.9vh,0.55rem)] rounded-lg"
                                        >
                                            <span className="block text-caption text-[var(--muted)] tabular-nums">{item.duration}</span>
                                            <span className="flex items-start justify-between gap-3">
                                                <span className="text-body-sm md:text-[min(1.05vw,1.8vh)] font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
                                                    {item.role}
                                                </span>
                                                <Chevron className="kn-chevron--nudge mt-1 text-[var(--accent)]" />
                                            </span>
                                            <span className="block text-caption text-[var(--muted)]">{item.company}</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </Rise>
                    </Parallax>

                    {/* Education & credentials. */}
                    <Parallax depth={0.08} className="md:col-span-3">
                        <Rise delay={0.35}>
                            <h3 className="text-[1.0625rem] font-semibold">{k.experience.education}</h3>
                            <ul className="mt-4 divide-y divide-[var(--line)]">
                                {t.education.map((item) => (
                                    <li key={item.degree} className="py-2.5 md:py-[min(1.1vh,0.7rem)] first:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => setEdu(item)}
                                            aria-label={`${item.degree} — ${k.experience.details}`}
                                            className="group w-full text-left rounded-lg"
                                        >
                                            <span className="block text-body-sm md:text-[min(1vw,1.75vh)] font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
                                                {item.degree}
                                            </span>
                                        </button>
                                        <span className="mt-0.5 flex items-center justify-between gap-3 text-caption text-[var(--muted)]">
                                            <span className="min-w-0">{item.institution} · {item.duration}</span>
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="kn-link shrink-0 text-caption"
                                                    aria-label={`${k.experience.verify}: ${item.degree} (${k.common.newTab})`}
                                                >
                                                    {k.experience.verify}
                                                    <ArrowOut />
                                                </a>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Rise>
                    </Parallax>
                </div>
            </div>

            <Modal open={Boolean(role)} onClose={() => setRole(null)} labelledBy="role-modal-title" closeLabel={k.common.close} className="max-w-xl w-full p-7 sm:p-9">
                {role && (
                    <>
                        <p className="text-caption text-[var(--muted)]">{role.duration}</p>
                        <h3 id="role-modal-title" className="kn-title text-[1.625rem] sm:text-[1.875rem] mt-1 pr-10">{role.role}</h3>
                        <p className="mt-1 text-body-sm text-[var(--muted)]">{role.company}</p>
                        <h4 className="mt-7 mb-3 text-body-sm font-semibold">{k.experience.tasks}</h4>
                        <ul className="space-y-3">
                            {role.tasks.map((task) => (
                                <li key={task} className="flex items-start gap-3 text-[0.9375rem] leading-snug">
                                    <Check />
                                    <span>{task}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>

            <Modal open={Boolean(edu)} onClose={() => setEdu(null)} labelledBy="edu-modal-title" closeLabel={k.common.close} className="max-w-xl w-full p-7 sm:p-9">
                {edu && (
                    <>
                        <p className="text-caption text-[var(--muted)]">{edu.duration}{edu.badge ? ` · ${edu.badge}` : ''}</p>
                        <h3 id="edu-modal-title" className="kn-title text-[1.5rem] sm:text-[1.75rem] mt-1 pr-10">{edu.degree}</h3>
                        <p className="mt-1 text-body-sm text-[var(--muted)]">{edu.institution}</p>
                        <ul className="mt-6 space-y-3">
                            {edu.details.map((detail) => (
                                <li key={detail} className="flex items-start gap-3 text-[0.9375rem] leading-snug">
                                    <Check />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                        {edu.link && (
                            <a href={edu.link} target="_blank" rel="noopener noreferrer" className="kn-pill kn-pill--fill kn-pill--sm mt-7">
                                {k.experience.verify}
                                <ArrowOut />
                            </a>
                        )}
                    </>
                )}
            </Modal>
        </section>
    )
}
