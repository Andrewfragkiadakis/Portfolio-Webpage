import type { Metadata } from 'next'
import { content } from '@/data/content'
import { CASE_STUDIES, WORK_COPY, socialImage } from '@/data/work'
import { LOCALES, localeInfo, localePath, toLocale } from '@/data/locales'
import { PERSON, SITE_URL } from '@/data/site'
import WorkHeader, { ChevronRight } from '@/components/work/WorkHeader'

const SUB = '/work'

export async function generateMetadata({ params }: PageProps<'/[lang]/work'>): Promise<Metadata> {
    const lang = toLocale((await params).lang)
    const w = WORK_COPY[lang]
    const path = localePath(lang, SUB)
    return {
        title: w.eyebrow,
        description: w.metaDescription,
        alternates: {
            canonical: path,
            languages: Object.fromEntries([...LOCALES.map((l) => [l.code, localePath(l.code, SUB)]), ['x-default', localePath('en', SUB)]]),
        },
        openGraph: {
            type: 'website',
            locale: localeInfo(lang).ogLocale,
            url: path,
            siteName: PERSON.name,
            title: `${w.eyebrow} | ${PERSON.name}`,
            description: w.metaDescription,
            images: [socialImage(lang)],
        },
        twitter: { card: 'summary_large_image', title: `${w.eyebrow} | ${PERSON.name}`, description: w.metaDescription, images: [socialImage(lang)] },
    }
}

/** The case-study index: one card per study, led by its figure. */
export default async function WorkIndex({ params }: PageProps<'/[lang]/work'>) {
    const lang = toLocale((await params).lang)
    const w = WORK_COPY[lang]
    const k = content[lang].keynote
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: w.eyebrow,
        url: `${SITE_URL}${localePath(lang, SUB)}`,
        inLanguage: lang,
        description: w.metaDescription,
        author: { '@id': `${SITE_URL}/#person` },
        hasPart: CASE_STUDIES.map((s) => ({
            '@type': 'Article',
            headline: s.copy[lang].title,
            url: `${SITE_URL}${localePath(lang, `${SUB}/${s.slug}`)}`,
        })),
    }

    return (
        <>
            <WorkHeader lang={lang} name={k.common.name} navLabel={k.nav.main} indexLabel={w.eyebrow} sub={SUB} onIndex />
            <main
                id="main-content"
                tabIndex={-1}
                className="kn-article outline-none px-6 sm:px-10 md:px-[max(3rem,7vw)] pt-[calc(var(--nav-h)+3rem)] md:pt-[calc(var(--nav-h)+5rem)] pb-24 md:pb-32"
            >
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
                <div className="mx-auto w-full max-w-[71rem]">
                    <p className="t-eyebrow">{w.eyebrow}</p>
                    <h1 className="t-headline mt-2 text-[2.5rem] md:text-[4rem]">{w.title}</h1>
                    <p className="t-lede mt-5 md:mt-6 max-w-[40rem] text-[1.1875rem] md:text-[1.3125rem]">{w.lede}</p>

                    <ul className="mt-12 md:mt-16 grid gap-5 md:grid-cols-2">
                        {CASE_STUDIES.map((study) => {
                            const c = study.copy[lang]
                            return (
                                <li key={study.slug}>
                                    <a
                                        href={localePath(lang, `${SUB}/${study.slug}`)}
                                        className="group flex flex-col h-full rounded-[1.75rem] bg-[var(--surface)] px-7 py-8 md:px-10 md:py-10 hover:bg-[var(--surface-2)] transition-colors"
                                    >
                                        <span className="t-caption text-[var(--muted)]">{w.caseStudy} · {c.area}</span>
                                        <span className="t-stat mt-6 text-[3.5rem] md:text-[4.5rem]">
                                            {c.stat.value}
                                            {c.stat.unit && <span className="ml-1 text-[0.42em] tracking-[0.004em]">{c.stat.unit}</span>}
                                        </span>
                                        <span className="mt-2 t-small text-[var(--muted)]">{c.stat.label}</span>
                                        <h2 className="t-title mt-8 text-[1.5rem] md:text-[1.75rem]">{c.title}</h2>
                                        <span className="t-body mt-3 text-[var(--muted)]">{c.summary}</span>
                                        <span className="kn-link t-body mt-auto pt-6 group-hover:underline">
                                            {w.read}
                                            <ChevronRight />
                                        </span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>

                    <p className="mt-10 t-caption text-[var(--muted)]">{w.note}</p>
                </div>
            </main>
        </>
    )
}
