import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { content } from '@/data/content'
import { CASE_STUDIES, WORK_COPY, caseStudy, socialImage } from '@/data/work'
import { LOCALES, localeInfo, localePath, toLocale } from '@/data/locales'
import { CV, PERSON, SITE_URL } from '@/data/site'
import WorkHeader, { ChevronRight } from '@/components/work/WorkHeader'

/** One static page per case study and language; any other slug is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
    return CASE_STUDIES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/work/[slug]'>): Promise<Metadata> {
    const { lang: raw, slug } = await params
    const lang = toLocale(raw)
    const study = caseStudy(slug)
    if (!study) return {}
    const c = study.copy[lang]
    const sub = `/work/${slug}`
    const path = localePath(lang, sub)
    return {
        title: c.title,
        description: c.summary,
        alternates: {
            canonical: path,
            languages: Object.fromEntries([...LOCALES.map((l) => [l.code, localePath(l.code, sub)]), ['x-default', localePath('en', sub)]]),
        },
        openGraph: {
            type: 'article',
            locale: localeInfo(lang).ogLocale,
            url: path,
            siteName: PERSON.name,
            title: c.title,
            description: c.summary,
            publishedTime: study.published,
            modifiedTime: study.updated,
            authors: [PERSON.name],
            images: [socialImage(lang)],
        },
        twitter: { card: 'summary_large_image', title: c.title, description: c.summary, images: [socialImage(lang)] },
    }
}

export default async function CaseStudyPage({ params }: PageProps<'/[lang]/work/[slug]'>) {
    const { lang: raw, slug } = await params
    const lang = toLocale(raw)
    const study = caseStudy(slug)
    if (!study) notFound()

    const c = study.copy[lang]
    const w = WORK_COPY[lang]
    const copy = content[lang]
    const k = copy.keynote
    const sub = `/work/${slug}`
    const url = `${SITE_URL}${localePath(lang, sub)}`
    const updated = new Intl.DateTimeFormat(lang === 'el' ? 'el-GR' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(study.updated))
    const mailto = `mailto:${copy.email}?subject=${encodeURIComponent(`${w.ctaSubject}: ${c.title.replace(/\u00a0/g, ' ')}`)}`
    const others = CASE_STUDIES.filter((s) => s.slug !== slug)
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: c.title.replace(/\u00a0/g, ' '),
        description: c.summary,
        inLanguage: lang,
        url,
        mainEntityOfPage: url,
        datePublished: study.published,
        dateModified: study.updated,
        author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: PERSON.name, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#person` },
        isPartOf: { '@type': 'CollectionPage', url: `${SITE_URL}${localePath(lang, '/work')}` },
    }

    return (
        <>
            <WorkHeader lang={lang} name={k.common.name} navLabel={k.nav.main} indexLabel={w.eyebrow} sub={sub} />
            <main
                id="main-content"
                tabIndex={-1}
                className="kn-article outline-none px-6 sm:px-10 md:px-[max(3rem,7vw)] pt-[calc(var(--nav-h)+3rem)] md:pt-[calc(var(--nav-h)+5rem)] pb-24 md:pb-32"
            >
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
                <article className="mx-auto w-full max-w-[46rem]">
                    <p className="t-eyebrow">{w.caseStudy} · {c.area}</p>
                    <h1 className="t-headline mt-2 text-[2.25rem] md:text-[3.25rem]">{c.title}</h1>
                    <p className="t-lede mt-5 md:mt-6 text-[1.1875rem] md:text-[1.3125rem]">{c.summary}</p>

                    {/* The figure, then the facts behind it. */}
                    <div className="mt-10 md:mt-12 pt-8 border-t border-[var(--line)] grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10">
                        <p className="flex flex-col">
                            <span className="t-stat text-[4rem] md:text-[5rem]">
                                {c.stat.value}
                                {c.stat.unit && <span className="ml-1 text-[0.42em] tracking-[0.004em]">{c.stat.unit}</span>}
                            </span>
                            <span className="mt-3 t-small text-[var(--muted)]">{c.stat.label}</span>
                        </p>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                            {c.facts.map((fact) => (
                                <div key={fact.label}>
                                    <dt className="t-caption text-[var(--muted)]">{fact.label}</dt>
                                    <dd className="mt-1 t-small text-[var(--foreground)]">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {c.sections.map((section) => (
                        <section key={section.heading} className="mt-12 md:mt-14">
                            <h2 className="t-title text-[1.5rem] md:text-[1.75rem]">{section.heading}</h2>
                            {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph} className="t-body mt-4">{paragraph}</p>
                            ))}
                            {section.points && (
                                <ul className="mt-4 space-y-3 t-body list-disc pl-5 marker:text-[var(--muted)]">
                                    {section.points.map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}

                    <p className="mt-12 md:mt-14 t-caption text-[var(--muted)]">
                        {w.updated} <time dateTime={study.updated}>{updated}</time> · {w.note}
                    </p>

                    <aside aria-labelledby="cta-title" className="mt-12 pt-10 border-t border-[var(--line)]">
                        <h2 id="cta-title" className="t-title text-[1.5rem] md:text-[1.75rem]">{w.ctaTitle}</h2>
                        <div className="mt-5 flex flex-wrap gap-3.5">
                            <a href={mailto} className="kn-pill kn-pill--fill">{w.ctaSend}</a>
                            {CV && (
                                <a href={CV.path} download="Andreas-Fragkiadakis-CV.pdf" className="kn-pill kn-pill--line">
                                    {k.contact.resume}
                                    <span className="sr-only"> (PDF, {CV.sizeLabel})</span>
                                </a>
                            )}
                        </div>
                    </aside>

                    {others.length > 0 && (
                        <nav aria-labelledby="more-title" className="mt-14">
                            <h2 id="more-title" className="t-small font-semibold text-[var(--foreground)] pb-3 border-b border-[var(--line)]">{w.all}</h2>
                            <ul>
                                {others.map((other) => (
                                    <li key={other.slug} className="border-b border-[var(--line)]">
                                        <a href={localePath(lang, `/work/${other.slug}`)} className="group flex items-center justify-between gap-4 py-4 hover:text-[var(--accent)] transition-colors">
                                            <span className="min-w-0">
                                                <span className="block t-caption text-[var(--muted)]">{w.caseStudy} · {other.copy[lang].area}</span>
                                                <span className="block mt-1 t-body">{other.copy[lang].title}</span>
                                            </span>
                                            <ChevronRight className="shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </article>
            </main>
        </>
    )
}
