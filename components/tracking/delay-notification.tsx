'use client'

import { AlertTriangle, Cloud, Car, Package, Truck, Map, Info } from 'lucide-react'

interface DelayNotificationProps {
    justificationType: 'weather' | 'traffic' | 'operational' | 'customs' | 'logistics'
    title: string
    description: string
    additionalDays: number
    isVisible: boolean
}

const iconMap = {
    weather: Cloud,
    traffic: Car,
    operational: Package,
    customs: AlertTriangle,
    logistics: Map
}

const colorMap = {
    weather: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        text: 'text-sky-800',
        icon: 'text-sky-500'
    },
    traffic: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'text-amber-500'
    },
    operational: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-800',
        icon: 'text-slate-500'
    },
    customs: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        icon: 'text-orange-500'
    },
    logistics: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-500'
    }
}

export function DelayNotification({
    justificationType,
    title,
    description,
    additionalDays,
    isVisible
}: DelayNotificationProps) {
    if (!isVisible) return null

    const Icon = iconMap[justificationType] || Info
    const colors = colorMap[justificationType] || colorMap.operational

    return (
        <div className={`
            rounded-xl p-4 border ${colors.bg} ${colors.border}
            animate-in fade-in slide-in-from-top-2 duration-300
        `}>
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                        <h4 className={`font-semibold ${colors.text}`}>{title}</h4>
                        {additionalDays > 0 && (
                            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200 flex-shrink-0">
                                +{additionalDays} {additionalDays === 1 ? 'dia' : 'dias'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {description}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Prazo atualizado automaticamente. Acompanhe aqui.
                    </p>
                </div>
            </div>
        </div>
    )
}

interface DelayNotificationFromDataProps {
    justification: {
        type: 'weather' | 'traffic' | 'operational' | 'customs' | 'logistics'
        title: string
        description: string
        additionalDays: number
    } | null
}

export function DelayNotificationFromData({ justification }: DelayNotificationFromDataProps) {
    if (!justification) return null

    return (
        <DelayNotification
            justificationType={justification.type}
            title={justification.title}
            description={justification.description}
            additionalDays={justification.additionalDays}
            isVisible={true}
        />
    )
}
