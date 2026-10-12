import 'server-only'
import type { Locale } from '@/data/locales'
import type { Content } from './types'
import en from './en'
import el from './el'

/**
 * Server-side only: each page passes its own language to the client, so a visitor
 * never downloads the other language's copy.
 */
export const content: Record<Locale, Content> = { en, el }

export type { Content } from './types'
