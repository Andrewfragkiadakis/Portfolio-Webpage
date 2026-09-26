'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Education, Experience as Role } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { ToolLogo } from '@/components/ui/ToolBadge'
import { TOOL_BY_LABEL, type Tool, type ToolLabel } from '@/data/tools'
import { ArrowOut, Chevron, Headline, Rise } from '@/components/ui/keynote'

/** The stack named in the current role's own task list. */
const NOW_STACK: ToolLabel[] = ['Jamf Pro', 'Bash / zsh', 'Python', 'TypeScript', 'MCP Servers', "acme.sh / Let's Encrypt"]
const nowStack = NOW_STACK.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

function Check() {
    return (
        <svg viewBox="0 0 16 16" className="w-4 h-4 mt-[0.2em] shrink-0 text-[var(--muted)]" aria-hidden="true" fill="none">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/**
 * Slide 5 — "Then. Now." The current role is the hero card; earlier roles run down a
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
            className="relative w-full md:h-full flex items-center px-6 sm:px-10 md:px-[max(3rem,7vw)] py-24 md:py-0"
        >
            <div className="mx-auto w-full max-w-[71rem]">
                <Rise className="short:hidden">
                    <p className="t-eyebrow">{k.experience.eyebrow}</p>
                </Rise>
                <Headline
                    id="experience-title"
                    text={k.experience.headline}
                    className="t-headline mt-2 text-[2.5rem] md:text-[min(4.4vw,7.2vh)]"
                />

                <div className="mt-10 md:mt-[min(2.5rem,4vh)] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-[3vw]">
                    {/* Now — the current role as the hero tile. */}
                    <Rise delay={0.1} className="md:col-span-5">
                        <article className="tile tile--lg h-full p-7 md:px-[min(2.25rem,2.6vw)] md:py-[min(2rem,3.4vh)] flex flex-col" aria-labelledby="now-role">
                            <div className="flex items-baseline justify-between gap-4">
                                <h3 className="t-small font-semibold">{k.experience.now}</h3>
                                <span className="t-caption text-[var(--muted)] text-right">{current.duration}</span>
                            </div>
                            <p id="now-role" className="t-title mt-4 text-[1.75rem] md:text-[min(1.75rem,3.2vh)]">{current.role}</p>
                            <p className="mt-1.5 t-small text-[var(--muted)]">{current.company}</p>
                            <ul className="mt-6 md:mt-[min(1.5rem,2.6vh)]">
                                {current.tasks.map((task) => (
                                    <li key={task} className="t-body md:text-[min(1rem,1.8vh)] md:leading-[1.42] py-3 md:py-[min(0.625rem,1.1vh)] border-t border-[var(--line)]">
                                        {task}
                                    </li>
                                ))}
                            </ul>
                            <ul className="mt-auto pt-5 flex flex-wrap gap-x-4 gap-y-2 short:hidden" aria-label={k.services.toolkit}>
                                {nowStack.map((tool) => (
                                    <li key={tool.label} title={tool.label} className="inline-flex items-center gap-1.5 t-caption text-[var(--muted)]">
                                        <ToolLogo tool={tool} className="!h-3.5 text-[var(--foreground)]" />
                                        {tool.label}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </Rise>

                    {/* Then — earlier roles, newest first. */}
                    <Rise delay={0.2} className="md:col-span-4">
                        <h3 className="t-small font-semibold pb-3">{k.experience.then}</h3>
                        <ol className="border-t border-[var(--line)]">
                            {earlier.map((item) => (
                                <li key={`${item.role}-${item.duration}`} className="border-b border-[var(--line)]">
                                    <button
                                        type="button"
                                        onClick={() => setRole(item)}
                                        aria-label={`${item.role}, ${item.company} — ${k.experience.more}`}
                                        className="group w-full text-left py-3 md:py-[min(0.6rem,1vh)] flex items-center justify-between gap-4"
                                    >
                                        <span className="min-w-0">
                                            <span className="block t-caption text-[var(--muted)] tabular-nums">{item.duration}</span>
                                            <span className="block mt-0.5 t-small md:text-[min(0.9375rem,1.7vh)] font-semibold group-hover:text-[var(--accent)] transition-colors">
                                                {item.role}
                                            </span>
                                            <span className="block t-caption text-[var(--muted)]">{item.company}</span>
                                        </span>
                                        <Chevron className="kn-chevron--nudge text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </Rise>

                    {/* Education & credentials. */}
                    <Rise delay={0.3} className="md:col-span-3">
                        <h3 className="t-small font-semibold pb-3">{k.experience.education}</h3>
                        <ul className="border-t border-[var(--line)]">
                            {t.education.map((item) => (
                                <li key={item.degree} className="py-3 md:py-[min(0.6rem,1vh)] border-b border-[var(--line)]">
                                    <button
                                        type="button"
                                        onClick={() => setEdu(item)}
                                        aria-label={`${item.degree} — ${k.experience.details}`}
                                        className="w-full text-left t-small md:text-[min(0.875rem,1.6vh)] font-semibold hover:text-[var(--accent)] transition-colors"
                                    >
                                        {item.degree}
                                    </button>
                                    <span className="mt-0.5 flex items-center justify-between gap-3 t-caption text-[var(--muted)]">
                                        <span className="min-w-0">{item.institution} · {item.duration}</span>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="kn-link shrink-0 t-caption"
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
                </div>
            </div>

            <Modal open={Boolean(role)} onClose={() => setRole(null)} labelledBy="role-modal-title" closeLabel={k.common.close} className="max-w-[40rem] w-full px-7 py-10 sm:px-12 sm:py-12">
                {role && (
                    <>
                        <p className="t-small text-[var(--muted)]">{role.duration}</p>
                        <h3 id="role-modal-title" className="t-headline text-[1.75rem] sm:text-[2.25rem] mt-1 pr-10">{role.role}</h3>
                        <p className="mt-1 t-body text-[var(--muted)]">{role.company}</p>
                        <h4 className="mt-8 mb-3 t-small font-semibold">{k.experience.tasks}</h4>
                        <ul className="space-y-3">
                            {role.tasks.map((task) => (
                                <li key={task} className="flex items-start gap-3 t-body">
                                    <Check />
                                    <span>{task}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>

            <Modal open={Boolean(edu)} onClose={() => setEdu(null)} labelledBy="edu-modal-title" closeLabel={k.common.close} className="max-w-[40rem] w-full px-7 py-10 sm:px-12 sm:py-12">
                {edu && (
                    <>
                        <p className="t-small text-[var(--muted)]">{edu.duration}{edu.badge ? ` · ${edu.badge}` : ''}</p>
                        <h3 id="edu-modal-title" className="t-headline text-[1.75rem] sm:text-[2.25rem] mt-1 pr-10">{edu.degree}</h3>
                        <p className="mt-1 t-body text-[var(--muted)]">{edu.institution}</p>
                        <ul className="mt-6 space-y-3">
                            {edu.details.map((detail) => (
                                <li key={detail} className="flex items-start gap-3 t-body">
                                    <Check />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                        {edu.link && (
                            <a href={edu.link} target="_blank" rel="noopener noreferrer" className="kn-pill kn-pill--fill mt-8">
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
