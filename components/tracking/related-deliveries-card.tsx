'use client'

import {
    Package,
    ArrowRight,
    Clock,
    CheckCircle2,
    Truck,
    AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface RelatedDelivery {
    tracking_code: string
    status: string
    destination_city: string
    destination_state: string
    updated_at: string
}

interface RelatedDeliveriesCardProps {
    currentCode: string
    relatedDeliveries?: RelatedDelivery[]
}

const statusConfig: Record<string, { icon: typeof Package; color: string; label: string }> = {
    pending: { icon: Clock, color: 'text-slate-500 bg-slate-100', label: 'Aguardando' },
    collected: { icon: Package, color: 'text-blue-500 bg-blue-100', label: 'Coletado' },
    in_transit: { icon: Truck, color: 'text-indigo-500 bg-indigo-100', label: 'Em Trânsito' },
    out_for_delivery: { icon: Truck, color: 'text-purple-500 bg-purple-100', label: 'Em Rota' },
    delivered: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-100', label: 'Entregue' },
    failed: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-100', label: 'Não Entregue' },
    returned: { icon: AlertTriangle, color: 'text-red-500 bg-red-100', label: 'Devolvido' }
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays}d atrás`
}

export function RelatedDeliveriesCard({ currentCode, relatedDeliveries }: RelatedDeliveriesCardProps) {
    // Filter out current delivery and show only related ones
    const filteredDeliveries = relatedDeliveries?.filter(d => d.tracking_code !== currentCode) || []

    // If no related deliveries, don't render
    if (filteredDeliveries.length === 0) {
        return null
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    Outras Encomendas
                    <span className="ml-auto text-xs text-slate-400 font-normal bg-slate-100 px-2 py-0.5 rounded-full">
                        {filteredDeliveries.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    {filteredDeliveries.slice(0, 5).map((delivery) => {
                        const config = statusConfig[delivery.status] || statusConfig.pending
                        const Icon = config.icon

                        return (
                            <Link
                                key={delivery.tracking_code}
                                href={`/rastrear/${delivery.tracking_code}`}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                            >
                                <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-sm font-semibold text-slate-800">
                                            {delivery.tracking_code}
                                        </p>
                                        <span className="text-xs text-slate-400">
                                            {formatTimeAgo(delivery.updated_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {config.label} • {delivery.destination_city}, {delivery.destination_state}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                            </Link>
                        )
                    })}
                </div>

                {filteredDeliveries.length > 5 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            + {filteredDeliveries.length - 5} outras encomendas
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
