import { MAIL_SUBJECT } from '@/data/content'

/** Gmail compose window pre-addressed to `email` with the standard subject line. */
export function gmailComposeUrl(email: string): string {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(MAIL_SUBJECT)}`
}
