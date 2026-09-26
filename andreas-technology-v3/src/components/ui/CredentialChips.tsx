import type { Education } from '@/data/content'
import Icon, { symbolFor } from '@/components/ui/Icon'

interface CredentialChipsProps {
    items: Education[]
    /** Visible label before the chips, e.g. "Credentials". */
    label?: string
    newTabLabel: string
    className?: string
}

/** Certifications and licences as tokens; the ones with a public record link to it. */
export default function CredentialChips({ items, label, newTabLabel, className = '' }: CredentialChipsProps) {
    if (items.length === 0) return null
    return (
        <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
            {label && <span className="os-eyebrow mr-1">{label}</span>}
            {items.map((item) => {
                const cls = `os-chip ${item.featured ? 'os-chip--accent' : ''}`
                // The content file uses a laptop glyph for Jamf; a credential reads better as a seal.
                const symbol = item.featured ? 'checkmark.seal' : symbolFor(item.icon, item.kind === 'license' ? 'person.text.rectangle' : 'rosette')
                const body = (
                    <>
                        <Icon name={symbol} className="text-[0.875rem]" />
                        {item.badge}
                        {item.link && <Icon name="arrow.up.right" className="text-[0.6875rem] opacity-80" />}
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
