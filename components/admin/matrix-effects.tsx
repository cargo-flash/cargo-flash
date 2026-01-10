'use client'

import { useEffect, useRef } from 'react'

interface MatrixRainAdvancedProps {
    opacity?: number
    speed?: number
    density?: number
}

export function MatrixRainAdvanced({
    opacity = 0.08,
    speed = 33,
    density = 1
}: MatrixRainAdvancedProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const setSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        setSize()
        window.addEventListener('resize', setSize)

        // Extended character set for more authenticity
        const chars =
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
            'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ' +
            '0123456789' +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            '!@#$%^&*()_+-=[]{}|;:,.<>?' +
            '█▓▒░▀▄▌▐●○◐◑◒◓◔◕⊕⊖⊗⊘'
        const charArray = chars.split('')

        // Columns setup
        const fontSize = 14
        let columns = Math.floor(canvas.width / (fontSize * density))

        interface Drop {
            y: number
            speed: number
            brightness: number
            trail: number
            char: string
        }

        let drops: Drop[] = []

        const initDrops = () => {
            columns = Math.floor(canvas.width / (fontSize * density))
            drops = []
            for (let i = 0; i < columns; i++) {
                drops.push({
                    y: Math.random() * canvas.height / fontSize,
                    speed: 0.5 + Math.random() * 1.5,
                    brightness: 0.5 + Math.random() * 0.5,
                    trail: 10 + Math.floor(Math.random() * 20),
                    char: charArray[Math.floor(Math.random() * charArray.length)]
                })
            }
        }
        initDrops()

        window.addEventListener('resize', initDrops)

        // Animation
        const draw = () => {
            // Fade effect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i]
                const x = i * fontSize * density
                const y = drop.y * fontSize

                // Draw trail
                for (let j = 0; j < drop.trail; j++) {
                    const trailY = y - (j * fontSize)
                    if (trailY < 0) continue

                    const alpha = (1 - (j / drop.trail)) * drop.brightness
                    const green = Math.floor(255 * alpha)

                    if (j === 0) {
                        // Head of the drop - brightest, with glow
                        ctx.shadowBlur = 15
                        ctx.shadowColor = '#00ff41'
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                    } else {
                        ctx.shadowBlur = 0
                        ctx.fillStyle = `rgba(0, ${green}, ${Math.floor(green * 0.25)}, ${alpha * 0.8})`
                    }

                    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
                    const trailChar = j === 0 ? drop.char : charArray[Math.floor(Math.random() * charArray.length)]
                    ctx.fillText(trailChar, x, trailY)
                }

                // Reset shadow
                ctx.shadowBlur = 0

                // Update drop position
                drop.y += drop.speed

                // Randomly change character
                if (Math.random() > 0.95) {
                    drop.char = charArray[Math.floor(Math.random() * charArray.length)]
                }

                // Reset drop to top
                if (drop.y * fontSize > canvas.height + drop.trail * fontSize) {
                    if (Math.random() > 0.975) {
                        drop.y = 0
                        drop.speed = 0.5 + Math.random() * 1.5
                        drop.brightness = 0.5 + Math.random() * 0.5
                    }
                }
            }
        }

        const interval = setInterval(draw, speed)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', setSize)
            window.removeEventListener('resize', initDrops)
        }
    }, [speed, density])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity }}
        />
    )
}

// Glitch overlay component
export function GlitchOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {/* Scanlines */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
                    animation: 'scanlines 0.1s linear infinite'
                }}
            />

            {/* Occasional flicker */}
            <div
                className="absolute inset-0 bg-[#00ff41] opacity-0"
                style={{
                    animation: 'screen-flicker 10s ease-in-out infinite'
                }}
            />

            <style jsx>{`
                @keyframes screen-flicker {
                    0%, 100% { opacity: 0; }
                    0.5% { opacity: 0.02; }
                    1% { opacity: 0; }
                    45% { opacity: 0; }
                    45.5% { opacity: 0.01; }
                    46% { opacity: 0; }
                }
            `}</style>
        </div>
    )
}

// Cyber grid background
export function CyberGrid() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 opacity-30"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'grid-move 20s linear infinite'
            }}
        >
            <style jsx>{`
                @keyframes grid-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 50px 50px; }
                }
            `}</style>
        </div>
    )
}
