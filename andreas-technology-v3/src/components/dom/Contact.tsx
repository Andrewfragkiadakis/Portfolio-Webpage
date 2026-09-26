'use client'

import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import { Bento, SectionTile, Tile, TileLink } from '@/components/ui/Bento'

const CV_LINK = 'https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A'

export default function Contact() {
    const t = useContent()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const handle = (url: string) => url.replace(/\/$/, '').split('/').pop()

    return (
        <section aria-labelledby="contact-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 pb-32 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile
                    id="contact"
                    number={6}
                    title={t.contact.title}
                    eyebrow={t.contact.subtitle}
                    index={0}
                    className="col-span-2 md:col-[1/6] md:row-[1/3] min-h-[10rem] md:min-h-0"
                >
                    <p className="text-caption text-[var(--muted)]">{t.copyright}</p>
                </SectionTile>

                {/* Availability */}
                <Tile index={1} tone="mint" className="col-span-2 md:col-[6/13] md:row-[1/4] justify-between gap-6">
                    <span className="chip self-start bg-[var(--surface)]/70 dark:bg-black/25">
                        <span className="live-dot" aria-hidden="true" />
                        <span className="el-caps">{t.location}</span>
                    </span>
                    <div className="max-w-[40rem]">
                        <h3 className="display text-[2rem] md:text-[min(3.4vw,6vh)] el-caps">{t.contact.opportunitiesTitle}</h3>
                        <p className="mt-3 text-[0.95rem] md:text-[min(1.1vw,1.95vh)] leading-snug text-[var(--muted)] max-w-[34rem]">
                            {t.contact.opportunitiesDescription}
                        </p>
                    </div>
                    <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="pill pill--accent self-start !min-h-11 !px-5 group">
                        <i className="fas fa-paper-plane transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        <span className="el-caps">{t.contact.sendMessage}</span>
                    </a>
                </Tile>

                {/* Email */}
                <Tile index={2} className="col-span-2 md:col-[1/6] md:row-[3/5] justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="eyebrow el-caps">{t.contact.infoTitle}</p>
                        <span className="tile-icon tile-mark !w-9 !h-9 !rounded-xl" aria-hidden="true">
                            <i className="fas fa-envelope text-sm" />
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 min-w-0">
                        <div className="min-w-0">
                            <p className="text-caption font-medium text-[var(--muted)] mb-1">{t.contact.emailLabel}</p>
                            <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="block text-lg md:text-[min(1.6vw,2.8vh)] font-semibold tracking-[-0.02em] break-all hover:text-[var(--accent)] transition-colors">
                                <span className="link-underline">{t.email}</span>
                            </a>
                        </div>
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                </Tile>

                {/* Location */}
                <Tile index={3} className="col-span-1 md:col-[1/4] md:row-[5/7] justify-between min-h-[9rem] md:min-h-0">
                    <p className="eyebrow el-caps">{t.contact.locationLabel}</p>
                    <div>
                        <i className="fas fa-location-dot text-xl text-[var(--accent)] mb-2" aria-hidden="true" />
                        <p className="text-xl md:text-[min(1.7vw,3vh)] font-bold tracking-[-0.02em] leading-tight">{t.location}</p>
                    </div>
                </Tile>

                {/* Local time */}
                <Tile index={4} className="col-span-1 md:col-[4/6] md:row-[5/7] justify-between min-h-[9rem] md:min-h-0">
                    <p className="eyebrow el-caps">{t.contact.localTimeLabel}</p>
                    <LocalTime className="numeral block text-[2.25rem] md:text-[min(3vw,5.4vh)] [&_span]:block [&_span]:mt-1 [&_span]:text-caption [&_span]:tracking-normal [&_span]:font-semibold" />
                </Tile>

                {/* Socials */}
                <TileLink index={5} tone="ink" href={t.github} label="GitHub profile" className="col-span-1 md:col-[6/8] md:row-[4/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <i className="fab fa-github text-3xl md:text-[min(3vw,5.4vh)]" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block min-w-0">
                        <span className="block eyebrow el-caps mb-1">{t.contact.socialTitle}</span>
                        <span className="block text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-tight">GitHub</span>
                        <span className="block text-caption text-[var(--muted)] truncate">@{handle(t.github)}</span>
                    </span>
                </TileLink>
                <TileLink index={6} tone="sky" href={t.linkedin} label="LinkedIn profile" className="col-span-1 md:col-[8/10] md:row-[4/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <i className="fab fa-linkedin text-3xl md:text-[min(3vw,5.4vh)] tile-mark" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block min-w-0">
                        <span className="block eyebrow el-caps mb-1">{t.contact.socialTitle}</span>
                        <span className="block text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-tight">LinkedIn</span>
                        <span className="block text-caption text-[var(--muted)] truncate">/in/{handle(t.linkedin)}</span>
                    </span>
                </TileLink>

                {/* Résumé */}
                <TileLink index={7} tone="peach" href={CV_LINK} external={false} download label={t.contact.downloadResume} className="col-span-2 md:col-[10/13] md:row-[4/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <span className="tile-icon tile-mark !w-12 !h-12" aria-hidden="true">
                            <i className="fas fa-file-lines text-xl" />
                        </span>
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-down" /></span>
                    </span>
                    <span className="block">
                        <span className="block eyebrow mb-1">CV</span>
                        <span className="block text-2xl md:text-[min(2vw,3.6vh)] font-bold tracking-[-0.03em] leading-tight el-caps">{t.contact.downloadResume}</span>
                    </span>
                </TileLink>
            </Bento>
        </section>
    )
}
