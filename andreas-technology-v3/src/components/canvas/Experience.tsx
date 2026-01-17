'use client'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useRef } from 'react'

interface BinaryParticle {
    x: number
    y: number
    char: string
    life: number
    maxLife: number
    velocity: { x: number; y: number }
}

export default function Experience() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<BinaryParticle[]>([])
    const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 })
    const animationFrameRef = useRef<number | undefined>(undefined)
    const mobileIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const isInitializedRef = useRef(false)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Detect if device is mobile/touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        const isSmallScreen = window.innerWidth < 1024
        const isMobile = isTouchDevice && isSmallScreen

        // Mouse move handler (only for desktop)
        const handleMouseMove = (e: MouseEvent) => {
            // Initialize mouse position on first movement
            if (!isInitializedRef.current) {
                mouseRef.current.x = e.clientX
                mouseRef.current.y = e.clientY
                mouseRef.current.lastX = mouseRef.current.x
                mouseRef.current.lastY = mouseRef.current.y
                isInitializedRef.current = true
                return
            }

            mouseRef.current.lastX = mouseRef.current.x
            mouseRef.current.lastY = mouseRef.current.y
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY

            // Create particles along the path - 50% CLOSER to cursor
            const dx = mouseRef.current.x - mouseRef.current.lastX
            const dy = mouseRef.current.y - mouseRef.current.lastY
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Only create particles if mouse moved at least 3 pixels (reduced from 5 for closer spacing)
            if (distance < 3) return

            // Create particles closer together (reduced from 23 to 12)
            const steps = Math.ceil(distance / 12)

            for (let i = 0; i < steps; i++) {
                const t = i / steps
                const x = mouseRef.current.lastX + dx * t
                const y = mouseRef.current.lastY + dy * t

                particlesRef.current.push({
                    x,
                    y,
                    char: Math.random() > 0.5 ? '0' : '1',
                    life: 0,
                    maxLife: 80, // Slightly shorter life for crisper look
                    velocity: {
                        x: (Math.random() - 0.5) * 0.3, // Less spread
                        y: (Math.random() - 0.5) * 0.3,
                    },
                })
            }
        }

        // Register mouse events only on desktop
        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
        } else {
            // For mobile, create subtle background particles at random positions
            const createBackgroundParticle = () => {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    char: Math.random() > 0.5 ? '0' : '1',
                    life: 0,
                    maxLife: 400,
                    velocity: {
                        x: 0,
                        y: 0.5 + Math.random() * 0.5,
                    },
                })
            }

            mobileIntervalRef.current = setInterval(() => {
                if (particlesRef.current.length < 10) {
                    createBackgroundParticle()
                }
            }, 300)
        }

        // Clear canvas when scrolling away from hero section
        const handleScroll = () => {
            const heroSection = document.getElementById('hero')
            const scroller = document.getElementById('scroller')

            if (heroSection && scroller) {
                const rect = heroSection.getBoundingClientRect()
                if (rect.bottom < window.innerHeight * 0.3) {
                    particlesRef.current = []
                }
            }
        }

        const scroller = document.getElementById('scroller')
        if (scroller) {
            scroller.addEventListener('scroll', handleScroll)
        } else {
            window.addEventListener('scroll', handleScroll)
        }

        // Animation loop
        const animate = () => {
            const bgColor = theme === 'light'
                ? 'rgba(255, 255, 255, 0.25)'
                : 'rgba(0, 0, 0, 0.25)'
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particlesRef.current = particlesRef.current.filter(particle => {
                particle.life++
                particle.x += particle.velocity.x
                particle.y += particle.velocity.y
                particle.velocity.y += 0.02

                if (particle.life >= particle.maxLife) {
                    return false
                }

                const opacity = Math.max(0, 1 - (particle.life / particle.maxLife) * 1.5)

                const color = theme === 'light'
                    ? `rgba(0, 0, 170, ${opacity})`
                    : `rgba(34, 197, 94, ${opacity})`

                ctx.fillStyle = color
                ctx.font = 'bold 24px monospace'
                ctx.fillText(particle.char, particle.x, particle.y)

                return true
            })

            if (particlesRef.current.length > 150) {
                particlesRef.current = particlesRef.current.slice(-150)
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            const scroller = document.getElementById('scroller')
            if (scroller) {
                scroller.removeEventListener('scroll', handleScroll)
            } else {
                window.removeEventListener('scroll', handleScroll)
            }
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (mobileIntervalRef.current) {
                clearInterval(mobileIntervalRef.current)
            }
        }
    }, [theme])

    return (
        <div className="h-full w-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-none pointer-events-none"
                style={{ background: theme === 'light' ? '#ffffff' : '#000000' }}
            />
        </div>
    )
}
