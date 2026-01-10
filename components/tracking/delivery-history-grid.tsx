'use client'

import {
    History,
    Package,
    CheckCircle2,
    Clock,
    MapPin,
    Calendar,
    ExternalLink
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryHistoryGridProps {
    customerEmail?: string | null
}

interface PastDelivery {
    id: string
    trackingCode: string
    status: string
    date: string
    destination: string
    rating?: number
}

export function DeliveryHistoryGrid({ customerEmail }: DeliveryHistoryGridProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Mock past deliveries
    const pastDeliveries: PastDelivery[] = [
        { id: '1', trackingCode: 'CF2024120001', status: 'delivered', date: '2024-12-15', destination: 'São Paulo, SP', rating: 5 },
        { id: '2', trackingCode: 'CF2024110082', status: 'delivered', date: '2024-11-28', destination: 'Rio de Janeiro, RJ', rating: 4 },
        { id: '3', trackingCode: 'CF2024110045', status: 'delivered', date: '2024-11-10', destination: 'Belo Horizonte, MG', rating: 5 },
    ]

    if (!customerEmail || pastDeliveries.length === 0) {
        return null
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
                        <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Histórico de Entregas</h3>
                        <p className="text-sm text-slate-500">Suas entregas anteriores</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {pastDeliveries.length} entregas
                </span>
            </div>

            {/* Deliveries Grid */}
            <div className="p-6">
                <div className="space-y-4">
                    {pastDeliveries.map((delivery, index) => (
                        <a
                            key={delivery.id}
                            href={`/rastrear/${delivery.trackingCode.toLowerCase()}`}
                            className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-colors group cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                {delivery.status === 'delivered' ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                ) : (
                                    <Package className="w-6 h-6 text-indigo-500" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                    {delivery.trackingCode}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {delivery.destination}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(delivery.date)}
                                    </span>
                                </div>
                            </div>

                            {/* Rating */}
                            {delivery.rating && (
                                <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-full">
                                    <span className="text-amber-500">★</span>
                                    <span className="text-sm font-medium text-amber-600">{delivery.rating}</span>
                                </div>
                            )}

                            {/* Arrow */}
                            <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </a>
                    ))}
                </div>

                {/* View All */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <a
                        href="/meus-envios"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Ver todas as entregas →
                    </a>
                </div>
            </div>
        </div>
    )
}
