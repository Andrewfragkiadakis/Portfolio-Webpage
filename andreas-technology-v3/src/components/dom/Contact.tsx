'use client'

import Image from 'next/image'
import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import AthensMap from '@/components/ui/AthensMap'
import InfoSpot from '@/components/ui/InfoSpot'
import { Bento, SectionTile, Tile, TileHead } from '@/components/ui/Bento'

const CV_LINK = 'https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A'

/**
 * The owner's own QR asset: it encodes `mailto:` his address. The folder name has a
 * space, which the image optimizer rejects, so it is served as-is (it is a small PNG).
 */
const QR_SRC = '/images/QR%20Codes/qr-code-for%20white-background.png'

const MEMOJI = '/favicons/android-chrome-512x512.png'
const COORDINATES = '37.98° N, 23.73° E'

const LINK_ROW = 'group flex items-center gap-3 rounded-2xl px-2 py-1.5 short:py-1 -mx-2 transition-colors duration-300 hover:bg-[var(--fill)]'

/**
 * Contact, on a three-module grid (4 + 8 columns):
 *   row 1–2  heading · availability
 *   row 3–6  email and profiles (left) · the Athens map, the panel's one visual (right)
 */
export default function Contact() {
    const t = useContent()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const handle = (url: string) => url.replace(/\/$/, '').split('/').pop()

    const profiles = [
        { href: t.linkedin, title: 'LinkedIn', caption: `/in/${handle(t.linkedin)}`, icon: 'fab fa-linkedin-in', aria: 'LinkedIn profile', arrow: 'fa-arrow-right -rotate-45', external: true },
        { href: t.github, title: 'GitHub', caption: `@${handle(t.github)}`, icon: 'fab fa-github', aria: 'GitHub profile', arrow: 'fa-arrow-right -rotate-45', external: true },
        { href: CV_LINK, title: t.contact.downloadResume, caption: 'PDF', icon: 'fas fa-file-lines', aria: t.contact.downloadResume, arrow: 'fa-arrow-down', external: false },
    ]

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
                    <p className="mt-3 t-caption !text-[0.75rem]">{t.copyright}</p>
                </SectionTile>

                {/* Availability: status → headline → one call to action. */}
                <Tile index={1} className="col-span-2 md:col-[5/13] md:row-[1/3] justify-between gap-5">
                    <TileHead label={<span className="flex items-center gap-2.5"><span className="live-dot" aria-hidden="true" />{t.bento.tile.status}</span>} />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div className="max-w-[40rem]">
                            <h3 className="display text-[2rem] md:text-[min(3.2vw,5.6vh)] el-caps">{t.contact.opportunitiesTitle}</h3>
                            <p className="mt-3 short:mt-2 t-caption max-w-[34rem]">
                                {t.contact.opportunitiesDescription}
                            </p>
                        </div>
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="pill pill--accent self-start md:self-end !min-h-11 !px-5 group shrink-0">
                            <i className="fas fa-paper-plane transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            <span className="el-caps">{t.contact.sendMessage}</span>
                        </a>
                    </div>
                </Tile>

                {/* Email, with the owner's QR code one tap deeper. */}
                <Tile index={2} className="col-span-2 md:col-[1/5] md:row-[3/5] justify-between gap-4">
                    <TileHead label={t.bento.tile.email}>
                        <InfoSpot label={t.bento.scanToEmail} title={t.bento.scanToEmail} icon="qr" width={14}>
                            {/* The owner's own code (mailto:), on white so it scans in either theme. */}
                            <a href={`mailto:${t.email}`} className="block rounded-xl bg-white p-2 ring-1 ring-black/5" aria-label={`${t.bento.scanToEmail} — ${t.email}`}>
                                <Image src={QR_SRC} alt={t.bento.qrAlt} width={1155} height={1155} unoptimized className="w-full h-auto" />
                            </a>
                        </InfoSpot>
                    </TileHead>
                    <div className="flex flex-col gap-3 min-w-0">
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.emailLabel}: ${t.email}`} className="block text-lg md:text-[min(1.4vw,2.5vh)] font-semibold tracking-[-0.02em] break-all hover:text-[var(--accent)] transition-colors">
                            <span className="link-underline">{t.email}</span>
                        </a>
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                </Tile>

                {/* Profiles and résumé: one list, one row anatomy. */}
                <Tile index={3} className="col-span-2 md:col-[1/5] md:row-[5/7] gap-2">
                    <TileHead label={t.bento.tile.profiles} />
                    <ul className="mt-auto flex flex-col gap-0.5">
                        {profiles.map((row) => (
                            <li key={row.title}>
                                <a
                                    href={row.href}
                                    aria-label={row.aria}
                                    {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                                    className={LINK_ROW}
                                >
                                    <span className="icon-well !text-[var(--foreground)] !w-9 !h-9 short:!w-8 short:!h-8" aria-hidden="true">
                                        <i className={`${row.icon} text-sm`} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block t-title !text-[0.9375rem] md:!text-[min(1.05vw,1.85vh)] truncate el-caps">{row.title}</span>
                                        <span className="block t-caption !text-[0.75rem] truncate">{row.caption}</span>
                                    </span>
                                    <i className={`fas ${row.arrow} text-caption text-[var(--accent)]`} aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </Tile>

                {/* Athens, on an Apple Maps-style tile: a Find My pin on Syntagma. The panel's one visual. */}
                <Tile index={4} className="map map-tile col-span-2 md:col-[5/13] md:row-[3/7] !p-0 min-h-[22rem] md:min-h-0">
                    <AthensMap label={t.bento.mapLabel} places={t.bento.mapPlaces} className="map-canvas" />
                    <span className="map-dot map-at" aria-hidden="true"><span className="map-pulse" /></span>
                    <span className="map-pin map-at" aria-hidden="true">
                        <span className="map-pin__face">
                            <span>
                                <Image src={MEMOJI} alt="" width={64} height={64} className="w-full h-full object-cover scale-[1.12] translate-y-[6%]" />
                            </span>
                        </span>
                        <span className="map-pin__tail" />
                    </span>
                    <div className="relative z-[2] flex items-start justify-between gap-2 p-[var(--tile-pad)]">
                        <div className="rounded-2xl px-3.5 py-2.5 chip--glass shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                            <p className="t-label el-caps">{t.contact.locationLabel}</p>
                            <p className="mt-1 flex items-baseline gap-3">
                                <span className="text-base md:text-[min(1.3vw,2.3vh)] font-bold tracking-[-0.02em] leading-tight">{t.location}</span>
                                <LocalTime className="numeral text-base md:text-[min(1.3vw,2.3vh)] text-[var(--accent)] [&_span]:hidden" />
                            </p>
                        </div>
                        <InfoSpot label={t.bento.spot.map} title={t.bento.spot.map} className="spot--glass">
                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                                <dt className="muted el-caps lang-el:text-[0.75rem]">{t.contact.locationLabel}</dt>
                                <dd className="font-semibold">{t.location}</dd>
                                <dt className="muted el-caps lang-el:text-[0.75rem]">{t.bento.coordinates}</dt>
                                <dd className="font-semibold tabular-nums">{COORDINATES}</dd>
                                <dt className="muted el-caps lang-el:text-[0.75rem]">{t.contact.localTimeLabel}</dt>
                                <dd className="font-semibold"><LocalTime className="tabular-nums" /></dd>
                            </dl>
                        </InfoSpot>
                    </div>
                </Tile>
            </Bento>
        </section>
    )
}
