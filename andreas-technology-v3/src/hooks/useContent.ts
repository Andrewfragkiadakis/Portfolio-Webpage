import { useCopy } from '@/contexts/LocaleContext'

/** The current page's copy, in its language. */
export function useContent() {
    return useCopy()
}
