'use client'

import { CheckCircle2, Package, Truck, MapPin, Clock, XCircle, RotateCcw, Info } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { DeliveryHistory } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EventTimelineProps {
    events: DeliveryHistory[]
}

const getEventIcon = (status: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        pending: Clock,
        collected: Package,
        in_transit: Truck,
        out_for_delivery: MapPin,
        delivered: CheckCircle2,
        failed: XCircle,
        returned: RotateCcw,
    }
    return iconMap[status] || Info
}

const getEventColor = (status: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
        collected: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
        in_transit: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
        out_for_delivery: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
        delivered: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
        failed: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        returned: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
    }
    return colorMap[status] || colorMap.pending
}

export function EventTimeline({ events }: EventTimelineProps) {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">Nenhuma atualização disponível ainda</p>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-indigo-200 to-slate-200" />

            <div className="space-y-0">
                {events.map((event, index) => {
                    const Icon = getEventIcon(event.status)
                    const colors = getEventColor(event.status)
                    const isFirst = index === 0
                    const isLast = index === events.length - 1
                    const { date, time } = formatDateTime(event.created_at)

                    return (
                        <div
                            key={event.id}
                            className={cn(
                                "relative pl-16 pr-4 py-4 transition-all duration-300",
                                isFirst && "bg-gradient-to-r from-slate-50 to-transparent rounded-xl",
                                "hover:bg-slate-50 group"
                            )}
                        >
                            {/* Icon */}
                            <div
                                className={cn(
                                    "absolute left-3 top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    colors.bg, colors.text, colors.border,
                                    isFirst && "scale-110 shadow-lg ring-4 ring-white"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </div>

                            {/* Content */}
                            <div className="min-w-0">
                                {/* Date and Time */}
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-sm font-bold text-slate-900">
                                        {date}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {time}
                                    </span>
                                    {isFirst && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                            Mais recente
                                        </span>
                                    )}
                                </div>

                                {/* Location */}
                                {event.location && (
                                    <p className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        {event.location}
                                    </p>
                                )}

                                {/* Description */}
                                {event.description && (
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {event.description}
                                    </p>
                                )}
                            </div>

                            {/* Hover effect line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-full" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
