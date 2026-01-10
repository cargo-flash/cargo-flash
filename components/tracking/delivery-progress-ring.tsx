'use client'

import {
    Sparkles,
    Gift,
    Truck,
    Package,
    Star,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryProgressRingProps {
    status: string
    progress?: number
}

const statusProgress: Record<string, number> = {
    pending: 10,
    collected: 30,
    in_transit: 55,
    out_for_delivery: 85,
    delivered: 100,
    failed: 70
}

export function DeliveryProgressRing({ status, progress }: DeliveryProgressRingProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedProgress, setAnimatedProgress] = useState(0)

    const targetProgress = progress ?? statusProgress[status] ?? 50

    useEffect(() => {
        setMounted(true)

        // Animate progress
        const duration = 1500
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const t = Math.min(elapsed / duration, 1)
            // Easing
            const eased = 1 - Math.pow(1 - t, 3)
            setAnimatedProgress(targetProgress * eased)

            if (t < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [targetProgress])

    const isDelivered = status === 'delivered'
    const circumference = 2 * Math.PI * 90 // radius = 90
    const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

    const statusColors = {
        pending: { from: '#94a3b8', to: '#64748b' },
        collected: { from: '#3b82f6', to: '#1d4ed8' },
        in_transit: { from: '#8b5cf6', to: '#6d28d9' },
        out_for_delivery: { from: '#f59e0b', to: '#d97706' },
        delivered: { from: '#22c55e', to: '#16a34a' },
        failed: { from: '#f43f5e', to: '#e11d48' }
    }

    const colors = statusColors[status as keyof typeof statusColors] || statusColors.pending

    return (
        <div className={`relative p-8 ${mounted ? 'animate-in fade-in zoom-in duration-500' : 'opacity-0'
            }`}>
            {/* Outer glow */}
            <div
                className="absolute inset-8 rounded-full blur-2xl opacity-30"
                style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
            />

            {/* Main Ring */}
            <div className="relative w-52 h-52 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Background Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-slate-100"
                    />

                    {/* Progress Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={`url(#progressGradient-${status})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                    />

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id={`progressGradient-${status}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors.from} />
                            <stop offset="100%" stopColor={colors.to} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isDelivered ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-2 animate-bounce">
                                <Gift className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-2xl font-black text-emerald-600">Entregue!</span>
                        </>
                    ) : (
                        <>
                            <span
                                className="text-5xl font-black"
                                style={{ color: colors.to }}
                            >
                                {Math.round(animatedProgress)}%
                            </span>
                            <span className="text-sm text-slate-500 mt-1">Concluído</span>
                        </>
                    )}
                </div>

                {/* Decorative dots */}
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    const x = 100 + 75 * Math.cos(angle - Math.PI / 2)
                    const y = 100 + 75 * Math.sin(angle - Math.PI / 2)
                    const isActive = (i / 8) * 100 <= animatedProgress

                    return (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'scale-100' : 'scale-50 opacity-50'
                                }`}
                            style={{
                                left: `${(x / 200) * 100}%`,
                                top: `${(y / 200) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                background: isActive ? colors.to : '#e2e8f0'
                            }}
                        />
                    )
                })}
            </div>

            {/* Status Label */}
            <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100">
                    <Truck className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                        {status === 'pending' && 'Aguardando coleta'}
                        {status === 'collected' && 'Coletado'}
                        {status === 'in_transit' && 'Em trânsito'}
                        {status === 'out_for_delivery' && 'Saiu para entrega'}
                        {status === 'delivered' && 'Entrega concluída'}
                        {status === 'failed' && 'Tentativa falhou'}
                    </span>
                </div>
            </div>
        </div>
    )
}
