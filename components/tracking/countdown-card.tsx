'use client'

import { Calendar, Clock, AlertTriangle, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownCardProps {
    estimatedDelivery: string | null
    status: string
}

function calculateDaysRemaining(dateString: string): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const delivery = new Date(dateString)
    delivery.setHours(0, 0, 0, 0)
    const diffTime = delivery.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })
}

export function CountdownCard({ estimatedDelivery, status }: CountdownCardProps) {
    if (!estimatedDelivery || status === 'delivered' || status === 'returned') {
        return null
    }

    const daysRemaining = calculateDaysRemaining(estimatedDelivery)
    const isLate = daysRemaining < 0
    const isToday = daysRemaining === 0
    const isTomorrow = daysRemaining === 1
    const isUrgent = daysRemaining > 0 && daysRemaining <= 2

    let bgGradient = 'from-blue-500 to-indigo-600'
    const textColor = 'text-white'
    const accentColor = 'text-blue-100'

    if (isLate) {
        bgGradient = 'from-red-500 to-rose-600'
    } else if (isToday) {
        bgGradient = 'from-emerald-500 to-teal-600'
    } else if (isTomorrow) {
        bgGradient = 'from-amber-500 to-orange-500'
    } else if (isUrgent) {
        bgGradient = 'from-purple-500 to-violet-600'
    }

    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br shadow-xl",
            bgGradient
        )}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    {isLate ? (
                        <AlertTriangle className="w-5 h-5 text-white" />
                    ) : isToday ? (
                        <Gift className="w-5 h-5 text-white animate-bounce" />
                    ) : (
                        <Calendar className="w-5 h-5 text-white" />
                    )}
                    <span className={cn("text-sm font-medium uppercase tracking-wider", accentColor)}>
                        {isLate ? 'Prazo expirado' : 'Previsão de entrega'}
                    </span>
                </div>

                {/* Main countdown */}
                <div className="mb-4">
                    {isToday ? (
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-5xl font-black", textColor)}>Hoje!</span>
                            <span className={cn("text-lg", accentColor)}>🎉</span>
                        </div>
                    ) : isTomorrow ? (
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-5xl font-black", textColor)}>Amanhã</span>
                        </div>
                    ) : isLate ? (
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-5xl font-black", textColor)}>{Math.abs(daysRemaining)}</span>
                            <span className={cn("text-xl font-medium", accentColor)}>
                                {Math.abs(daysRemaining) === 1 ? 'dia atrasado' : 'dias atrasados'}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-5xl font-black", textColor)}>{daysRemaining}</span>
                            <span className={cn("text-xl font-medium", accentColor)}>
                                {daysRemaining === 1 ? 'dia' : 'dias'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm capitalize">
                        {formatDate(estimatedDelivery)}
                    </span>
                </div>

                {/* Status specific messages */}
                {status === 'out_for_delivery' && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm text-white/90 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Seu pacote está a caminho!
                        </p>
                    </div>
                )}

                {isUrgent && !isToday && !isTomorrow && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm text-white/90">
                            ⚡ Entrega em breve! Fique atento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
