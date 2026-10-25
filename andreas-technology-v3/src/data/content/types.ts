import type { ToolGroup, ToolLabel } from '@/data/tools'
import type { GlyphName } from '@/components/ui/Glyph'
import type { SectionId } from '@/data/sections'

export interface Skill {
    /** Stable key, the same in every language. */
    id: string
    icon: GlyphName
    label: string
    detail: string
}

export interface Service {
    id: string
    icon: GlyphName
    title: string
    /** Keynote one-liner shown on the feature grid (one short sentence). */
    oneLiner: string
    /** Short explanation shown when the card is opened. */
    detail: string
    /** Concrete, factual examples of the work. */
    highlights: string[]
    /** Curated toolkit for this area, drawn from data/tools.ts. */
    tools: ToolLabel[]
}

export interface Experience {
    id: string
    role: string
    company: string
    duration: string
    tasks: string[]
    /** The role shown as "Now" on the Career slide. */
    current?: boolean
    /** Day-to-day toolkit shown under the current role. */
    stack?: ToolLabel[]
}

export type EducationKind = 'degree' | 'certification' | 'license'

export interface Education {
    id: string
    degree: string
    institution: string
    duration: string
    details: string[]
    link?: string
    /** Drives the card icon and whether it appears in the About credential strip. Defaults to 'degree'. */
    kind?: EducationKind
    /** Short label for credential badges, e.g. "JAMF 200". */
    badge?: string
}

export interface Project {
    id: string
    name: string
    tags: string[]
    /** Short summary shown on the card. */
    description: string
    /** Longer story shown in the detail dialog. */
    detail?: string
    /** How the work was done, e.g. "Solo build" or "Team of 4 — UX lead". */
    role?: string
    /** Concrete outcomes shown as bullets in the detail dialog. */
    highlights?: string[]
    year?: number
    githubLink?: string
    liveSiteLink?: string
    reportLink?: string
    publicationLink?: string
    image?: string
    /**
     * How the screenshot fills its 16:10 frame. Defaults to 'contain' (whole image,
     * blurred fill behind) so nothing is ever cut off; use 'cover' only when the
     * subject survives the crop.
     */
    imageFit?: 'cover' | 'contain'
    /** CSS object-position for 'cover' crops, e.g. "50% 62%" to keep the subject in frame. */
    imagePosition?: string
    /**
     * Colours of the screenshot's top and bottom edges. A letterboxed (`contain`)
     * screenshot sits on a gradient between them, so its spare space reads as image.
     */
    edges?: readonly [string, string]
    /**
     * Which device frame the screenshot is shown in: a laptop (default), a phone for
     * mobile-first work, or 'bare' when the image is already a product shot.
     */
    device?: 'laptop' | 'phone' | 'bare'
}

/** Copy written for the Apple Keynote layout: short, sentence-case, fully accented Greek. */
export interface KeynoteCopy {
    common: { name: string; close: string; newTab: string; skip: string }
    nav: {
        /** Short nav label for every slide. */
        sections: Record<SectionId, string>
        main: string; menu: string; slides: string
        cta: string; openMenu: string; closeMenu: string; switchLanguage: string
        toLight: string; toDark: string; appearance: string; language: string; light: string; dark: string
    }
    hero: { headline: string; sub: string; viewWork: string; contact: string; note: string }
    about: {
        eyebrow: string; headline: string; bio: string; fullStory: string; dialogTitle: string
        credentials: string; focus: string
        /** Link to the case studies (/work), next to the full-story link. */
        caseStudies: string
        /** By the numbers: the first is the slide's large figure. */
        stats: { value: number; suffix: string; unit?: string; label: string }[]
    }
    services: {
        eyebrow: string; headline: string; learnMore: string
        ctaLead: string; ctaLink: string; highlights: string; toolkit: string
    }
    specs: {
        eyebrow: string; headline: string; sub: string
        groups: Record<ToolGroup, string>
    }
    experience: {
        eyebrow: string; headline: string; now: string; then: string; education: string
        more: string; verify: string; tasks: string; details: string
    }
    projects: {
        eyebrow: string; headline: string; learnMore: string; visit: string; code: string; report: string
        publication: string; github: string; lineup: string; highlights: string
    }
    contact: {
        eyebrow: string; headline: string; sub: string; send: string; subject: string; resume: string; email: string
        location: string; time: string; elsewhere: string; copy: string; copied: string; copyFailed: string
    }
}

/** Everything one language shows. Each locale file (en.ts, el.ts) is one of these. */
export interface Content {
    location: string
    email: string
    github: string
    linkedin: string
    about: {
        /** Paragraphs of the full bio dialog. */
        description: string[]
    }
    skills: Skill[]
    services: Service[]
    experience: Experience[]
    education: Education[]
    projects: Project[]
    copyright: string
    keynote: KeynoteCopy
}
