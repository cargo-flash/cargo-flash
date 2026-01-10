'use client'

import {
    TrendingUp,
    Clock,
    Truck,
    MapPin,
    CheckCircle2,
    Package
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DeliveryProgressIndicatorProps {
    status: string
    createdAt: string
    estimatedDelivery?: string | null
    collectedAt?: string | null
}

const statusSteps = [
    { key: 'pending', label: 'Pedido', icon: Package, position: 0 },
    { key: 'collected', label: 'Coletado', icon: Package, position: 25 },
    { key: 'in_transit', label: 'Trânsito', icon: Truck, position: 50 },
    { key: 'out_for_delivery', label: 'Rota', icon: MapPin, position: 75 },
    { key: 'delivered', label: 'Entregue', icon: CheckCircle2, position: 100 },
]

function getProgressPercentage(status: string): number {
    const step = statusSteps.find(s => s.key === status)
    if (!step) return 0

    // Add some variance for visual interest
    const base = step.position
    if (status === 'in_transit') {
        return base + Math.random() * 15 // 50-65%
    }
    if (status === 'out_for_delivery') {
        return base + Math.random() * 10 // 75-85%
    }
    return base
}

function calculateTimeElapsed(createdAt: string): string {
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    if (hours < 24) {
        return `${hours}h em trânsito`
    }
    const days = Math.floor(hours / 24)
    return `${days} dia${days > 1 ? 's' : ''} em trânsito`
}

export function DeliveryProgressIndicator({ status, createdAt, estimatedDelivery }: DeliveryProgressIndicatorProps) {
    const progress = getProgressPercentage(status)
    const timeElapsed = calculateTimeElapsed(createdAt)

    // Calculate estimated completion
    let estimatedText = ''
    if (estimatedDelivery) {
        const delivery = new Date(estimatedDelivery)
        const now = new Date()
        const diffDays = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) estimatedText = 'Previsão para hoje'
        else if (diffDays === 1) estimatedText = 'Previsão para amanhã'
        else if (diffDays > 0) estimatedText = `Previsão em ${diffDays} dias`
        else estimatedText = 'Previsão atrasada'
    }

    const isDelivered = status === 'delivered'
    const isFailed = status === 'failed' || status === 'returned'

    if (isFailed) {
        return null
    }

    return (
        <Card className={`border ${isDelivered ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200/80 bg-white'} shadow-md`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${isDelivered ? 'text-emerald-600' : 'text-blue-600'}`} />
                        <span className="font-medium text-slate-700">Progresso da Entrega</span>
                    </div>
                    <span className={`text-lg font-bold ${isDelivered ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {isDelivered ? '100%' : `${Math.round(progress)}%`}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    {/* Background */}
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                        {/* Progress Fill */}
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isDelivered
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
                                }`}
                            style={{ width: `${isDelivered ? 100 : progress}%` }}
                        />
                    </div>

                    {/* Step Markers */}
                    <div className="absolute top-0 left-0 right-0 h-3 flex items-center">
                        {statusSteps.map((step, index) => {
                            const passed = progress >= step.position
                            return (
                                <div
                                    key={step.key}
                                    className="absolute top-1/2 -translate-y-1/2"
                                    style={{ left: `${step.position}%`, transform: 'translate(-50%, -50%)' }}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${passed
                                            ? isDelivered
                                                ? 'bg-emerald-500 border-emerald-600'
                                                : 'bg-indigo-500 border-indigo-600'
                                            : 'bg-white border-slate-300'
                                        }`} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Labels */}
                <div className="flex justify-between mt-2">
                    {statusSteps.map((step) => {
                        const passed = progress >= step.position
                        const StepIcon = step.icon
                        return (
                            <div key={step.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                                <span className={`text-[10px] ${passed ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Time Info */}
                {!isDelivered && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{timeElapsed}</span>
                        </div>
                        {estimatedText && (
                            <span className={estimatedText.includes('atrasada') ? 'text-amber-600 font-medium' : ''}>
                                {estimatedText}
                            </span>
                        )}
                    </div>
                )}

                {isDelivered && (
                    <div className="flex items-center justify-center mt-4 pt-3 border-t border-emerald-100 text-xs text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">Entrega concluída com sucesso!</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
