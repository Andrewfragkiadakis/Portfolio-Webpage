'use client'

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

const FPS_INTERVAL = 1000 / 30

export default function Experience() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<BinaryParticle[]>([])
    const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 })
    const animationFrameRef = useRef<number | undefined>(undefined)
    const mobileIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const isInitializedRef = useRef(false)
    const lastFrameTimeRef = useRef(0)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        const isSmallScreen = window.innerWidth < 1024
        const isMobile = isTouchDevice && isSmallScreen

        const handleMouseMove = (e: MouseEvent) => {
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

            const dx = mouseRef.current.x - mouseRef.current.lastX
            const dy = mouseRef.current.y - mouseRef.current.lastY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 3) return

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
                    maxLife: 80,
                    velocity: {
                        x: (Math.random() - 0.5) * 0.3,
                        y: (Math.random() - 0.5) * 0.3,
                    },
                })
            }
        }

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
        } else {
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

        const handleScroll = () => {
            const heroSection = document.getElementById('hero')
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect()
                if (rect.bottom < window.innerHeight * 0.3) {
                    particlesRef.current = []
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        const animate = (timestamp: number) => {
            animationFrameRef.current = requestAnimationFrame(animate)

            const elapsed = timestamp - lastFrameTimeRef.current
            if (elapsed < FPS_INTERVAL) return
            lastFrameTimeRef.current = timestamp - (elapsed % FPS_INTERVAL)

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
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                    animationFrameRef.current = undefined
                }
            } else {
                lastFrameTimeRef.current = performance.now()
                animationFrameRef.current = requestAnimationFrame(animate)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (mobileIntervalRef.current) {
                clearInterval(mobileIntervalRef.current)
            }
        }
    }, [theme])

    return (
        <div className="h-full w-full" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-none pointer-events-none"
                style={{ background: theme === 'light' ? '#ffffff' : '#000000' }}
            />
        </div>
    )
}
