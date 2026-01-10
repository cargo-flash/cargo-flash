'use client'

import {
    Package,
    ArrowRight,
    Sparkles,
    Gift,
    Clock,
    Truck
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface MiniTrackingWidgetProps {
    trackingCode: string
    status: string
    estimatedDelivery?: string | null
    destinationCity?: string
}

const statusLabels: Record<string, string> = {
    pending: 'Aguardando',
    collected: 'Coletado',
    in_transit: 'Em trânsito',
    out_for_delivery: 'Saiu para entrega',
    delivered: 'Entregue',
    failed: 'Falhou'
}

const statusProgress: Record<string, number> = {
    pending: 15,
    collected: 35,
    in_transit: 55,
    out_for_delivery: 80,
    delivered: 100,
    failed: 65
}

export function MiniTrackingWidget({ trackingCode, status, estimatedDelivery, destinationCity }: MiniTrackingWidgetProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDelivered = status === 'delivered'
    const progress = statusProgress[status] || 50

    return (
        <div className={`
            relative overflow-hidden rounded-2xl 
            bg-white shadow-lg shadow-slate-200/50 border border-slate-100
            hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
            ${mounted ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : 'opacity-0'}
        `}>
            {/* Status Indicator Line */}
            <div className={`h-1 w-full ${isDelivered ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                <div
                    className="h-full bg-gradient-to-r from-indigo-300 to-transparent animate-pulse"
                    style={{ width: `${100 - progress}%`, marginLeft: `${progress}%` }}
                />
            </div>

            <div className="p-4">
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${isDelivered
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-indigo-100 text-indigo-600'
                        }
                    `}>
                        {isDelivered ? (
                            <Gift className="w-6 h-6" />
                        ) : status === 'out_for_delivery' ? (
                            <Truck className="w-6 h-6 animate-bounce" />
                        ) : (
                            <Package className="w-6 h-6" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-bold text-slate-800 truncate">
                                {trackingCode.toUpperCase()}
                            </span>
                            {status === 'out_for_delivery' && (
                                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className={`font-medium ${isDelivered ? 'text-emerald-600' : 'text-indigo-600'
                                }`}>
                                {statusLabels[status]}
                            </span>
                            {destinationCity && (
                                <>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="truncate">{destinationCity}</span>
                                </>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${isDelivered
                                        ? 'bg-emerald-500'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* ETA */}
                    {!isDelivered && estimatedDelivery && (
                        <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                                <Clock className="w-3 h-3" />
                                Previsão
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                                {new Date(estimatedDelivery).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Compact Version
export function MiniTrackingWidgetCompact({ trackingCode, status }: MiniTrackingWidgetProps) {
    const isDelivered = status === 'delivered'
    const progress = statusProgress[status] || 50

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDelivered ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                <Package className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <span className="font-mono text-xs font-bold text-slate-700">{trackingCode.toUpperCase()}</span>
                <div className="h-1 mt-1 bg-slate-100 rounded-full">
                    <div
                        className={`h-full rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <span className={`text-xs font-medium ${isDelivered ? 'text-emerald-600' : 'text-indigo-600'
                }`}>
                {progress}%
            </span>
        </div>
    )
}
