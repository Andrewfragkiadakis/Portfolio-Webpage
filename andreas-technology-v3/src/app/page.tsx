'use client'

import Navigation from '@/components/dom/Navigation'
import MobileNav from '@/components/dom/MobileNav'
import HorizontalLayout from '@/components/HorizontalLayout'
import { useEffect } from 'react'

export default function Home() {
  // Scroll to top on page load/reload
  useEffect(() => {
    window.scrollTo(0, 0)
    // Also reset any hash in URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return (
    <>
      {/* Navigation - Highest layer */}
      <Navigation />
      <MobileNav />

      {/* Horizontal Layout - Main Scroll Container */}
      <main className="relative z-10 w-full h-[600vh]">
        <HorizontalLayout />
      </main>
    </>
  )
}
