import 'server-only'
import type { Locale } from '@/data/locales'

/**
 * Case studies, served at /work/<slug> (English) and /el/work/<slug> (Greek).
 * Only figures that also appear on the CV are used, and the employer stays unnamed:
 * these pages describe security work, so the method is public and the internals are not.
 */

export interface CaseStudyCopy {
    /** Area of work, shown as the eyebrow: "Case study · <area>". */
    area: string
    title: string
    /** One or two sentences: the index card, the page lede and the meta description. */
    summary: string
    /** The headline figure, shown large. */
    stat: { value: string; unit?: string; label: string }
    /** Short facts under the lede. */
    facts: { label: string; value: string }[]
    sections: { heading: string; paragraphs?: string[]; points?: string[] }[]
}

export interface CaseStudy {
    slug: string
    /** First publication and last edit (ISO dates), for the sitemap and Article JSON-LD. */
    published: string
    updated: string
    copy: Record<Locale, CaseStudyCopy>
}

export interface WorkCopy {
    eyebrow: string
    title: string
    lede: string
    caseStudy: string
    read: string
    all: string
    updated: string
    ctaTitle: string
    ctaSend: string
    ctaSubject: string
    note: string
    metaDescription: string
}

export const WORK_COPY: Record<Locale, WorkCopy> = {
    en: {
        eyebrow: 'Case studies',
        title: 'Behind the numbers.',
        lede: 'Two projects from running 550+ Macs at a global conversational-AI company: the problem, what I built and what changed.',
        caseStudy: 'Case study',
        read: 'Read the case study',
        all: 'All case studies',
        updated: 'Updated',
        ctaTitle: 'Working on something similar?',
        ctaSend: 'Email me',
        ctaSubject: 'About your case study',
        note: 'I keep details general to protect my employer’s systems.',
        metaDescription: 'How Andreas Fragkiadakis cut critical Mac vulnerabilities by 95% in 60 days and new-Mac setup from 2+ hours to under 30 minutes.',
    },
    el: {
        eyebrow: 'Μελέτες περίπτωσης',
        title: 'Πίσω από τους αριθμούς.',
        lede: 'Δύο έργα από τη διαχείριση 550+ Mac σε μια διεθνή εταιρεία conversational AI: το πρόβλημα, τι έφτιαξα και τι άλλαξε.',
        caseStudy: 'Μελέτη περίπτωσης',
        read: 'Διαβάστε τη μελέτη',
        all: 'Όλες οι μελέτες',
        updated: 'Ενημέρωση',
        ctaTitle: 'Δουλεύετε σε κάτι παρόμοιο;',
        ctaSend: 'Στείλτε μου email',
        ctaSubject: 'Σχετικά με τη μελέτη περίπτωσης',
        note: 'Κρατάω τις λεπτομέρειες γενικές για να προστατεύω τα συστήματα του εργοδότη μου.',
        metaDescription: 'Πώς ο Ανδρέας Φραγκιαδάκης μείωσε τις κρίσιμες ευπάθειες των Mac κατά 95% σε 60 ημέρες και το στήσιμο νέου Mac από 2+ ώρες σε κάτω από 30 λεπτά.',
    },
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        slug: 'vulnerability-burndown',
        published: '2026-10-25',
        updated: '2026-10-25',
        copy: {
            en: {
                area: 'Endpoint security',
                title: 'Critical Mac vulnerabilities down 95% in 60 days',
                summary: 'A large backlog of open findings across 550+ Macs, with audits coming up. I connected Rapid7 findings to Jamf Pro policies that fix affected Macs automatically, so the team only handles what a script can’t.',
                stat: { value: '−95%', label: 'critical vulnerabilities in 60 days' },
                facts: [
                    { label: 'Role', value: 'Designed and built it end to end' },
                    { label: 'Scope', value: '550+ Macs' },
                    { label: 'Stack', value: 'Rapid7 · Jamf Pro · Bash' },
                    { label: 'Measured in', value: 'Rapid7, every week' },
                ],
                sections: [
                    {
                        heading: 'The problem',
                        paragraphs: [
                            'The Mac fleet carried a large backlog of open vulnerability findings, and audits were coming up. Fixing findings by hand, one Mac at a time, does not scale to 550+ machines, and the backlog grows back as new findings arrive.',
                        ],
                    },
                    {
                        heading: 'What I built',
                        points: [
                            'Rapid7 findings map to smart groups in Jamf Pro: an affected Mac lands in the group for its finding.',
                            'Each group has a remediation policy that runs a Bash script, so the script fixes the Mac without anyone touching it.',
                            'Macs that drop out of management detect it and repair themselves, so they stay in scope for the fixes.',
                            'A daily triage handles what the automation can’t fix, and a weekly report goes to leadership.',
                        ],
                    },
                    {
                        heading: 'How I measured it',
                        paragraphs: [
                            'One number: the count of critical findings on our Macs in Rapid7, checked every week. The same number went into the weekly report, so the team and leadership tracked the same figure.',
                        ],
                    },
                    {
                        heading: 'Result',
                        paragraphs: [
                            'Critical vulnerabilities fell 95% in 60 days, and the fixes keep running on their own. A Mac with a new finding joins a smart group and the policy fixes it, so the team’s time goes to the cases that need a person.',
                        ],
                    },
                    {
                        heading: 'What I’d reuse',
                        points: [
                            'Fix by group, not by machine: one policy covers every affected Mac, now and later.',
                            'Pick one number and report it the same way every week.',
                            'Automate the common case and triage the rest by hand.',
                        ],
                    },
                ],
            },
            el: {
                area: 'Ασφάλεια endpoints',
                title: '95% λιγότερες κρίσιμες ευπάθειες στα Mac σε 60 ημέρες',
                summary: 'Πολλά ανοιχτά ευρήματα ευπαθειών σε 550+ Mac, με audits προ των πυλών. Συνέδεσα τα ευρήματα του Rapid7 με πολιτικές του Jamf Pro που διορθώνουν αυτόματα τα Mac που επηρεάζονται, ώστε η ομάδα να ασχολείται μόνο με ό,τι δεν λύνει ένα script.',
                stat: { value: '−95%', label: 'κρίσιμες ευπάθειες σε 60 ημέρες' },
                facts: [
                    { label: 'Ρόλος', value: 'Σχεδιασμός και υλοποίηση από άκρη σε άκρη' },
                    { label: 'Εύρος', value: '550+ Mac' },
                    { label: 'Εργαλεία', value: 'Rapid7 · Jamf Pro · Bash' },
                    { label: 'Μέτρηση', value: 'Rapid7, κάθε εβδομάδα' },
                ],
                sections: [
                    {
                        heading: 'Το πρόβλημα',
                        paragraphs: [
                            'Ο στόλος των Mac είχε συσσωρεύσει πολλά ανοιχτά ευρήματα ευπαθειών και τα audits πλησίαζαν. Η χειροκίνητη διόρθωση, ένα Mac τη φορά, δεν κλιμακώνεται σε 550+ μηχανήματα, και τα ευρήματα ξαναμαζεύονται μόλις εμφανιστούν νέα.',
                        ],
                    },
                    {
                        heading: 'Τι έφτιαξα',
                        points: [
                            'Κάθε εύρημα του Rapid7 αντιστοιχεί σε ένα smart group του Jamf Pro: ένα Mac που επηρεάζεται μπαίνει στο group του ευρήματος.',
                            'Κάθε group έχει μια πολιτική διόρθωσης που τρέχει ένα Bash script, οπότε το Mac διορθώνεται χωρίς να το αγγίξει κανείς.',
                            'Τα Mac που βγαίνουν από τη διαχείριση το εντοπίζουν και επισκευάζονται μόνα τους, ώστε να συνεχίζουν να παίρνουν τις διορθώσεις.',
                            'Ένα καθημερινό triage καλύπτει ό,τι δεν διορθώνει ο αυτοματισμός, και μια εβδομαδιαία αναφορά πηγαίνει στη διοίκηση.',
                        ],
                    },
                    {
                        heading: 'Πώς το μέτρησα',
                        paragraphs: [
                            'Ένας αριθμός: τα κρίσιμα ευρήματα στα Mac μας στο Rapid7, κάθε εβδομάδα. Ο ίδιος αριθμός έμπαινε στην εβδομαδιαία αναφορά, οπότε ομάδα και διοίκηση παρακολουθούσαν το ίδιο νούμερο.',
                        ],
                    },
                    {
                        heading: 'Αποτέλεσμα',
                        paragraphs: [
                            'Οι κρίσιμες ευπάθειες μειώθηκαν κατά 95% σε 60 ημέρες και οι διορθώσεις συνεχίζουν να τρέχουν μόνες τους. Ένα Mac με νέο εύρημα μπαίνει σε smart group και η πολιτική το διορθώνει, έτσι ο χρόνος της ομάδας πηγαίνει στις περιπτώσεις που χρειάζονται άνθρωπο.',
                        ],
                    },
                    {
                        heading: 'Τι θα κρατούσα',
                        points: [
                            'Διόρθωση ανά group, όχι ανά μηχάνημα: μία πολιτική καλύπτει κάθε Mac που επηρεάζεται, τώρα και αργότερα.',
                            'Ένας αριθμός, που αναφέρεται με τον ίδιο τρόπο κάθε εβδομάδα.',
                            'Αυτοματισμός για τη συνηθισμένη περίπτωση, χειροκίνητο triage για τις υπόλοιπες.',
                        ],
                    },
                ],
            },
        },
    },
    {
        slug: 'zero-touch-onboarding',
        published: '2026-10-25',
        updated: '2026-10-25',
        copy: {
            en: {
                area: 'Apple fleet',
                title: 'New-Mac setup from 2+ hours to under 30 minutes',
                summary: 'Every new Mac took over two hours of hands-on setup. I connected Apple Business Manager to Jamf Pro so Macs set themselves up during enrolment, then handed the team a runbook.',
                stat: { value: '<30', unit: 'min', label: 'per new Mac, down from 2+ hours' },
                facts: [
                    { label: 'Role', value: 'Designed, built and documented it' },
                    { label: 'Fleet', value: '550+ Macs' },
                    { label: 'Stack', value: 'Apple Business Manager · Jamf Pro PreStage enrolment' },
                    { label: 'Handover', value: 'A runbook for the team' },
                ],
                sections: [
                    {
                        heading: 'Before',
                        paragraphs: [
                            'Every new Mac took over two hours of hands-on setup before its user could have it, and IT built each one by hand.',
                        ],
                    },
                    {
                        heading: 'What I built',
                        points: [
                            'Apple Business Manager assigns company-owned Macs to Jamf Pro, so a new Mac enrols itself through Automated Device Enrolment on first start-up.',
                            'A PreStage enrolment in Jamf Pro installs the core apps and settings during enrolment.',
                            'I wrote a runbook and handed it to the team, so the process doesn’t depend on one person.',
                        ],
                    },
                    {
                        heading: 'Result',
                        paragraphs: [
                            'Setup dropped from over two hours to under 30 minutes, and manual builds stopped.',
                        ],
                    },
                    {
                        heading: 'What I’d reuse',
                        points: [
                            'Let ownership do the work: a Mac assigned in Apple Business Manager finds its MDM on its own.',
                            'Install the essentials as part of enrolment.',
                            'Write the runbook as part of the project, not after it.',
                        ],
                    },
                ],
            },
            el: {
                area: 'Στόλος Apple',
                title: 'Στήσιμο νέου Mac: από 2+ ώρες σε κάτω από 30 λεπτά',
                summary: 'Κάθε νέο Mac χρειαζόταν πάνω από δύο ώρες χειροκίνητης προετοιμασίας. Συνέδεσα το Apple Business Manager με το Jamf Pro ώστε τα Mac να στήνονται μόνα τους κατά την εγγραφή τους, και παρέδωσα στην ομάδα ένα runbook.',
                stat: { value: '<30', unit: 'λεπτά', label: 'ανά νέο Mac, από 2+ ώρες' },
                facts: [
                    { label: 'Ρόλος', value: 'Σχεδιασμός, υλοποίηση και τεκμηρίωση' },
                    { label: 'Στόλος', value: '550+ Mac' },
                    { label: 'Εργαλεία', value: 'Apple Business Manager · Jamf Pro PreStage enrolment' },
                    { label: 'Παράδοση', value: 'Runbook για την ομάδα' },
                ],
                sections: [
                    {
                        heading: 'Πριν',
                        paragraphs: [
                            'Κάθε νέο Mac χρειαζόταν πάνω από δύο ώρες χειροκίνητης προετοιμασίας πριν φτάσει στον χρήστη του, και το IT έστηνε κάθε ένα με το χέρι.',
                        ],
                    },
                    {
                        heading: 'Τι έφτιαξα',
                        points: [
                            'Το Apple Business Manager αναθέτει τα εταιρικά Mac στο Jamf Pro, οπότε ένα νέο Mac εγγράφεται μόνο του μέσω Automated Device Enrolment με την πρώτη εκκίνηση.',
                            'Ένα PreStage enrolment στο Jamf Pro εγκαθιστά τις βασικές εφαρμογές και ρυθμίσεις κατά την εγγραφή.',
                            'Έγραψα ένα runbook και το παρέδωσα στην ομάδα, ώστε η διαδικασία να μην εξαρτάται από ένα άτομο.',
                        ],
                    },
                    {
                        heading: 'Αποτέλεσμα',
                        paragraphs: [
                            'Το στήσιμο έπεσε από πάνω από δύο ώρες σε κάτω από 30 λεπτά και τα χειροκίνητα στησίματα σταμάτησαν.',
                        ],
                    },
                    {
                        heading: 'Τι θα κρατούσα',
                        points: [
                            'Αφήστε την ιδιοκτησία να κάνει τη δουλειά: ένα Mac καταχωρημένο στο Apple Business Manager βρίσκει μόνο του το MDM του.',
                            'Οι βασικές εφαρμογές εγκαθίστανται ως μέρος της εγγραφής.',
                            'Το runbook γράφεται μέσα στο έργο, όχι αφού τελειώσει.',
                        ],
                    },
                ],
            },
        },
    },
]

/**
 * The site's generated social card (app/[lang]/opengraph-image.tsx). A page that sets its
 * own openGraph replaces the inherited one, so the case-study pages name the card again.
 */
export function socialImage(lang: Locale) {
    return { url: `/${lang}/opengraph-image`, width: 1200, height: 630, type: 'image/png', alt: 'Andreas Fragkiadakis — Apple fleets. Automated.' }
}

export function caseStudy(slug: string): CaseStudy | undefined {
    return CASE_STUDIES.find((study) => study.slug === slug)
}
