'use client'

import { useState, useEffect } from 'react'
import {
    Terminal,
    Wifi,
    Shield,
    Cpu,
    HardDrive,
    Activity,
    Lock,
    Eye,
    Zap
} from 'lucide-react'

interface StatusBarProps {
    onOpenTerminal: () => void
}

export function StatusBar({ onOpenTerminal }: StatusBarProps) {
    const [time, setTime] = useState('')
    const [cpu, setCpu] = useState(0)
    const [memory, setMemory] = useState(0)
    const [network, setNetwork] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const updateStats = () => {
            setCpu(Math.floor(Math.random() * 30) + 10)
            setMemory(Math.floor(Math.random() * 20) + 50)
            setNetwork(Math.floor(Math.random() * 50) + 10)
        }
        updateStats()
        const interval = setInterval(updateStats, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[150] lg:left-64">
            {/* Main Status Bar */}
            <div className="bg-[#0d1117]/95 backdrop-blur-md border-t border-[#00ff41]/30 px-4 py-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        {/* Terminal Button */}
                        <button
                            onClick={onOpenTerminal}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#00ff41]/10 hover:bg-[#00ff41]/20 transition-colors text-[#00ff41] border border-[#00ff41]/30"
                            title="Abrir Terminal (Ctrl+`)"
                        >
                            <Terminal className="h-3 w-3" />
                            <span>TERMINAL</span>
                            <span className="text-[8px] opacity-50">[Ctrl+`]</span>
                        </button>

                        {/* Connection Status */}
                        <div className="flex items-center gap-1.5 text-[#00ff41]">
                            <div className="relative">
                                <Wifi className="h-3 w-3" />
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse" />
                            </div>
                            <span>CONNECTED</span>
                        </div>

                        {/* Security Status */}
                        <div className="flex items-center gap-1.5 text-[#00fff7]">
                            <Shield className="h-3 w-3" />
                            <span>SECURE</span>
                        </div>

                        {/* Encryption */}
                        <div className="hidden md:flex items-center gap-1.5 text-[#ff00ff]">
                            <Lock className="h-3 w-3" />
                            <span>TLS 1.3</span>
                        </div>
                    </div>

                    {/* Center Section - System Stats */}
                    <div className="hidden lg:flex items-center gap-6">
                        {/* CPU */}
                        <div className="flex items-center gap-2">
                            <Cpu className="h-3 w-3 text-[#00ff41]/60" />
                            <div className="w-16 h-1.5 bg-[#00ff41]/10 rounded overflow-hidden">
                                <div
                                    className="h-full bg-[#00ff41] transition-all duration-500"
                                    style={{ width: `${cpu}%` }}
                                />
                            </div>
                            <span className="text-[#00ff41]/60 w-8">{cpu}%</span>
                        </div>

                        {/* Memory */}
                        <div className="flex items-center gap-2">
                            <HardDrive className="h-3 w-3 text-[#00fff7]/60" />
                            <div className="w-16 h-1.5 bg-[#00fff7]/10 rounded overflow-hidden">
                                <div
                                    className="h-full bg-[#00fff7] transition-all duration-500"
                                    style={{ width: `${memory}%` }}
                                />
                            </div>
                            <span className="text-[#00fff7]/60 w-8">{memory}%</span>
                        </div>

                        {/* Network */}
                        <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-[#ff00ff]/60" />
                            <div className="w-16 h-1.5 bg-[#ff00ff]/10 rounded overflow-hidden">
                                <div
                                    className="h-full bg-[#ff00ff] transition-all duration-500"
                                    style={{ width: `${network}%` }}
                                />
                            </div>
                            <span className="text-[#ff00ff]/60 w-12">{network}KB/s</span>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Session */}
                        <div className="hidden md:flex items-center gap-1.5 text-[#ffb000]">
                            <Eye className="h-3 w-3" />
                            <span>SESSION ACTIVE</span>
                        </div>

                        {/* Power Indicator */}
                        <div className="flex items-center gap-1.5 text-[#00ff41]">
                            <Zap className="h-3 w-3" />
                            <span className="tabular-nums">{time}</span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="opacity-30 hover:opacity-100 transition-opacity text-[#00ff41]"
                            title="Ocultar barra"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>

            {/* Activity Indicator */}
            <div className="absolute bottom-full left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent" />
        </div>
    )
}
