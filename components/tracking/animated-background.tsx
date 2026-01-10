'use client'

import { useEffect, useState, useRef } from 'react'

type EffectType = 'particles' | 'gradient' | 'mesh' | 'aurora' | 'stars' | 'waves'

interface AnimatedBackgroundProps {
    effect?: EffectType
    color?: string
    intensity?: 'low' | 'medium' | 'high'
    className?: string
}

// Particle class for physics-based movement
interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    hue: number
}

export function AnimatedBackground({
    effect = 'particles',
    color = '#6366f1',
    intensity = 'medium',
    className = ''
}: AnimatedBackgroundProps) {
    const [mounted, setMounted] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<Particle[]>([])

    const particleCounts = { low: 30, medium: 60, high: 100 }

    useEffect(() => {
        setMounted(true)

        if (effect === 'particles' || effect === 'stars') {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const resizeCanvas = () => {
                canvas.width = canvas.offsetWidth * window.devicePixelRatio
                canvas.height = canvas.offsetHeight * window.devicePixelRatio
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
            }
            resizeCanvas()
            window.addEventListener('resize', resizeCanvas)

            // Initialize particles
            const count = particleCounts[intensity]
            particlesRef.current = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                size: effect === 'stars' ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * (effect === 'stars' ? 0.2 : 1),
                speedY: (Math.random() - 0.5) * (effect === 'stars' ? 0.2 : 1),
                opacity: Math.random() * 0.5 + 0.3,
                hue: Math.random() * 60
            }))

            const animate = () => {
                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

                particlesRef.current.forEach((particle, i) => {
                    // Update position
                    particle.x += particle.speedX
                    particle.y += particle.speedY

                    // Boundary check
                    if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.speedX *= -1
                    if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.speedY *= -1

                    // Draw particle
                    if (effect === 'stars') {
                        // Star shape
                        ctx.save()
                        ctx.translate(particle.x, particle.y)
                        ctx.beginPath()
                        for (let j = 0; j < 5; j++) {
                            ctx.lineTo(0, -particle.size)
                            ctx.rotate(Math.PI / 5)
                            ctx.lineTo(0, -particle.size / 2)
                            ctx.rotate(Math.PI / 5)
                        }
                        ctx.closePath()
                        ctx.fillStyle = `hsla(${45 + particle.hue}, 100%, 70%, ${particle.opacity})`
                        ctx.fill()
                        ctx.restore()
                    } else {
                        // Circle
                        ctx.beginPath()
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                        ctx.fillStyle = `hsla(${240 + particle.hue}, 70%, 60%, ${particle.opacity})`
                        ctx.fill()
                    }

                    // Draw connections
                    if (effect === 'particles') {
                        particlesRef.current.slice(i + 1).forEach(other => {
                            const dx = particle.x - other.x
                            const dy = particle.y - other.y
                            const distance = Math.sqrt(dx * dx + dy * dy)

                            if (distance < 150) {
                                ctx.beginPath()
                                ctx.moveTo(particle.x, particle.y)
                                ctx.lineTo(other.x, other.y)
                                ctx.strokeStyle = `hsla(250, 70%, 60%, ${0.15 * (1 - distance / 150)})`
                                ctx.lineWidth = 1
                                ctx.stroke()
                            }
                        })
                    }
                })

                animationRef.current = requestAnimationFrame(animate)
            }

            animate()

            return () => {
                window.removeEventListener('resize', resizeCanvas)
                if (animationRef.current) cancelAnimationFrame(animationRef.current)
            }
        }
    }, [effect, intensity])

    if (!mounted) return null

    // Canvas-based effects
    if (effect === 'particles' || effect === 'stars') {
        return (
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            />
        )
    }

    // CSS-based effects
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {effect === 'gradient' && (
                <>
                    <div className="absolute inset-0 animate-gradient-shift">
                        <div
                            className="absolute top-0 left-0 w-[150%] h-[150%] opacity-30"
                            style={{
                                background: `
                                    radial-gradient(circle at 20% 20%, ${color}60 0%, transparent 50%),
                                    radial-gradient(circle at 80% 80%, #a855f760 0%, transparent 50%),
                                    radial-gradient(circle at 50% 50%, #22c55e40 0%, transparent 70%)
                                `
                            }}
                        />
                    </div>
                </>
            )}

            {effect === 'mesh' && (
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 animate-mesh-float"
                        style={{
                            background: `
                                radial-gradient(at 40% 20%, hsla(252,70%,60%,0.3) 0px, transparent 50%),
                                radial-gradient(at 80% 80%, hsla(189,70%,60%,0.3) 0px, transparent 50%),
                                radial-gradient(at 20% 60%, hsla(340,70%,60%,0.3) 0px, transparent 50%),
                                radial-gradient(at 60% 40%, hsla(45,70%,60%,0.2) 0px, transparent 50%)
                            `
                        }}
                    />
                </div>
            )}

            {effect === 'aurora' && (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%]">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-aurora-1" />
                        <div className="absolute top-1/4 left-1/4 w-3/4 h-1/3 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-aurora-2" />
                        <div className="absolute top-1/3 left-1/2 w-1/2 h-1/3 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-aurora-3" />
                    </div>
                </div>
            )}

            {effect === 'waves' && (
                <div className="absolute inset-0">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.15" />
                                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                            </linearGradient>
                        </defs>
                        <path className="animate-wave-1" fill="url(#wave-gradient)" d="M0,100 C150,60 350,140 500,100 C650,60 850,140 1000,100 L1000,200 L0,200 Z" />
                        <path className="animate-wave-2" fill="url(#wave-gradient)" d="M0,120 C150,80 350,160 500,120 C650,80 850,160 1000,120 L1000,200 L0,200 Z" />
                        <path className="animate-wave-3" fill="url(#wave-gradient)" d="M0,140 C150,100 350,180 500,140 C650,100 850,180 1000,140 L1000,200 L0,200 Z" />
                    </svg>
                </div>
            )}

            <style jsx>{`
                @keyframes gradient-shift {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-5%, 5%) rotate(5deg); }
                    50% { transform: translate(5%, -5%) rotate(-5deg); }
                    75% { transform: translate(-3%, -3%) rotate(3deg); }
                }
                .animate-gradient-shift {
                    animation: gradient-shift 20s ease-in-out infinite;
                }

                @keyframes mesh-float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(5%, 5%) scale(1.05); }
                    50% { transform: translate(-5%, -5%) scale(1.1); }
                    75% { transform: translate(-3%, 3%) scale(1.02); }
                }
                .animate-mesh-float {
                    animation: mesh-float 15s ease-in-out infinite;
                }

                @keyframes aurora-1 {
                    0%, 100% { transform: translateX(0) skewX(-15deg); opacity: 0.6; }
                    50% { transform: translateX(10%) skewX(-5deg); opacity: 0.8; }
                }
                @keyframes aurora-2 {
                    0%, 100% { transform: translateX(0) skewX(10deg); opacity: 0.5; }
                    50% { transform: translateX(-15%) skewX(20deg); opacity: 0.7; }
                }
                @keyframes aurora-3 {
                    0%, 100% { transform: translateX(0) skewX(-5deg); opacity: 0.4; }
                    50% { transform: translateX(20%) skewX(15deg); opacity: 0.6; }
                }
                .animate-aurora-1 { animation: aurora-1 12s ease-in-out infinite; }
                .animate-aurora-2 { animation: aurora-2 15s ease-in-out infinite; }
                .animate-aurora-3 { animation: aurora-3 10s ease-in-out infinite; }

                @keyframes wave-1 {
                    0%, 100% { d: path('M0,100 C150,60 350,140 500,100 C650,60 850,140 1000,100 L1000,200 L0,200 Z'); }
                    50% { d: path('M0,100 C150,140 350,60 500,100 C650,140 850,60 1000,100 L1000,200 L0,200 Z'); }
                }
                @keyframes wave-2 {
                    0%, 100% { d: path('M0,120 C150,80 350,160 500,120 C650,80 850,160 1000,120 L1000,200 L0,200 Z'); }
                    50% { d: path('M0,120 C150,160 350,80 500,120 C650,160 850,80 1000,120 L1000,200 L0,200 Z'); }
                }
                @keyframes wave-3 {
                    0%, 100% { d: path('M0,140 C150,100 350,180 500,140 C650,100 850,180 1000,140 L1000,200 L0,200 Z'); }
                    50% { d: path('M0,140 C150,180 350,100 500,140 C650,180 850,100 1000,140 L1000,200 L0,200 Z'); }
                }
                .animate-wave-1 { animation: wave-1 8s ease-in-out infinite; }
                .animate-wave-2 { animation: wave-2 10s ease-in-out infinite; }
                .animate-wave-3 { animation: wave-3 12s ease-in-out infinite; }
            `}</style>
        </div>
    )
}
