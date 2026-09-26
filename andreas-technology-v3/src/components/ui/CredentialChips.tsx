import type { Education } from '@/data/content'
import { uiIcon } from '@/data/apps'

interface CredentialChipsProps {
    items: Education[]
    /** Visible label before the chips, e.g. "Credentials". */
    label?: string
    newTabLabel: string
    className?: string
}

/** Certifications and licences as pills; the ones with a public record link to it. */
export default function CredentialChips({ items, label, newTabLabel, className = '' }: CredentialChipsProps) {
    if (items.length === 0) return null
    return (
        <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
            {label && <span className="text-caption font-semibold uppercase tracking-[0.08em] text-[var(--muted)] mr-1">{label}</span>}
            {items.map((item) => {
                const cls = `os-chip ${item.featured ? 'os-chip--accent' : ''}`
                const body = (
                    <>
                        <i className={`${uiIcon(item.icon ?? (item.kind === 'license' ? 'fas fa-id-card' : 'fas fa-award'))} text-[0.7rem]`} aria-hidden="true" />
                        {item.badge}
                        {item.link && <i className="fas fa-arrow-up-right-from-square text-[0.55rem] opacity-80" aria-hidden="true" />}
                    </>
                )
                return item.link ? (
                    <a key={item.badge} href={item.link} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${item.degree} — ${item.institution} (${newTabLabel})`}>
                        {body}
                    </a>
                ) : (
                    <span key={item.badge} className={cls} title={`${item.degree} — ${item.institution}`}>
                        {body}
                    </span>
                )
            })}
        </div>
    )
}
