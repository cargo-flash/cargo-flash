'use client'

import {
    TrendingUp,
    TrendingDown,
    Minus,
    Clock,
    Truck,
    Package,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliverySpeedMeterProps {
    status: string
    estimatedMinutes?: number
}

export function DeliverySpeedMeter({ status, estimatedMinutes = 45 }: DeliverySpeedMeterProps) {
    const [mounted, setMounted] = useState(false)
    const [speed, setSpeed] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Calculate speed based on status
        const targetSpeed = status === 'out_for_delivery'
            ? 85 + Math.random() * 15
            : status === 'in_transit'
                ? 60 + Math.random() * 20
                : status === 'delivered'
                    ? 100
                    : 30 + Math.random() * 20

        // Animate speed
        let current = 0
        const animate = () => {
            current += (targetSpeed - current) * 0.05
            setSpeed(current)
            if (Math.abs(targetSpeed - current) > 0.5) {
                requestAnimationFrame(animate)
            } else {
                setSpeed(targetSpeed)
            }
        }
        requestAnimationFrame(animate)
    }, [status])

    const getSpeedLabel = () => {
        if (speed >= 80) return { label: 'Muito Rápido', icon: TrendingUp, color: 'text-emerald-600' }
        if (speed >= 60) return { label: 'Normal', icon: Minus, color: 'text-blue-600' }
        if (speed >= 40) return { label: 'Moderado', icon: TrendingDown, color: 'text-amber-600' }
        return { label: 'Lento', icon: TrendingDown, color: 'text-red-600' }
    }

    const speedInfo = getSpeedLabel()
    const SpeedIcon = speedInfo.icon

    // Calculate needle angle (-45 to 225 degrees)
    const needleAngle = -45 + (speed / 100) * 270

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Velocidade da Entrega</h3>
                        <p className="text-sm text-slate-500">Performance em tempo real</p>
                    </div>
                </div>
            </div>

            {/* Speedometer */}
            <div className="p-8">
                <div className="relative w-56 h-32 mx-auto">
                    {/* Arc background */}
                    <svg viewBox="0 0 200 120" className="w-full h-full">
                        {/* Background arc */}
                        <path
                            d="M 20,100 A 80,80 0 0,1 180,100"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />

                        {/* Colored arc segments */}
                        <path
                            d="M 20,100 A 80,80 0 0,1 60,35"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 60,35 A 80,80 0 0,1 100,20"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="16"
                        />
                        <path
                            d="M 100,20 A 80,80 0 0,1 140,35"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="16"
                        />
                        <path
                            d="M 140,35 A 80,80 0 0,1 180,100"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />

                        {/* Speed markers */}
                        {[0, 25, 50, 75, 100].map((mark, i) => {
                            const angle = (-45 + (mark / 100) * 270) * Math.PI / 180
                            const x1 = 100 + 65 * Math.cos(angle)
                            const y1 = 100 + 65 * Math.sin(angle)
                            const x2 = 100 + 55 * Math.cos(angle)
                            const y2 = 100 + 55 * Math.sin(angle)
                            return (
                                <g key={mark}>
                                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" />
                                    <text
                                        x={100 + 45 * Math.cos(angle)}
                                        y={100 + 45 * Math.sin(angle)}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="#64748b"
                                    >
                                        {mark}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Needle */}
                        <g transform={`rotate(${needleAngle}, 100, 100)`} className="transition-transform duration-300">
                            <line x1="100" y1="100" x2="100" y2="35" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="100" cy="100" r="8" fill="#1e293b" />
                        </g>
                    </svg>

                    {/* Speed display */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <span className="text-4xl font-black text-slate-800">{Math.round(speed)}</span>
                        <span className="text-lg text-slate-400">%</span>
                    </div>
                </div>

                {/* Speed Status */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    <SpeedIcon className={`w-5 h-5 ${speedInfo.color}`} />
                    <span className={`font-bold ${speedInfo.color}`}>{speedInfo.label}</span>
                </div>

                {/* ETA */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~{estimatedMinutes} min restantes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
