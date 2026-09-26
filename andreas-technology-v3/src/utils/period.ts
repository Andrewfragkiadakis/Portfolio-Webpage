const MONTHS: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
    ιανουάριος: '01', φεβρουάριος: '02', μάρτιος: '03', απρίλιος: '04', μάιος: '05', ιούνιος: '06',
    ιούλιος: '07', αύγουστος: '08', σεπτέμβριος: '09', οκτώβριος: '10', νοέμβριος: '11', δεκέμβριος: '12',
}

/**
 * "September 2024 – May 2026" → "09.2024 – 05.2026" for the index tables, where
 * tabular figures line up down the column. Words it does not know ("Present",
 * "Σήμερα") pass through; the full wording stays in dialogs and aria labels.
 */
export function shortPeriod(duration: string): string {
    return duration
        .replace(/(\p{L}+)\s(\d{4})/gu, (match, name: string, year: string) => {
            const month = MONTHS[name.toLocaleLowerCase('el')] ?? MONTHS[name.toLowerCase()]
            return month ? `${month}.${year}` : match
        })
        .replace(/\s[-–]\s/g, ' – ')
}

/**
 * "September 2024 – May 2026" → "2024 – 2026"; an open-ended period ends in
 * `nowLabel`; a single year stays as it is. Used for the Year column of the index
 * tables, where the full wording would wrap.
 */
export function yearSpan(duration: string, nowLabel: string): string {
    const years = duration.match(/\d{4}/g) ?? []
    if (years.length === 0) return duration
    const open = !/\d{4}\s*$/.test(duration.trim())
    const start = years[0]
    if (open) return `${start} – ${nowLabel}`
    const end = years[years.length - 1]
    return start === end ? start : `${start} – ${end}`
}
