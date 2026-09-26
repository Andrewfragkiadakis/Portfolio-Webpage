'use client'

import Image from 'next/image'
import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import AthensMap from '@/components/ui/AthensMap'
import { Bento, SectionTile, Tile, TileLink } from '@/components/ui/Bento'

const CV_LINK = 'https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A'

/**
 * The owner's own QR asset: it encodes `mailto:` his address. The folder name has a
 * space, which the image optimizer rejects, so it is served as-is (it is a small PNG).
 */
const QR_SRC = '/images/QR%20Codes/qr-code-for%20white-background.png'

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
                    className="col-span-2 md:col-[1/5] md:row-[1/3] min-h-[10rem] md:min-h-0"
                >
                    <p className="text-caption text-[var(--muted)]">{t.copyright}</p>
                </SectionTile>

                {/* Availability */}
                <Tile index={1} tone="security" className="col-span-2 md:col-[5/13] md:row-[1/3] justify-between gap-5">
                    <i className="fas fa-paper-plane absolute right-[4%] top-1/2 -translate-y-1/2 text-[8rem] md:text-[min(13vw,22vh)] opacity-[0.1] dark:opacity-[0.05] pointer-events-none" aria-hidden="true" />
                    <span className="chip self-start bg-white/15">
                        <span className="live-dot" aria-hidden="true" />
                        <span className="el-caps">{t.location}</span>
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div className="max-w-[40rem]">
                            <h3 className="display text-[2rem] md:text-[min(3.4vw,6vh)] el-caps">{t.contact.opportunitiesTitle}</h3>
                            <p className="mt-3 short:mt-2 text-[0.95rem] md:text-[min(1.1vw,1.95vh)] leading-snug text-[var(--muted)] max-w-[34rem]">
                                {t.contact.opportunitiesDescription}
                            </p>
                        </div>
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="pill pill--white self-start md:self-end !min-h-11 !px-5 group shrink-0">
                            <i className="fas fa-paper-plane transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            <span className="el-caps">{t.contact.sendMessage}</span>
                        </a>
                    </div>
                </Tile>

                {/* Email */}
                <Tile index={2} className="col-span-2 md:col-[1/5] md:row-[3/5] justify-between gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="eyebrow el-caps">{t.contact.infoTitle}</p>
                        <span className="fam-well tile--fleet !w-9 !h-9 !rounded-xl" aria-hidden="true">
                            <i className="fas fa-envelope text-sm" />
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 min-w-0">
                        <div className="min-w-0">
                            <p className="text-caption font-medium text-[var(--muted)] mb-1">{t.contact.emailLabel}</p>
                            <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="block text-lg md:text-[min(1.45vw,2.6vh)] font-semibold tracking-[-0.02em] break-all hover:text-[var(--accent)] transition-colors">
                                <span className="link-underline">{t.email}</span>
                            </a>
                        </div>
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                </Tile>

                {/* Athens, on a map, with the local time. */}
                <Tile index={3} className="map col-span-2 md:col-[5/10] md:row-[3/7] !p-0 justify-between min-h-[16rem] md:min-h-0">
                    <AthensMap label={t.bento.mapLabel} className="absolute inset-0 w-full h-full" />
                    <div className="relative flex items-start justify-between gap-2 p-[var(--tile-pad)]">
                        <span className="chip chip--glass">
                            <i className="fas fa-location-dot text-[#0071e3] dark:text-[#2997ff]" aria-hidden="true" />
                            <span className="el-caps">{t.contact.locationLabel}</span>
                        </span>
                        <span className="chip chip--glass tabular-nums normal-case tracking-normal">37.98° N, 23.73° E</span>
                    </div>
                    <div className="relative m-[var(--tile-pad)] mt-0 self-start rounded-2xl px-4 py-3 chip--glass flex items-end gap-5">
                        <div>
                            <p className="text-xl md:text-[min(1.7vw,3vh)] font-bold tracking-[-0.02em] leading-tight">{t.location}</p>
                            <p className="text-caption font-medium opacity-80 el-caps">{t.contact.localTimeLabel}</p>
                        </div>
                        <LocalTime className="numeral block text-[1.75rem] md:text-[min(2.3vw,4vh)] [&_span]:text-[0.4em] [&_span]:tracking-normal [&_span]:font-semibold" />
                    </div>
                </Tile>

                {/* QR: the owner's own code, on a white card so it scans in either theme. */}
                <Tile index={4} className="col-span-2 md:col-[10/13] md:row-[3/5] flex-row items-center gap-4 md:gap-3">
                    <a
                        href={`mailto:${t.email}`}
                        className="block shrink-0 rounded-2xl bg-white p-2 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/5 w-[8.5rem] md:w-auto md:h-full md:max-h-[min(11vw,19vh)] aspect-square"
                        aria-label={`${t.bento.scanToEmail} — ${t.email}`}
                    >
                        <Image src={QR_SRC} alt={t.bento.qrAlt} width={1155} height={1155} unoptimized className="w-full h-full" />
                    </a>
                    <div className="min-w-0">
                        <p className="text-sm md:text-[min(1.05vw,1.85vh)] font-semibold leading-tight">{t.bento.scanToEmail}</p>
                        <p className="mt-1 text-caption text-[var(--muted)] break-all">{t.email}</p>
                    </div>
                </Tile>

                {/* Socials */}
                <TileLink index={5} tone="graphite" href={t.github} label="GitHub profile" className="col-span-1 md:col-[1/3] md:row-[5/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <i className="fab fa-github text-3xl md:text-[min(2.6vw,4.6vh)]" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block min-w-0">
                        <span className="block eyebrow el-caps mb-1">{t.contact.socialTitle}</span>
                        <span className="block text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-tight">GitHub</span>
                        <span className="block text-caption text-[var(--muted)] truncate">@{handle(t.github)}</span>
                    </span>
                </TileLink>
                <TileLink index={6} tone="fleet" href={t.linkedin} label="LinkedIn profile" className="col-span-1 md:col-[3/5] md:row-[5/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <i className="fab fa-linkedin text-3xl md:text-[min(2.6vw,4.6vh)]" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block min-w-0">
                        <span className="block eyebrow el-caps mb-1">{t.contact.socialTitle}</span>
                        <span className="block text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-tight">LinkedIn</span>
                        <span className="block text-caption text-[var(--muted)] truncate">/in/{handle(t.linkedin)}</span>
                    </span>
                </TileLink>

                {/* Résumé */}
                <TileLink index={7} tone="automation" href={CV_LINK} external={false} download label={t.contact.downloadResume} className="col-span-2 md:col-[10/13] md:row-[5/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <span className="tile-icon tile-mark" aria-hidden="true">
                            <i className="fas fa-file-lines text-lg" />
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
