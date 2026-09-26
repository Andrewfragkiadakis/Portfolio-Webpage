'use client'

import Image from 'next/image'
import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import AthensMap from '@/components/ui/AthensMap'
import InfoSpot from '@/components/ui/InfoSpot'
import { Bento, SectionTile, Tile, TileLink } from '@/components/ui/Bento'

const CV_LINK = 'https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A'

/**
 * The owner's own QR asset: it encodes `mailto:` his address. The folder name has a
 * space, which the image optimizer rejects, so it is served as-is (it is a small PNG).
 */
const QR_SRC = '/images/QR%20Codes/qr-code-for%20white-background.png'

const MEMOJI = '/favicons/android-chrome-512x512.png'
const COORDINATES = '37.98° N, 23.73° E'

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
                <Tile index={1} tone="security" className="col-span-2 md:col-[5/13] md:row-[1/3] justify-end gap-5">
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
                    <p className="eyebrow el-caps">{t.contact.infoTitle}</p>
                    <div className="flex flex-col gap-3 min-w-0">
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.emailLabel}: ${t.email}`} className="block text-lg md:text-[min(1.45vw,2.6vh)] font-semibold tracking-[-0.02em] break-all hover:text-[var(--accent)] transition-colors">
                            <span className="link-underline">{t.email}</span>
                        </a>
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                </Tile>

                {/* Athens, on an Apple Maps-style tile: a Find My pin on Syntagma. Coordinates and time zone sit behind the "i". */}
                <Tile index={3} className="map map-tile col-span-2 md:col-[5/10] md:row-[3/7] !p-0 min-h-[21rem] md:min-h-0">
                    <AthensMap label={t.bento.mapLabel} places={t.bento.mapPlaces} className="map-canvas" />
                    <span className="map-dot map-at" aria-hidden="true"><span className="map-pulse" /></span>
                    <span className="map-pin map-at" aria-hidden="true">
                        <span className="map-pin__face">
                            <span>
                                <Image src={MEMOJI} alt="" width={52} height={52} className="w-full h-full object-cover scale-[1.12] translate-y-[6%]" />
                            </span>
                        </span>
                        <span className="map-pin__tail" />
                    </span>
                    <div className="relative z-[2] flex items-start justify-between gap-2 p-[var(--tile-pad)]">
                        <div className="rounded-2xl px-3.5 py-2.5 chip--glass shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-baseline gap-3">
                            <p className="text-base md:text-[min(1.3vw,2.3vh)] font-bold tracking-[-0.02em] leading-tight">{t.location}</p>
                            <LocalTime className="numeral text-base md:text-[min(1.3vw,2.3vh)] opacity-70 [&_span]:hidden" />
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

                {/* QR: the owner's own code, on a white card so it scans in either theme. */}
                <Tile index={4} className="col-span-2 md:col-[10/13] md:row-[3/5] flex-row items-center gap-4 md:gap-3">
                    <a
                        href={`mailto:${t.email}`}
                        className="block shrink-0 rounded-2xl bg-white p-2 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/5 w-[8.5rem] md:w-auto md:h-full md:max-h-[min(11vw,19vh)] aspect-square"
                        aria-label={`${t.bento.scanToEmail} — ${t.email}`}
                    >
                        <Image src={QR_SRC} alt={t.bento.qrAlt} width={1155} height={1155} unoptimized className="w-full h-full" />
                    </a>
                    <p className="min-w-0 text-sm md:text-[min(1.05vw,1.85vh)] font-semibold leading-tight">{t.bento.scanToEmail}</p>
                </Tile>

                {/* Socials */}
                <TileLink index={5} tone="graphite" href={t.github} label="GitHub profile" className="col-span-1 md:col-[1/3] md:row-[5/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="flex items-start justify-between gap-2">
                        <i className="fab fa-github text-3xl md:text-[min(2.6vw,4.6vh)]" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block min-w-0">
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
                        <span className="block text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-tight">LinkedIn</span>
                        <span className="block text-caption text-[var(--muted)] truncate">/in/{handle(t.linkedin)}</span>
                    </span>
                </TileLink>

                {/* Résumé */}
                <TileLink index={7} tone="automation" href={CV_LINK} external={false} download label={t.contact.downloadResume} className="col-span-2 md:col-[10/13] md:row-[5/7] justify-between min-h-[10rem] md:min-h-0">
                    <span className="tile-affordance self-end" aria-hidden="true"><i className="fas fa-arrow-down" /></span>
                    <span className="block">
                        <span className="block text-2xl md:text-[min(2vw,3.6vh)] font-bold tracking-[-0.03em] leading-tight el-caps">{t.contact.downloadResume}</span>
                    </span>
                </TileLink>
            </Bento>
        </section>
    )
}
