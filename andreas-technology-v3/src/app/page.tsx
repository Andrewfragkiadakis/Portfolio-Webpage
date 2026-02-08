import { Suspense } from 'react'
import Navigation from '@/components/dom/Navigation'
import MobileNav from '@/components/dom/MobileNav'
import MainContent from '@/components/MainContent'

function MainFallback() {
    return <div className="relative z-10 w-full min-h-screen" aria-hidden />
}

export default function Home() {
    return (
        <>
            <Navigation />
            <MobileNav />
            <main id="main-content" className="relative z-10 w-full h-[600vh]">
                <Suspense fallback={<MainFallback />}>
                    <MainContent />
                </Suspense>
            </main>
        </>
    )
}
