'use client'

import { Clock, Timer, CalendarClock, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface DeliveryCountdownProps {
    estimatedDelivery?: string | null
    status: string
}

interface TimeRemaining {
    days: number
    hours: number
    minutes: number
    seconds: number
    isToday: boolean
    isPast: boolean
}

function calculateTimeRemaining(target: Date): TimeRemaining {
    const now = new Date()
    const diff = target.getTime() - now.getTime()

    const isToday = target.toDateString() === now.toDateString()
    const isPast = diff < 0

    const absDiff = Math.abs(diff)

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isToday, isPast }
}

export function DeliveryCountdown({ estimatedDelivery, status }: DeliveryCountdownProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)

    useEffect(() => {
        if (!estimatedDelivery || status === 'delivered') return

        const targetDate = new Date(estimatedDelivery)
        // Set to end of day for delivery
        targetDate.setHours(18, 0, 0, 0)

        const updateCountdown = () => {
            setTimeRemaining(calculateTimeRemaining(targetDate))
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)
    }, [estimatedDelivery, status])

    if (!estimatedDelivery || status === 'delivered' || !timeRemaining) {
        return null
    }

    const { days, hours, minutes, seconds, isToday, isPast } = timeRemaining

    return (
        <Card className={`border-2 shadow-xl overflow-hidden ${isPast
                ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'
                : isToday
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50'
                    : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
            }`}>
            {/* Header Bar */}
            <div className={`px-4 py-2 flex items-center justify-between ${isPast
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : isToday
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}>
                <div className="flex items-center gap-2 text-white">
                    {isToday ? (
                        <Zap className="w-4 h-4" />
                    ) : (
                        <CalendarClock className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                        {isPast
                            ? 'Prazo Expirado'
                            : isToday
                                ? 'Chega Hoje!'
                                : 'Contagem Regressiva'}
                    </span>
                </div>
                <Timer className="w-4 h-4 text-white/80" />
            </div>

            <CardContent className="p-5">
                {/* Countdown Display */}
                <div className="flex items-center justify-center gap-2 md:gap-4">
                    {/* Days */}
                    {days > 0 && (
                        <>
                            <div className="text-center">
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center ${isPast ? 'bg-amber-100' : isToday ? 'bg-emerald-100' : 'bg-blue-100'
                                    }`}>
                                    <span className={`text-2xl md:text-3xl font-bold ${isPast ? 'text-amber-700' : isToday ? 'text-emerald-700' : 'text-blue-700'
                                        }`}>
                                        {String(days).padStart(2, '0')}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">dias</p>
                            </div>
                            <span className="text-2xl text-slate-300 font-light">:</span>
                        </>
                    )}

                    {/* Hours */}
                    <div className="text-center">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center ${isPast ? 'bg-amber-100' : isToday ? 'bg-emerald-100' : 'bg-blue-100'
                            }`}>
                            <span className={`text-2xl md:text-3xl font-bold ${isPast ? 'text-amber-700' : isToday ? 'text-emerald-700' : 'text-blue-700'
                                }`}>
                                {String(hours).padStart(2, '0')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">horas</p>
                    </div>

                    <span className="text-2xl text-slate-300 font-light">:</span>

                    {/* Minutes */}
                    <div className="text-center">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center ${isPast ? 'bg-amber-100' : isToday ? 'bg-emerald-100' : 'bg-blue-100'
                            }`}>
                            <span className={`text-2xl md:text-3xl font-bold ${isPast ? 'text-amber-700' : isToday ? 'text-emerald-700' : 'text-blue-700'
                                }`}>
                                {String(minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">min</p>
                    </div>

                    <span className="text-2xl text-slate-300 font-light">:</span>

                    {/* Seconds */}
                    <div className="text-center">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center ${isPast ? 'bg-amber-100' : isToday ? 'bg-emerald-100' : 'bg-blue-100'
                            }`}>
                            <span className={`text-2xl md:text-3xl font-bold tabular-nums ${isPast ? 'text-amber-700' : isToday ? 'text-emerald-700' : 'text-blue-700'
                                }`}>
                                {String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">seg</p>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mt-4 text-center">
                    <p className={`text-sm ${isPast ? 'text-amber-700' : isToday ? 'text-emerald-700' : 'text-blue-700'
                        }`}>
                        {isPast
                            ? '⚠️ A entrega pode acontecer a qualquer momento'
                            : isToday
                                ? '⚡ Sua encomenda chega hoje!'
                                : `📦 Previsão: ${new Date(estimatedDelivery).toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}`
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
