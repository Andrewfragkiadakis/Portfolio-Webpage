import Navigation from '@/components/dom/Navigation'
import MainContent from '@/components/MainContent'

export default function Home() {
    return (
        <>
            <Navigation />
            <main id="main-content" className="relative z-10 w-full">
                <MainContent />
            </main>
        </>
    )
}
