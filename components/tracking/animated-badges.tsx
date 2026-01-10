'use client'

import {
    Zap,
    Star,
    Shield,
    Clock,
    Truck,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'

type BadgeType = 'priority' | 'express' | 'protected' | 'verified' | 'new' | 'hot' | 'sale'

interface AnimatedBadgeProps {
    type: BadgeType
    size?: 'sm' | 'md' | 'lg'
    animated?: boolean
}

const badgeConfig: Record<BadgeType, {
    icon: typeof Zap
    label: string
    colors: string
    glow: string
}> = {
    priority: {
        icon: Zap,
        label: 'Prioridade',
        colors: 'from-amber-400 to-orange-500',
        glow: 'shadow-amber-500/50'
    },
    express: {
        icon: Truck,
        label: 'Express',
        colors: 'from-blue-400 to-indigo-500',
        glow: 'shadow-blue-500/50'
    },
    protected: {
        icon: Shield,
        label: 'Protegido',
        colors: 'from-emerald-400 to-teal-500',
        glow: 'shadow-emerald-500/50'
    },
    verified: {
        icon: CheckCircle2,
        label: 'Verificado',
        colors: 'from-green-400 to-emerald-500',
        glow: 'shadow-green-500/50'
    },
    new: {
        icon: Sparkles,
        label: 'Novo',
        colors: 'from-purple-400 to-pink-500',
        glow: 'shadow-purple-500/50'
    },
    hot: {
        icon: Zap,
        label: 'Em Alta',
        colors: 'from-red-400 to-rose-500',
        glow: 'shadow-red-500/50'
    },
    sale: {
        icon: Star,
        label: 'Oferta',
        colors: 'from-yellow-400 to-amber-500',
        glow: 'shadow-yellow-500/50'
    }
}

const sizeConfig = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2'
}

const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
}

export function AnimatedBadge({ type, size = 'md', animated = true }: AnimatedBadgeProps) {
    const [mounted, setMounted] = useState(false)
    const config = badgeConfig[type]
    const Icon = config.icon

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <span className={`
            inline-flex items-center font-bold uppercase tracking-wider
            rounded-full bg-gradient-to-r ${config.colors} text-white
            shadow-lg ${animated ? config.glow : ''}
            ${sizeConfig[size]}
            ${mounted && animated ? 'animate-in fade-in zoom-in duration-300' : ''}
            ${animated ? 'hover:scale-110 transition-transform cursor-default' : ''}
        `}>
            <Icon className={`${iconSize[size]} ${animated ? 'animate-pulse' : ''}`} />
            {config.label}
        </span>
    )
}

// Floating Badge with absolute positioning
interface FloatingBadgeProps extends AnimatedBadgeProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function FloatingBadge({ position = 'top-right', ...props }: FloatingBadgeProps) {
    const positionClasses = {
        'top-left': 'top-2 left-2',
        'top-right': 'top-2 right-2',
        'bottom-left': 'bottom-2 left-2',
        'bottom-right': 'bottom-2 right-2'
    }

    return (
        <div className={`absolute ${positionClasses[position]} z-10`}>
            <AnimatedBadge {...props} />
        </div>
    )
}

// Status Badge
interface StatusBadgeProps {
    status: string
    showLabel?: boolean
}

const statusConfig: Record<string, {
    label: string
    colors: string
    icon: typeof Zap
}> = {
    pending: { label: 'Pendente', colors: 'bg-slate-500', icon: Clock },
    collected: { label: 'Coletado', colors: 'bg-blue-500', icon: CheckCircle2 },
    in_transit: { label: 'Em Trânsito', colors: 'bg-indigo-500', icon: Truck },
    out_for_delivery: { label: 'Saiu p/ Entrega', colors: 'bg-purple-500', icon: Truck },
    delivered: { label: 'Entregue', colors: 'bg-emerald-500', icon: CheckCircle2 },
    failed: { label: 'Falhou', colors: 'bg-red-500', icon: AlertCircle }
}

export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase
            rounded-full ${config.colors} text-white
        `}>
            <Icon className="w-3.5 h-3.5" />
            {showLabel && config.label}
        </span>
    )
}
