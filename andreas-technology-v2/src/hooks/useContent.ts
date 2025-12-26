import { useLanguage } from '@/contexts/LanguageContext'
import { content as allContent } from '@/data/content'
import { useMemo } from 'react'

export function useContent() {
    const { language } = useLanguage()
    return useMemo(() => allContent[language], [language])
}
