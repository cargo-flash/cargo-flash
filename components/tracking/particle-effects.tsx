'use client'

import { useEffect, useState, useRef } from 'react'

interface ParticleEffectsProps {
    variant?: 'confetti' | 'stars' | 'bubbles' | 'snow'
    active?: boolean
    color?: string
}

interface Particle {
    id: number
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    rotation: number
    color: string
    opacity: number
}

const colors = {
    confetti: ['#f43f5e', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'],
    stars: ['#fbbf24', '#f59e0b', '#fcd34d'],
    bubbles: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
    snow: ['#ffffff', '#f1f5f9', '#e2e8f0']
}

export function ParticleEffects({ variant = 'confetti', active = true, color }: ParticleEffectsProps) {
    const [particles, setParticles] = useState<Particle[]>([])
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        if (!active) {
            setParticles([])
            return
        }

        // Generate initial particles
        const generateParticles = () => {
            const newParticles: Particle[] = []
            const count = variant === 'snow' ? 50 : 30

            for (let i = 0; i < count; i++) {
                const colorPalette = color ? [color] : colors[variant]
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: variant === 'snow' ? Math.random() * 100 : -10,
                    size: 4 + Math.random() * 8,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: variant === 'bubbles' ? -(1 + Math.random() * 2) : (1 + Math.random() * 3),
                    rotation: Math.random() * 360,
                    color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
                    opacity: 0.6 + Math.random() * 0.4
                })
            }
            return newParticles
        }

        setParticles(generateParticles())

        // Animation loop
        const animate = () => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.speedX * 0.1,
                y: p.y + p.speedY * 0.1,
                rotation: p.rotation + (variant === 'confetti' ? 2 : 0),
                // Reset when out of bounds
                ...(p.y > 110 || p.y < -10 ? {
                    y: variant === 'bubbles' ? 110 : -10,
                    x: Math.random() * 100
                } : {})
            })))
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [active, variant, color])

    if (!active) return null

    const getShape = (particle: Particle) => {
        switch (variant) {
            case 'stars':
                return (
                    <svg viewBox="0 0 24 24" className="fill-current" style={{ width: particle.size, height: particle.size }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                )
            case 'bubbles':
                return (
                    <div
                        className="rounded-full border-2"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            borderColor: particle.color,
                            background: `radial-gradient(circle at 30% 30%, white, ${particle.color})`
                        }}
                    />
                )
            case 'snow':
                return (
                    <div
                        className="rounded-full"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            background: particle.color,
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                        }}
                    />
                )
            default: // confetti
                return (
                    <div
                        style={{
                            width: particle.size,
                            height: particle.size * 0.4,
                            background: particle.color,
                            borderRadius: 2,
                            transform: `rotate(${particle.rotation}deg)`
                        }}
                    />
                )
        }
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden z-50"
        >
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute transition-all duration-100"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        opacity: particle.opacity,
                        color: particle.color
                    }}
                >
                    {getShape(particle)}
                </div>
            ))}
        </div>
    )
}
