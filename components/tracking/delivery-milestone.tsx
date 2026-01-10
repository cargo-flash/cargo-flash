'use client'

import {
    Rocket,
    Target,
    Gift,
    Sparkles,
    Crown,
    TrendingUp
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryMilestoneProps {
    status: string
    createdAt: string
    estimatedDelivery?: string | null
}

interface Milestone {
    id: string
    label: string
    description: string
    icon: typeof Rocket
    achieved: boolean
    points: number
}

export function DeliveryMilestone({ status, createdAt, estimatedDelivery }: DeliveryMilestoneProps) {
    const [mounted, setMounted] = useState(false)
    const [totalPoints, setTotalPoints] = useState(0)

    const getMilestones = (): Milestone[] => {
        const isDelivered = status === 'delivered'
        const isOutForDelivery = status === 'out_for_delivery'
        const isInTransit = status === 'in_transit' || isOutForDelivery || isDelivered
        const isCollected = status === 'collected' || isInTransit

        return [
            {
                id: 'registered',
                label: 'Pedido Registrado',
                description: 'Sua encomenda entrou no sistema',
                icon: Gift,
                achieved: true,
                points: 10
            },
            {
                id: 'collected',
                label: 'Coleta Realizada',
                description: 'Retirada pelo transportador',
                icon: Rocket,
                achieved: isCollected,
                points: 20
            },
            {
                id: 'transit',
                label: 'Em Trânsito',
                description: 'Viajando até você',
                icon: TrendingUp,
                achieved: isInTransit,
                points: 30
            },
            {
                id: 'delivery',
                label: 'Saiu para Entrega',
                description: 'Motorista a caminho',
                icon: Target,
                achieved: isOutForDelivery || isDelivered,
                points: 40
            },
            {
                id: 'delivered',
                label: 'Entregue!',
                description: 'Missão cumprida',
                icon: Crown,
                achieved: isDelivered,
                points: 50
            }
        ]
    }

    const milestones = getMilestones()

    useEffect(() => {
        setMounted(true)
        // Animate points counting
        const achieved = milestones.filter(m => m.achieved)
        const total = achieved.reduce((sum, m) => sum + m.points, 0)

        let current = 0
        const step = Math.ceil(total / 20)
        const timer = setInterval(() => {
            current += step
            if (current >= total) {
                setTotalPoints(total)
                clearInterval(timer)
            } else {
                setTotalPoints(current)
            }
        }, 50)

        return () => clearInterval(timer)
    }, [status])

    const achievedCount = milestones.filter(m => m.achieved).length

    return (
        <div className={`relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header with Points */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                <div className="relative flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Jornada da Entrega
                        </h3>
                        <p className="text-white/80 text-sm mt-1">
                            {achievedCount} de {milestones.length} marcos alcançados
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6 text-amber-200" />
                            <span className="text-3xl font-black text-white">{totalPoints}</span>
                        </div>
                        <p className="text-white/60 text-xs">pontos</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${(achievedCount / milestones.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Milestones */}
            <div className="p-6">
                <div className="space-y-4">
                    {milestones.map((milestone, index) => {
                        const Icon = milestone.icon
                        const isLast = index === milestones.length - 1

                        return (
                            <div key={milestone.id} className="relative flex gap-4">
                                {/* Connector Line */}
                                {!isLast && (
                                    <div
                                        className={`absolute left-6 top-12 w-0.5 h-[calc(100%-24px)] ${milestone.achieved ? 'bg-amber-400' : 'bg-slate-200'
                                            }`}
                                    />
                                )}

                                {/* Icon Circle */}
                                <div className={`
                                    relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
                                    transition-all duration-300
                                    ${milestone.achieved
                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200'
                                        : 'bg-slate-100'
                                    }
                                `}>
                                    <Icon className={`w-5 h-5 ${milestone.achieved ? 'text-white' : 'text-slate-400'
                                        }`} />

                                    {/* Pulse for achieved */}
                                    {milestone.achieved && (
                                        <span className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-ping opacity-50" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-semibold ${milestone.achieved ? 'text-slate-800' : 'text-slate-400'
                                            }`}>
                                            {milestone.label}
                                        </h4>
                                        <span className={`text-sm font-bold ${milestone.achieved ? 'text-amber-500' : 'text-slate-300'
                                            }`}>
                                            +{milestone.points} pts
                                        </span>
                                    </div>
                                    <p className={`text-sm ${milestone.achieved ? 'text-slate-500' : 'text-slate-300'
                                        }`}>
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-800">
                            {status === 'delivered'
                                ? '🎉 Parabéns! Você completou a jornada!'
                                : '✨ Continue acompanhando para ganhar mais pontos!'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
