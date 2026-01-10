'use client'

import { useState, useEffect } from 'react'

interface BootSequenceProps {
    onComplete: () => void
}

const bootMessages = [
    { text: '[SYSTEM] Initializing secure connection...', type: 'info', delay: 0 },
    { text: '[CRYPTO] Loading encryption modules...', type: 'info', delay: 300 },
    { text: '[AUTH] Verifying access credentials...', type: 'info', delay: 600 },
    { text: '[OK] Authentication successful', type: 'success', delay: 900 },
    { text: '[FIREWALL] Bypassing security protocols...', type: 'warning', delay: 1200 },
    { text: '[NET] Establishing secure tunnel...', type: 'info', delay: 1500 },
    { text: '[DB] Connecting to mainframe...', type: 'info', delay: 1800 },
    { text: '[OK] Database connection established', type: 'success', delay: 2100 },
    { text: '[SYS] Loading CARGO FLASH ADMIN v2.0...', type: 'info', delay: 2400 },
    { text: '[OK] All systems operational', type: 'success', delay: 2700 },
    { text: '', type: 'info', delay: 3000 },
    { text: '> ACCESS GRANTED', type: 'success', delay: 3200 },
]

export function BootSequence({ onComplete }: BootSequenceProps) {
    const [visibleMessages, setVisibleMessages] = useState<number>(0)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        bootMessages.forEach((msg, index) => {
            setTimeout(() => {
                setVisibleMessages(index + 1)
                if (index === bootMessages.length - 1) {
                    setTimeout(() => {
                        setIsComplete(true)
                        setTimeout(onComplete, 500)
                    }, 500)
                }
            }, msg.delay)
        })
    }, [onComplete])

    return (
        <div className={`fixed inset-0 bg-black z-[100] flex items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none scanlines" />

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none noise-overlay" />

            {/* Boot terminal */}
            <div className="w-full max-w-2xl p-8 font-mono text-sm">
                {/* Header */}
                <div className="mb-6 text-center">
                    <pre className="text-[#00ff41] text-xs leading-none neon-glow">
                        {` ██████╗ █████╗ ██████╗  ██████╗  ██████╗     ███████╗██╗      █████╗ ███████╗██╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝ ██╔═══██╗    ██╔════╝██║     ██╔══██╗██╔════╝██║  ██║
██║     ███████║██████╔╝██║  ███╗██║   ██║    █████╗  ██║     ███████║███████╗███████║
██║     ██╔══██║██╔══██╗██║   ██║██║   ██║    ██╔══╝  ██║     ██╔══██║╚════██║██╔══██║
╚██████╗██║  ██║██║  ██║╚██████╔╝╚██████╔╝    ██║     ███████╗██║  ██║███████║██║  ██║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`}
                    </pre>
                    <p className="text-[#00ff41]/60 text-xs mt-2 tracking-[0.3em]">ADMIN CONTROL CENTER</p>
                </div>

                {/* Boot messages */}
                <div className="space-y-1 boot-text">
                    {bootMessages.slice(0, visibleMessages).map((msg, index) => (
                        <div
                            key={index}
                            className={`
                                ${msg.type === 'success' ? 'text-[#00ff41]' : ''}
                                ${msg.type === 'warning' ? 'text-[#ffb000]' : ''}
                                ${msg.type === 'error' ? 'text-[#ff0040]' : ''}
                                ${msg.type === 'info' ? 'text-[#00fff7]' : ''}
                                ${msg.text.includes('ACCESS GRANTED') ? 'text-2xl font-bold neon-glow-intense mt-4' : ''}
                            `}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {visibleMessages < bootMessages.length && (
                        <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse" />
                    )}
                </div>

                {/* Progress bar */}
                <div className="mt-8 h-1 bg-[#00ff41]/10 rounded overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#00ff41] to-[#00fff7] transition-all duration-300"
                        style={{ width: `${(visibleMessages / bootMessages.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
