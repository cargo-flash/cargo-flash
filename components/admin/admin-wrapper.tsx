'use client'

import { useState, useEffect } from 'react'
import { BootSequence } from './boot-sequence'
import { MatrixRainAdvanced, GlitchOverlay, CyberGrid } from './matrix-effects'
import { CommandTerminal, useTerminalShortcut } from './command-terminal'
import { StatusBar } from './status-bar'

interface AdminWrapperProps {
    children: React.ReactNode
}

export function AdminWrapper({ children }: AdminWrapperProps) {
    const [showBoot, setShowBoot] = useState(true)
    const [hasBooted, setHasBooted] = useState(false)
    const { isOpen: terminalOpen, setIsOpen: setTerminalOpen } = useTerminalShortcut()

    useEffect(() => {
        // Check if boot was already shown this session
        const booted = sessionStorage.getItem('cargo_flash_booted')
        if (booted) {
            setShowBoot(false)
            setHasBooted(true)
        }
    }, [])

    const handleBootComplete = () => {
        setShowBoot(false)
        setHasBooted(true)
        sessionStorage.setItem('cargo_flash_booted', 'true')
    }

    return (
        <>
            {/* Boot Sequence */}
            {showBoot && !hasBooted && (
                <BootSequence onComplete={handleBootComplete} />
            )}

            {/* Matrix Rain Background */}
            <MatrixRainAdvanced opacity={0.12} speed={40} density={1.2} />

            {/* Cyber Grid */}
            <CyberGrid />

            {/* Glitch/Scanline Overlay */}
            <GlitchOverlay />

            {/* Noise texture overlay */}
            <div className="noise-overlay" />

            {/* Vignette effect */}
            <div
                className="fixed inset-0 pointer-events-none z-[90]"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
                }}
            />

            {/* Command Terminal (Ctrl+` to open) */}
            <CommandTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

            {/* Status Bar */}
            <StatusBar onOpenTerminal={() => setTerminalOpen(true)} />

            {/* Main content */}
            <div className={`transition-opacity duration-500 ${hasBooted || !showBoot ? 'opacity-100' : 'opacity-0'}`}>
                {children}
            </div>
        </>
    )
}

