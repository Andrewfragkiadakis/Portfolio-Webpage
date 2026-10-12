import type { Locale } from '@/data/locales'

/** Search and share copy per language (title, description, Open Graph, X). */
export const META: Record<Locale, {
    title: string
    description: string
    shareDescription: string
    xDescription: string
    imageAlt: string
    siteDescription: string
}> = {
    en: {
        title: 'Andreas Fragkiadakis | Apple Fleet & IT Automation Lead',
        description: 'Team Lead for Apple Fleet & IT Automation at Omilia, Athens. Jamf Certified Tech (Jamf 200) running 550+ Macs: zero-touch enrollment, CIS hardening.',
        shareDescription: 'Apple fleets. Automated. 550+ Macs on Jamf Pro, enrolled zero-touch and hardened to CIS Benchmarks.',
        xDescription: 'Apple fleets. Automated. 550+ Macs on Jamf Pro, zero-touch and CIS-hardened.',
        imageAlt: 'Andreas Fragkiadakis — Apple fleets. Automated.',
        siteDescription: 'Portfolio of Andreas Fragkiadakis, Team Lead for Apple Fleet & IT Automation: Jamf Pro, endpoint security and automation for 550+ Macs.',
    },
    el: {
        title: 'Ανδρέας Φραγκιαδάκης | Apple Fleet & IT Automation Lead',
        description: 'Team Lead Apple Fleet & IT Automation στην Omilia, Αθήνα. Jamf Certified Tech (Jamf 200) με 550+ Mac: zero-touch enrollment και θωράκιση CIS.',
        shareDescription: 'Στόλοι Apple. Αυτοματοποιημένοι. 550+ Mac στο Jamf Pro, με zero-touch enrollment και θωράκιση κατά CIS Benchmarks.',
        xDescription: 'Στόλοι Apple. Αυτοματοποιημένοι. 550+ Mac στο Jamf Pro, zero-touch και θωράκιση CIS.',
        imageAlt: 'Ανδρέας Φραγκιαδάκης — Στόλοι Apple. Αυτοματοποιημένοι.',
        siteDescription: 'Portfolio του Ανδρέα Φραγκιαδάκη, Team Lead Apple Fleet & IT Automation: Jamf Pro, ασφάλεια τερματικών και αυτοματισμοί για 550+ Mac.',
    },
}

export const KEYWORDS = [
    'Andreas Fragkiadakis', 'Fragkiadakis', 'Apple fleet management', 'Jamf Pro', 'Jamf 200', 'Jamf Certified Tech', 'macOS', 'MDM', 'Apple Business Manager', 'IT automation', 'Endpoint security', 'CIS Benchmarks', 'IT Automation Lead', 'Security Engineer', 'Computer Engineer', 'M.Eng', 'ITIL 4', 'Athens', 'Greece',
    'Ανδρέας Φραγκιαδάκης', 'Φραγκιαδάκης', 'Μηχανικός Πληροφορικής και Υπολογιστών', 'Διαχείριση Mac', 'Αυτοματισμός IT', 'Ασφάλεια τερματικών',
]
