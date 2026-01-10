'use client'

import {
    Warehouse,
    Route,
    Tag,
    Truck
} from 'lucide-react'
import type { Delivery } from '@/lib/types'

interface LogisticsInfoCardProps {
    delivery: Delivery
}

function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

function generateLogisticsInfo(delivery: Delivery) {
    const createdDate = new Date(delivery.created_at)
    const unitNumber = (hashCode(delivery.id) % 9) + 1

    return {
        logisticsUnit: `UL-${delivery.destination_state || 'SP'}${unitNumber}`,
        route: `RT-${(delivery.origin_state || 'SP').slice(0, 2)}${(delivery.destination_state || 'SP').slice(0, 2)}-${createdDate.getDate().toString().padStart(2, '0')}`,
        serviceType: 'Expresso',
        modality: 'Rodoviário'
    }
}

export function LogisticsInfoCard({ delivery }: LogisticsInfoCardProps) {
    const info = generateLogisticsInfo(delivery)

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Route className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Informações Logísticas</h3>
            </div>

            <div className="p-5 space-y-4">
                {/* Service Type */}
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium bg-[#1e3a5f]/10 text-[#1e3a5f] rounded">
                        {info.serviceType}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {info.modality}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Warehouse className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-wider">Unidade</span>
                        </div>
                        <p className="font-mono text-sm font-semibold text-slate-700">{info.logisticsUnit}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Route className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-wider">Rota</span>
                        </div>
                        <p className="font-mono text-sm font-semibold text-slate-700">{info.route}</p>
                    </div>
                </div>

                {/* Origin/Destination */}
                <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f]" />
                            <div className="w-0.5 h-6 bg-slate-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Origem</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {delivery.origin_city || 'CD'}, {delivery.origin_state || 'SP'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Destino</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {delivery.destination_city}, {delivery.destination_state}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
