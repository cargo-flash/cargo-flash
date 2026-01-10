'use client'

import {
    CheckCircle2,
    Package,
    Truck,
    MapPin,
    Clock,
    XCircle,
    RotateCcw,
    Building2,
    ArrowRight,
    Navigation
} from 'lucide-react'
import type { DeliveryHistory } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EnhancedTimelineProps {
    events: DeliveryHistory[]
}

const getEventIcon = (status: string) => {
    const iconMap: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
        pending: { icon: Clock, color: 'bg-amber-100 text-amber-600 border-amber-200' },
        collected: { icon: Package, color: 'bg-blue-100 text-blue-600 border-blue-200' },
        in_transit: { icon: Truck, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
        out_for_delivery: { icon: Navigation, color: 'bg-purple-100 text-purple-600 border-purple-200' },
        delivered: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
        failed: { icon: XCircle, color: 'bg-red-100 text-red-600 border-red-200' },
        returned: { icon: RotateCcw, color: 'bg-gray-100 text-gray-600 border-gray-200' },
        arrival: { icon: Building2, color: 'bg-slate-100 text-slate-600 border-slate-200' },
        departure: { icon: ArrowRight, color: 'bg-slate-100 text-slate-600 border-slate-200' },
    }
    return iconMap[status] || iconMap.pending
}

function formatEventDateTime(dateString: string): { date: string; time: string; dayOfWeek: string } {
    const d = new Date(dateString)
    return {
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dayOfWeek: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
    }
}

export function EnhancedTimeline({ events }: EnhancedTimelineProps) {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">Aguardando movimentações</p>
                <p className="text-xs text-slate-400 mt-1">As atualizações aparecerão aqui</p>
            </div>
        )
    }

    return (
        <div className="space-y-0">
            {events.map((event, index) => {
                const { icon: Icon, color } = getEventIcon(event.status)
                const { date, time, dayOfWeek } = formatEventDateTime(event.created_at)
                const isFirst = index === 0
                const isLast = index === events.length - 1

                // Parse location info
                const locationParts = event.location?.split(' - ') || []
                const mainLocation = locationParts[0] || event.location || ''
                const unit = locationParts[1] || ''

                const cityState = event.city && event.state
                    ? `${event.city}/${event.state}`
                    : ''

                return (
                    <div
                        key={event.id}
                        className={cn(
                            "relative group",
                            isFirst && "z-10"
                        )}
                    >
                        {/* Active highlight for first event */}
                        {isFirst && (
                            <div className="absolute -inset-x-4 -inset-y-1 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-transparent rounded-xl -z-10" />
                        )}

                        <div className="flex gap-4 py-4">
                            {/* Timeline Column */}
                            <div className="flex flex-col items-center w-20 flex-shrink-0">
                                {/* Date/Time */}
                                <div className="text-center mb-2">
                                    <p className="text-xs font-bold text-slate-700">{date}</p>
                                    <p className="text-xs text-slate-500">{time}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">{dayOfWeek}</p>
                                </div>

                                {/* Icon */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                    color,
                                    isFirst && "ring-4 ring-blue-100 scale-110"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Connector Line */}
                                {!isLast && (
                                    <div className={cn(
                                        "w-0.5 flex-1 min-h-[40px] mt-2",
                                        isFirst
                                            ? "bg-gradient-to-b from-blue-300 to-slate-200"
                                            : "bg-slate-200"
                                    )} />
                                )}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                                {/* Status Badge */}
                                {isFirst && (
                                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full mb-2">
                                        Mais recente
                                    </span>
                                )}

                                {/* Location */}
                                <div className="mb-2">
                                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        {mainLocation}
                                    </p>
                                    {(unit || cityState) && (
                                        <div className="flex items-center gap-2 mt-1 ml-6 text-sm text-slate-500">
                                            {unit && (
                                                <>
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    <span>{unit}</span>
                                                </>
                                            )}
                                            {unit && cityState && <span>•</span>}
                                            {cityState && <span>{cityState}</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {event.description && (
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        isFirst ? "text-slate-700" : "text-slate-500"
                                    )}>
                                        {event.description}
                                    </p>
                                )}

                                {/* Operational Note */}
                                {isFirst && event.status === 'in_transit' && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
                                        <Truck className="w-3.5 h-3.5" />
                                        <span>Veículo em deslocamento</span>
                                    </div>
                                )}

                                {isFirst && event.status === 'out_for_delivery' && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg w-fit">
                                        <Navigation className="w-3.5 h-3.5" />
                                        <span>Motorista a caminho do endereço de entrega</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Footer */}
            <div className="pt-4 text-center">
                <p className="text-xs text-slate-400">
                    Exibindo {events.length} {events.length === 1 ? 'movimentação' : 'movimentações'}
                </p>
            </div>
        </div>
    )
}
