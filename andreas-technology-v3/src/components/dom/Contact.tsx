'use client'

import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import Window from '@/components/ui/Window'
import { MonogramIcon } from '@/components/ui/AppIcon'
import Icon, { type SymbolName } from '@/components/ui/Icon'
import { MAIL_SUBJECT, RESUME_URL } from '@/data/content'
import { gmailComposeUrl } from '@/utils/links'

/** A labelled header row of the compose form ("To:", "Subject:"). */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 min-h-10 px-4 md:px-6 py-1.5 border-b-[0.5px] border-[var(--hairline-strong)]">
            <span className="w-16 shrink-0 text-body-sm text-[var(--muted)] text-right">{label}:</span>
            <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">{children}</div>
        </div>
    )
}

/** Contact-card row: icon, small label, value. */
function InfoRow({ icon, label, children }: { icon: SymbolName; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b-[0.5px] border-[var(--hairline-strong)] last:border-b-0">
            <span className="w-8 h-8 shrink-0 rounded-full bg-[var(--control)] flex items-center justify-center text-[var(--accent)] text-base" aria-hidden="true">
                <Icon name={icon} />
            </span>
            <div className="min-w-0">
                <div className="text-caption text-[var(--muted)] caps-gr">{label}</div>
                <div className="text-body-sm font-medium truncate">{children}</div>
            </div>
        </div>
    )
}

export default function Contact() {
    const t = useContent()
    const composeUrl = gmailComposeUrl(t.email)

    return (
        <Window
            wid="contact"
            app="contact"
            as="section"
            anchor="contact"
            labelledBy="contact-title"
            title={t.os.windows.contact}
            className="w-full md:max-w-[68rem] md:max-h-full"
            bodyClassName="flex flex-col md:flex-row"
            toolbar={
                <a href={composeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="os-btn os-btn--primary">
                    <Icon name="paperplane" className="text-[0.875rem]" />
                    <span className="caps-gr">{t.contact.sendMessage}</span>
                </a>
            }
            footer={
                <p className="px-4 py-1.5 min-h-7 flex items-center justify-center text-caption text-[var(--muted)] text-center">{t.copyright}</p>
            }
        >
            {/* Compose pane */}
            <div className="flex-1 min-w-0 flex flex-col">
                <Field label={t.os.mail.to}>
                    <span className="os-chip os-chip--accent h-7 max-w-full">
                        <span className="truncate">{t.email}</span>
                    </span>
                    <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                </Field>
                <Field label={t.os.mail.subject}>
                    <span className="text-sm font-semibold truncate">{MAIL_SUBJECT}</span>
                </Field>

                <div className="flex-1 p-5 md:p-8 flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 id="contact-title" className="os-eyebrow caps-gr">{t.contact.title}</h2>
                        <p className="text-caption uppercase tracking-[0.04em] text-[var(--muted)]">{t.contact.subtitle}</p>
                    </div>
                    <p className="os-large-title mt-3 flex items-center gap-2.5 text-[1.625rem] md:text-[2rem]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] shrink-0" aria-hidden="true" />
                        <span className="caps-gr">{t.contact.opportunitiesTitle}</span>
                    </p>
                    <p className="mt-3 text-sm md:text-[0.9375rem] text-[var(--muted)] leading-relaxed max-w-[34rem]">
                        {t.contact.opportunitiesDescription}
                    </p>
                    <p className="mt-5 font-mono text-body-sm text-[var(--muted)]" aria-hidden="true">
                        — {t.os.displayName}
                    </p>

                    <div className="mt-6 md:mt-auto md:pt-8 flex flex-col sm:flex-row gap-2.5">
                        <a href={composeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="os-btn os-btn--primary h-10 px-6 text-sm">
                            <Icon name="paperplane" />
                            <span className="caps-gr">{t.contact.sendMessage}</span>
                        </a>
                        <a href={RESUME_URL} download className="os-btn os-btn--secondary h-10 px-6 text-sm">
                            <Icon name="arrow.down.tray" />
                            <span className="caps-gr">{t.contact.downloadResume}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact card */}
            <aside className="bg-[var(--window-chrome)] md:w-[20rem] shrink-0 border-t-[0.5px] md:border-t-0 md:border-l-[0.5px] border-[var(--hairline-strong)] p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <MonogramIcon size={48} />
                    <div className="min-w-0">
                        <p className="text-[0.9375rem] font-bold tracking-[-0.01em] leading-tight">{t.os.displayName}</p>
                        <p className="text-caption text-[var(--muted)] leading-snug">{t.title}</p>
                    </div>
                </div>
                <h3 className="os-eyebrow mb-1 caps-gr">{t.contact.infoTitle}</h3>
                <InfoRow icon="envelope" label={t.contact.emailLabel}>
                    <a href={composeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">
                        <span className="link-underline">{t.email}</span>
                    </a>
                </InfoRow>
                <InfoRow icon="mappin" label={t.contact.locationLabel}>{t.location}</InfoRow>
                <InfoRow icon="clock" label={t.contact.localTimeLabel}>
                    <LocalTime className="tabular-nums" />
                </InfoRow>

                <h3 className="mt-5 os-eyebrow mb-2 caps-gr">{t.contact.socialTitle}</h3>
                <div className="flex gap-2">
                    <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="os-btn os-btn--secondary flex-1 h-9">
                        <Icon name="github" className="text-[0.875rem]" /> GitHub
                    </a>
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="os-btn os-btn--secondary flex-1 h-9">
                        <Icon name="linkedin" className="text-[0.875rem]" /> LinkedIn
                    </a>
                </div>
            </aside>
        </Window>
    )
}
