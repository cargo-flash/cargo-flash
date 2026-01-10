'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain() {
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

        // Matrix characters
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'
        const charArray = chars.split('')

        // Columns
        const fontSize = 14
        const columns = Math.floor(canvas.width / fontSize)
        const drops: number[] = new Array(columns).fill(1)

        // Animation
        const draw = () => {
            // Semi-transparent black for trail effect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Green text
            ctx.fillStyle = '#00ff41'
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)]
                const x = i * fontSize
                const y = drops[i] * fontSize

                ctx.fillText(char, x, y)

                // Reset drop to top with random chance
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }

                drops[i]++
            }
        }

        const interval = setInterval(draw, 50)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', setSize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        />
    )
}
