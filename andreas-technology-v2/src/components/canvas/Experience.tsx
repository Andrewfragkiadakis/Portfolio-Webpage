'use client'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useRef, useCallback } from 'react'

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
    const isVisibleRef = useRef(true)
    const lastFrameTimeRef = useRef(0)
    const mouseThrottleRef = useRef<NodeJS.Timeout | null>(null)
    const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null)
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
        // Check for touch capability AND screen size to avoid false positives on laptops with touchscreens
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        const isSmallScreen = window.innerWidth < 1024 // Treat tablets as mobile for this animation
        const isMobile = isTouchDevice && isSmallScreen

        // Throttled mouse move handler (only for desktop)
        const handleMouseMove = (e: MouseEvent) => {
            // Throttle to 60fps max (16ms)
            if (mouseThrottleRef.current) return
            
            mouseThrottleRef.current = setTimeout(() => {
                mouseThrottleRef.current = null
            }, 16)

            // Use clientX/clientY directly since canvas fills the screen

            // Initialize mouse position on first movement
            if (!isInitializedRef.current) {
                mouseRef.current.x = e.clientX
                mouseRef.current.y = e.clientY
                mouseRef.current.lastX = mouseRef.current.x
                mouseRef.current.lastY = mouseRef.current.y
                isInitializedRef.current = true
                return // Don't create particles on first movement
            }

            mouseRef.current.lastX = mouseRef.current.x
            mouseRef.current.lastY = mouseRef.current.y
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY

            // Create particles along the path
            const dx = mouseRef.current.x - mouseRef.current.lastX
            const dy = mouseRef.current.y - mouseRef.current.lastY
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Only create particles if mouse moved at least 10 pixels to prevent clustering
            if (distance < 5) return

            const steps = Math.ceil(distance / 23) // Increased from 15 to prevent overlapping

            for (let i = 0; i < steps; i++) {
                const t = i / steps
                const x = mouseRef.current.lastX + dx * t
                const y = mouseRef.current.lastY + dy * t

                particlesRef.current.push({
                    x,
                    y,
                    char: Math.random() > 0.5 ? '0' : '1',
                    life: 0,
                    maxLife: 100,
                    velocity: {
                        x: (Math.random() - 0.5) * 0.5,
                        y: (Math.random() - 0.5) * 0.5,
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
                    y: Math.random() * canvas.height * 0.5, // Start mostly in top half
                    char: Math.random() > 0.5 ? '0' : '1',
                    life: 0,
                    maxLife: 400, // Much longer life for mobile to allow falling
                    velocity: {
                        x: 0,
                        y: 0.5 + Math.random() * 0.5, // Steady downward flow
                    },
                })
            }

            // Create background particles periodically
            mobileIntervalRef.current = setInterval(() => {
                // Maintain around 20 particles (reduced for subtlety)
                if (particlesRef.current.length < 20) {
                    createBackgroundParticle()
                }
            }, 150) // Check every 150ms
        }

        // Clear canvas when scrolling away from hero section - throttled
        const handleScroll = () => {
            if (scrollThrottleRef.current) return
            
            scrollThrottleRef.current = setTimeout(() => {
                scrollThrottleRef.current = null
            }, 100)

            const heroSection = document.getElementById('hero')
            const scroller = document.getElementById('scroller')

            if (heroSection && scroller) {
                const rect = heroSection.getBoundingClientRect()
                // If hero section is mostly out of view, pause animation
                const wasVisible = isVisibleRef.current
                isVisibleRef.current = rect.bottom > window.innerHeight * 0.3
                
                // Clear particles when becoming invisible to save memory
                if (wasVisible && !isVisibleRef.current) {
                    particlesRef.current = []
                }
                
                // Restart animation when becoming visible
                if (!wasVisible && isVisibleRef.current && !animationFrameRef.current) {
                    animationFrameRef.current = requestAnimationFrame(animate)
                }
            }
        }

        const scroller = document.getElementById('scroller')
        if (scroller) {
            scroller.addEventListener('scroll', handleScroll)
        } else {
            window.addEventListener('scroll', handleScroll)
        }

        // Animation loop with frame rate limiting (30fps to save CPU)
        const animate = (currentTime: number = 0) => {
            // Skip rendering if not visible to save CPU
            if (!isVisibleRef.current) {
                // Don't schedule next frame when not visible
                return
            }

            // Limit to ~30fps for better performance (33ms)
            const targetFrameTime = 33
            if (currentTime - lastFrameTimeRef.current < targetFrameTime) {
                animationFrameRef.current = requestAnimationFrame(animate)
                return
            }
            lastFrameTimeRef.current = currentTime

            // Theme-aware background colors with faster fade
            const bgColor = theme === 'light'
                ? 'rgba(255, 255, 255, 0.25)' // Faster fade for light mode
                : 'rgba(9, 9, 11, 0.25)' // Faster fade for dark mode
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.life++
                particle.x += particle.velocity.x
                particle.y += particle.velocity.y
                particle.velocity.y += 0.02 // Very gentle gravity

                if (particle.life >= particle.maxLife) {
                    return false
                }

                // Calculate opacity based on life with faster fade
                const opacity = Math.max(0, 1 - (particle.life / particle.maxLife) * 1.5)

                // Theme-aware colors: dark gray for light mode, Matrix green for dark
                const color = theme === 'light'
                    ? `rgba(31, 41, 55, ${opacity})` // gray-800
                    : `rgba(0, 255, 65, ${opacity})` // Matrix green

                ctx.fillStyle = color
                ctx.font = 'bold 24px monospace'
                ctx.fillText(particle.char, particle.x, particle.y)

                return true
            })

            // Limit number of particles for performance and visual clarity
            if (particlesRef.current.length > 100) {
                particlesRef.current = particlesRef.current.slice(-100)
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
            if (mouseThrottleRef.current) {
                clearTimeout(mouseThrottleRef.current)
            }
            if (scrollThrottleRef.current) {
                clearTimeout(scrollThrottleRef.current)
            }
        }
    }, [theme]) // Re-run when theme changes

    return (
        <div className="h-full w-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-none pointer-events-none"
                style={{ background: theme === 'light' ? '#ffffff' : '#09090b' }}
            />
        </div>
    )
}
