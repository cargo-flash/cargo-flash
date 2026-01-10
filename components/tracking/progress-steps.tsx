'use client'

import { Check, Clock, Package, Truck, MapPin, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import type { DeliveryStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProgressStepsProps {
    status: DeliveryStatus
}

const steps = [
    { id: 'collected', label: 'Coletado', icon: Package },
    { id: 'in_transit', label: 'Em Trânsito', icon: Truck },
    { id: 'out_for_delivery', label: 'Saiu p/ Entrega', icon: MapPin },
    { id: 'delivered', label: 'Entregue', icon: CheckCircle2 },
]

const statusOrder: Record<string, number> = {
    pending: -1,
    collected: 0,
    in_transit: 1,
    out_for_delivery: 2,
    delivered: 3,
    failed: 2,
    returned: 3,
}

export function ProgressSteps({ status }: ProgressStepsProps) {
    const currentStepIndex = statusOrder[status] ?? -1
    const isFailed = status === 'failed'
    const isReturned = status === 'returned'

    return (
        <div className="w-full py-6">
            {/* Mobile view */}
            <div className="md:hidden">
                <div className="flex items-center justify-between relative">
                    {/* Background line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                    {/* Progress line */}
                    <div
                        className={cn(
                            "absolute top-5 left-0 h-1 rounded-full transition-all duration-700",
                            isFailed ? "bg-red-500" : isReturned ? "bg-gray-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        )}
                        style={{ width: `${Math.min(100, (currentStepIndex + 1) * 25)}%` }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const Icon = step.icon

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted && !isFailed && !isReturned
                                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/30"
                                            : isCurrent && isFailed
                                                ? "bg-red-500 border-red-500 text-white"
                                                : isCurrent && isReturned
                                                    ? "bg-gray-500 border-gray-500 text-white"
                                                    : "bg-white border-slate-200 text-slate-400"
                                    )}
                                >
                                    {isCompleted && !isCurrent ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-xs mt-2 font-medium",
                                    isCompleted ? "text-slate-900" : "text-slate-400"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between relative">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const isLast = index === steps.length - 1
                        const Icon = step.icon

                        return (
                            <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                {/* Step circle and label */}
                                <div className="relative flex flex-col items-center group">
                                    {/* Pulse animation for current */}
                                    {isCurrent && !isFailed && !isReturned && (
                                        <div className="absolute w-14 h-14 rounded-full bg-blue-400 animate-ping opacity-20" />
                                    )}

                                    <div
                                        className={cn(
                                            "relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                            isCompleted && !isFailed && !isReturned
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent text-white shadow-xl shadow-blue-500/40"
                                                : isCurrent && isFailed
                                                    ? "bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/40"
                                                    : isCurrent && isReturned
                                                        ? "bg-gray-500 border-gray-500 text-white shadow-xl shadow-gray-500/40"
                                                        : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                                        )}
                                    >
                                        {isCompleted && !isCurrent ? (
                                            <Check className="w-6 h-6" strokeWidth={3} />
                                        ) : isFailed && isCurrent ? (
                                            <XCircle className="w-6 h-6" />
                                        ) : isReturned && isCurrent ? (
                                            <RotateCcw className="w-6 h-6" />
                                        ) : (
                                            <Icon className="w-6 h-6" />
                                        )}
                                    </div>

                                    <span className={cn(
                                        "absolute -bottom-8 text-sm font-semibold whitespace-nowrap transition-colors",
                                        isCompleted ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector line */}
                                {!isLast && (
                                    <div className="flex-1 h-1 mx-4 relative overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={cn(
                                                "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                                                isFailed && index >= currentStepIndex - 1
                                                    ? "bg-red-500"
                                                    : isReturned && index >= currentStepIndex - 1
                                                        ? "bg-gray-500"
                                                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                                            )}
                                            style={{
                                                width: index < currentStepIndex ? '100%' : '0%'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Status message */}
            {status === 'pending' && (
                <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Aguardando coleta do pacote</span>
                    </div>
                </div>
            )}

            {isFailed && (
                <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Tentativa de entrega não concluída</span>
                    </div>
                </div>
            )}

            {isReturned && (
                <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium">Pacote em devolução ao remetente</span>
                    </div>
                </div>
            )}
        </div>
    )
}
