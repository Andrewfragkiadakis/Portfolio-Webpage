import Navigation from '@/components/dom/Navigation'
import MainContent from '@/components/MainContent'

export default function Home() {
    return (
        <>
            <Navigation />
            <main id="main-content" tabIndex={-1} className="relative z-10 w-full outline-none">
                <MainContent />
            </main>
        </>
    )
}
