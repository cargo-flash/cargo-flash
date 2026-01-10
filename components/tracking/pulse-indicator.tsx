'use client'

import {
    Package,
    MapPin,
    Clock,
    Truck,
    CheckCircle2,
    Sparkles
} from 'lucide-react'

interface PulseIndicatorProps {
    status: string
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
}

const statusColors: Record<string, {
    pulse: string
    bg: string
    text: string
    label: string
}> = {
    pending: {
        pulse: 'bg-slate-400',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        label: 'Aguardando'
    },
    collected: {
        pulse: 'bg-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        label: 'Coletado'
    },
    in_transit: {
        pulse: 'bg-indigo-500',
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
        label: 'Em trânsito'
    },
    out_for_delivery: {
        pulse: 'bg-purple-500',
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        label: 'Saiu para entrega'
    },
    delivered: {
        pulse: 'bg-emerald-500',
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        label: 'Entregue'
    },
    failed: {
        pulse: 'bg-amber-500',
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        label: 'Falhou'
    },
    returned: {
        pulse: 'bg-red-500',
        bg: 'bg-red-100',
        text: 'text-red-600',
        label: 'Devolvido'
    }
}

const sizeConfig = {
    sm: { dot: 'w-2 h-2', ring: 'w-4 h-4', text: 'text-xs' },
    md: { dot: 'w-3 h-3', ring: 'w-6 h-6', text: 'text-sm' },
    lg: { dot: 'w-4 h-4', ring: 'w-8 h-8', text: 'text-base' }
}

export function PulseIndicator({ status, size = 'md', showLabel = true }: PulseIndicatorProps) {
    const colors = statusColors[status] || statusColors.pending
    const sizes = sizeConfig[size]

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                {/* Outer ring pulse */}
                <span className={`absolute inset-0 ${sizes.ring} rounded-full ${colors.pulse} animate-ping opacity-30`} />
                <span className={`absolute inset-0 ${sizes.ring} rounded-full ${colors.pulse} animate-pulse opacity-20`} style={{ animationDelay: '0.5s' }} />

                {/* Main dot */}
                <span className={`relative block ${sizes.dot} rounded-full ${colors.pulse} shadow-lg`} style={{ boxShadow: `0 0 12px currentColor` }} />
            </div>

            {showLabel && (
                <span className={`font-medium ${sizes.text} ${colors.text}`}>
                    {colors.label}
                </span>
            )}
        </div>
    )
}

// Live Status Bar Component
interface LiveStatusBarProps {
    status: string
    lastUpdate: string
}

export function LiveStatusBar({ status, lastUpdate }: LiveStatusBarProps) {
    const formatTime = (date: string) => {
        const d = new Date(date)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 1) return 'agora'
        if (diffMins < 60) return `${diffMins}min atrás`
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
                <PulseIndicator status={status} size="sm" />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Atualizado {formatTime(lastUpdate)}</span>
            </div>
        </div>
    )
}
