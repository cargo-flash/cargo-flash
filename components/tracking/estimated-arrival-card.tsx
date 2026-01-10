'use client'

import {
    Clock,
    Sun,
    Moon,
    Sunset,
    Truck,
    AlertCircle,
    CheckCircle2,
    Calendar
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface EstimatedArrivalCardProps {
    estimatedDelivery: string | null | undefined
    status: string
}

function getTimeOfDayIcon(hour: number) {
    if (hour >= 6 && hour < 12) return { icon: Sun, label: 'Manhã', color: 'text-amber-500' }
    if (hour >= 12 && hour < 18) return { icon: Sun, label: 'Tarde', color: 'text-orange-500' }
    if (hour >= 18 && hour < 21) return { icon: Sunset, label: 'Final da Tarde', color: 'text-purple-500' }
    return { icon: Moon, label: 'Noite', color: 'text-indigo-500' }
}

function formatDeliveryWindow(): { start: string; end: string } {
    // Default delivery window
    return { start: '08:00', end: '18:00' }
}

export function EstimatedArrivalCard({ estimatedDelivery, status }: EstimatedArrivalCardProps) {
    if (!estimatedDelivery || status === 'delivered') {
        return null
    }

    const deliveryDate = new Date(estimatedDelivery)
    const now = new Date()

    const isToday = deliveryDate.toDateString() === now.toDateString()
    const isTomorrow = deliveryDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()
    const isPast = deliveryDate < now

    const diffMs = deliveryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))

    const window = formatDeliveryWindow()
    const currentHour = now.getHours()
    const timeOfDay = getTimeOfDayIcon(currentHour)
    const TimeIcon = timeOfDay.icon

    const dayName = deliveryDate.toLocaleDateString('pt-BR', { weekday: 'long' })
    const formattedDate = deliveryDate.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long'
    })

    if (status === 'out_for_delivery') {
        return (
            <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 overflow-hidden">
                {/* Live Banner */}
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-semibold">EM ROTA DE ENTREGA</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-xs">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Ao vivo</span>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-sm text-purple-600 mb-2">Previsão de chegada</p>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="text-5xl font-bold text-purple-700">HOJE</div>
                        </div>

                        {/* Time Window */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-purple-100">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span className="text-lg font-semibold text-purple-700">
                                {window.start} - {window.end}
                            </span>
                        </div>

                        {/* Countdown */}
                        {diffHours > 0 && diffHours <= 12 && (
                            <p className="mt-4 text-sm text-purple-600">
                                Estimativa: próximas <span className="font-bold">{diffHours}h</span>
                            </p>
                        )}

                        {/* Tips */}
                        <div className="mt-4 pt-4 border-t border-purple-100 text-xs text-purple-600">
                            <p>💡 Mantenha alguém disponível para receber</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`border shadow-lg overflow-hidden ${isPast
                ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
                : isToday
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                    : 'border-slate-200 bg-white'
            }`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    {/* Left - Date Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className={`w-5 h-5 ${isPast ? 'text-amber-500' : 'text-blue-500'}`} />
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                Previsão de Entrega
                            </p>
                        </div>

                        {isToday ? (
                            <p className="text-3xl font-bold text-emerald-600">Hoje!</p>
                        ) : isTomorrow ? (
                            <p className="text-3xl font-bold text-blue-600">Amanhã</p>
                        ) : isPast ? (
                            <p className="text-2xl font-bold text-amber-600">Em análise</p>
                        ) : (
                            <p className="text-2xl font-bold text-slate-800 capitalize">{dayName}</p>
                        )}

                        {!isPast && (
                            <p className="text-sm text-slate-500 mt-1 capitalize">{formattedDate}</p>
                        )}
                    </div>

                    {/* Right - Countdown */}
                    <div className={`text-right px-4 py-3 rounded-xl ${isPast ? 'bg-amber-100' : isToday ? 'bg-emerald-100' : 'bg-slate-100'
                        }`}>
                        {isPast ? (
                            <div className="flex items-center gap-2 text-amber-700">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Atrasado</span>
                            </div>
                        ) : (
                            <>
                                <p className={`text-3xl font-bold ${isToday ? 'text-emerald-600' : 'text-slate-700'}`}>
                                    {diffDays}
                                </p>
                                <p className={`text-xs ${isToday ? 'text-emerald-600' : 'text-slate-500'}`}>
                                    {diffDays === 1 ? 'dia' : 'dias'}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Delivery Window */}
                {!isPast && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Janela de entrega</span>
                        </div>
                        <span className="font-medium text-slate-700">{window.start} - {window.end}</span>
                    </div>
                )}

                {/* Past Due Notice */}
                {isPast && (
                    <div className="mt-4 pt-4 border-t border-amber-200 text-xs text-amber-700">
                        <p>⚠️ A data estimada passou. A entrega pode acontecer a qualquer momento ou já ocorreu.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
