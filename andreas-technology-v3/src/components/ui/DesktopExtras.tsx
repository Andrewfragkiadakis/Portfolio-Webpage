'use client'

import dynamic from 'next/dynamic'
import { useDesktopState } from '@/contexts/DesktopContext'

// The "Jamf 200" banner is desktop-only and appears seconds after entry, so its code is
// fetched after hydration on desktop and never on phones.
const Notification = dynamic(() => import('@/components/ui/Notification'), { ssr: false })

export default function DesktopExtras() {
    const isDesktop = useDesktopState((s) => s.isDesktop)
    return isDesktop ? <Notification /> : null
}
