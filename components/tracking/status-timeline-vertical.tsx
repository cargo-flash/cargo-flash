'use client'

import {
    Truck,
    Package,
    Clock,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatusTimelineVerticalProps {
    status: string
    history?: Array<{ status: string; location: string; timestamp: string }>
}

const statusSteps = [
    { id: 'pending', label: 'Pedido Recebido', icon: Package },
    { id: 'collected', label: 'Coletado', icon: Package },
    { id: 'in_transit', label: 'Em Trânsito', icon: Truck },
    { id: 'out_for_delivery', label: 'Saiu para Entrega', icon: Truck },
    { id: 'delivered', label: 'Entregue', icon: CheckCircle2 }
]

const statusOrder = ['pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered']

export function StatusTimelineVertical({ status, history = [] }: StatusTimelineVerticalProps) {
    const [mounted, setMounted] = useState(false)
    const currentIndex = statusOrder.indexOf(status)

    useEffect(() => {
        setMounted(true)
    }, [])

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < currentIndex) return 'completed'
        if (stepIndex === currentIndex) return 'current'
        return 'upcoming'
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Status da Entrega</h3>
                        <p className="text-sm text-slate-500">Acompanhe cada etapa</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                    {Math.round((currentIndex / (statusSteps.length - 1)) * 100)}% concluído
                </span>
            </div>

            {/* Timeline */}
            <div className="p-6">
                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200">
                        <div
                            className="w-full bg-gradient-to-b from-emerald-500 to-indigo-500 transition-all duration-1000"
                            style={{ height: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-8">
                        {statusSteps.map((step, index) => {
                            const Icon = step.icon
                            const stepStatus = getStepStatus(index)
                            const historyItem = history.find(h => h.status === step.id)

                            return (
                                <div
                                    key={step.id}
                                    className={`relative flex gap-4 ${stepStatus === 'upcoming' ? 'opacity-50' : ''
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`
                                        relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all
                                        ${stepStatus === 'completed'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : stepStatus === 'current'
                                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 animate-pulse'
                                                : 'bg-slate-100 text-slate-400'
                                        }
                                    `}>
                                        <Icon className="w-6 h-6" />
                                        {stepStatus === 'current' && (
                                            <span className="absolute -right-1 -top-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                                                <Sparkles className="w-2.5 h-2.5 text-white" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`font-bold ${stepStatus === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                                                }`}>
                                                {step.label}
                                            </h4>
                                            {historyItem?.timestamp && (
                                                <span className="text-xs text-slate-400">
                                                    {new Date(historyItem.timestamp).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        {historyItem?.location ? (
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {historyItem.location}
                                            </p>
                                        ) : stepStatus === 'upcoming' ? (
                                            <p className="text-sm text-slate-400">Aguardando...</p>
                                        ) : null}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
