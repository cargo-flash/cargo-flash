'use client'

import {
    Package,
    Truck,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Navigation,
    Building2,
    Warehouse,
    Clock,
    Circle
} from 'lucide-react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TimelineEvent {
    id: string | number
    status: string
    location?: string | null
    city?: string | null
    state?: string | null
    description?: string | null
    created_at: string
    details?: string | null
    progress_percent?: number | null
    distance_traveled?: number | null
}

interface PremiumTimelineProps {
    history: TimelineEvent[]
    status: string
    hideTime?: boolean
}

const statusIcons: Record<string, typeof Package> = {
    pending: Package,
    collected: Package,
    in_transit: Truck,
    out_for_delivery: Navigation,
    delivered: CheckCircle2,
    failed: AlertCircle,
    hub_arrival: Building2,
    hub_departure: Building2,
    transit: Truck,
    departure: Warehouse,
    arrival: MapPin
}

const statusLabels: Record<string, string> = {
    pending: 'Objeto postado',
    collected: 'Objeto coletado',
    in_transit: 'Objeto em trânsito',
    out_for_delivery: 'Objeto saiu para entrega ao destinatário',
    delivered: 'Objeto entregue ao destinatário',
    failed: 'Tentativa de entrega não realizada',
    hub_arrival: 'Objeto recebido na unidade de tratamento',
    hub_departure: 'Objeto encaminhado para unidade de destino',
    transit: 'Objeto em trânsito - por favor aguarde',
    departure: 'Objeto postado',
    arrival: 'Objeto chegou à unidade de distribuição'
}

const statusColors: Record<string, string> = {
    pending: 'bg-slate-600',
    collected: 'bg-[#1e3a5f]',
    in_transit: 'bg-[#1e3a5f]',
    out_for_delivery: 'bg-[#b45309]',
    delivered: 'bg-[#166534]',
    failed: 'bg-[#c2410c]',
    hub_arrival: 'bg-slate-600',
    hub_departure: 'bg-slate-600',
    transit: 'bg-[#1e3a5f]',
    departure: 'bg-slate-600',
    arrival: 'bg-slate-600'
}

export function PremiumTimeline({ history, hideTime = false }: PremiumTimelineProps) {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Nenhum evento registrado</p>
                <p className="text-slate-400 text-sm mt-1">As atualizações aparecerão aqui</p>
            </div>
        )
    }

    const formatDateTime = (timestamp: string) => {
        try {
            const date = parseISO(timestamp)
            return {
                date: format(date, "dd/MM/yyyy", { locale: ptBR }),
                time: format(date, "HH:mm", { locale: ptBR }),
                relative: formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
            }
        } catch {
            return { date: '', time: '', relative: '' }
        }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Histórico de Movimentações
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {history.length} {history.length === 1 ? 'evento' : 'eventos'}
                </span>
            </div>

            {/* Events */}
            <div className="divide-y divide-slate-100">
                {history.map((event, index) => {
                    const Icon = statusIcons[event.status] || Package
                    const { date, time, relative } = formatDateTime(event.created_at)
                    const isFirst = index === 0
                    const isLast = index === history.length - 1
                    const color = statusColors[event.status] || 'bg-slate-500'

                    return (
                        <div
                            key={event.id}
                            className={`px-6 py-4 ${isFirst ? 'bg-slate-50' : ''}`}
                        >
                            <div className="flex gap-4">
                                {/* Timeline indicator */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    {!isLast && (
                                        <div className="w-0.5 flex-1 bg-slate-200 mt-2 min-h-[16px]" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1">
                                            <p className={`font-semibold ${isFirst ? 'text-slate-900' : 'text-slate-800'}`}>
                                                {statusLabels[event.status] || event.status}
                                            </p>

                                            {(event.city || event.location) && (
                                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>
                                                        {event.city && event.state
                                                            ? `${event.city} / ${event.state}`
                                                            : event.location
                                                        }
                                                    </span>
                                                </p>
                                            )}

                                            {event.description && (
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <div className="text-left sm:text-right flex-shrink-0">
                                            <p className="text-sm font-medium text-slate-700">
                                                {date}
                                            </p>
                                            {!hideTime && (
                                                <p className="text-sm text-slate-500">
                                                    {time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
