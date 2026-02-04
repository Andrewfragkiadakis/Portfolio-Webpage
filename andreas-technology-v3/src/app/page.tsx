'use client'

import dynamic from 'next/dynamic'
import { useEffect, Suspense } from 'react'
import Navigation from '@/components/dom/Navigation'
import MobileNav from '@/components/dom/MobileNav'

const HorizontalLayout = dynamic(() => import('@/components/HorizontalLayout'), { ssr: false })

function MainFallback() {
  return <div className="relative z-10 w-full min-h-screen" aria-hidden />
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return (
    <>
      <Navigation />
      <MobileNav />
      <main className="relative z-10 w-full h-[600vh]">
        <Suspense fallback={<MainFallback />}>
          <HorizontalLayout />
        </Suspense>
      </main>
    </>
  )
}
