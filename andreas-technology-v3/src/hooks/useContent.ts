import { useLanguage } from '@/contexts/LanguageContext'
import { content as allContent } from '@/data/content'

export function useContent() {
    const { language } = useLanguage()
    return allContent[language]
}
