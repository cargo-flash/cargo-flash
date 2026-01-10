'use client'

import {
    CheckCircle2,
    Package,
    Truck,
    Clock,
    MapPin,
    Loader2,
    AlertCircle,
    RotateCcw
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AnimatedStatusBadgeProps {
    status: string
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
    animated?: boolean
}

const statusConfig: Record<string, {
    label: string;
    icon: typeof Package;
    color: string;
    bgColor: string;
    animation?: string
}> = {
    pending: {
        label: 'Aguardando Coleta',
        icon: Clock,
        color: 'text-slate-600',
        bgColor: 'bg-slate-100 border-slate-200',
        animation: 'animate-pulse'
    },
    collected: {
        label: 'Coletado',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200'
    },
    in_transit: {
        label: 'Em Trânsito',
        icon: Truck,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 border-indigo-200',
        animation: 'animate-bounce'
    },
    out_for_delivery: {
        label: 'Saiu para Entrega',
        icon: MapPin,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        animation: 'animate-pulse'
    },
    delivered: {
        label: 'Entregue',
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 border-emerald-200'
    },
    failed: {
        label: 'Não Entregue',
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
        animation: 'animate-pulse'
    },
    returned: {
        label: 'Devolvido',
        icon: RotateCcw,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
    }
}

const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2'
}

const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
}

export function AnimatedStatusBadge({
    status,
    size = 'md',
    showIcon = true,
    animated = true
}: AnimatedStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
        <div
            className={`
                inline-flex items-center rounded-full border font-medium
                ${config.bgColor} ${config.color} ${sizeClasses[size]}
                ${animated && config.animation ? config.animation : ''}
            `}
        >
            {showIcon && (
                <Icon className={`${iconSizes[size]} ${animated && status === 'in_transit' ? '' : ''}`} />
            )}
            <span>{config.label}</span>

            {/* Live indicator for active statuses */}
            {animated && ['in_transit', 'out_for_delivery'].includes(status) && (
                <span className="relative ml-1">
                    <span className="absolute inline-flex w-2 h-2 rounded-full bg-current opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-current" />
                </span>
            )}
        </div>
    )
}

// Variant with more detailed status
export function DetailedStatusBadge({ status }: { status: string }) {
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    const statusDetails: Record<string, string> = {
        pending: 'O remetente está preparando sua encomenda',
        collected: 'Sua encomenda foi coletada e está em processamento',
        in_transit: 'Sua encomenda está viajando em direção ao destino',
        out_for_delivery: 'O motorista está a caminho com sua encomenda',
        delivered: 'Sua encomenda foi entregue com sucesso',
        failed: 'Não foi possível entregar. Nova tentativa será agendada',
        returned: 'A encomenda foi devolvida ao remetente'
    }

    return (
        <div className={`p-4 rounded-xl ${config.bgColor} border`}>
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div className="flex-1">
                    <p className={`font-bold ${config.color}`}>{config.label}</p>
                    <p className="text-sm text-slate-600">{statusDetails[status]}</p>
                </div>
                {['in_transit', 'out_for_delivery'].includes(status) && (
                    <Loader2 className={`w-5 h-5 ${config.color} animate-spin`} />
                )}
            </div>
        </div>
    )
}
