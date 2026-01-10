'use client'

import {
    MapPin,
    Building2,
    Car,
    TreePine,
    ShoppingBag,
    Coffee,
    Shield,
    Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface NeighborhoodInfoCardProps {
    city?: string
    neighborhood?: string
    isDeliveryArea?: boolean
}

export function NeighborhoodInfoCard({
    city = 'São Paulo',
    neighborhood = 'Centro',
    isDeliveryArea = true
}: NeighborhoodInfoCardProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const areaFeatures = [
        { icon: Building2, label: 'Área comercial', available: true },
        { icon: Car, label: 'Fácil acesso', available: true },
        { icon: TreePine, label: 'Área residencial', available: true },
        { icon: Shield, label: 'Baixo risco', available: true }
    ]

    const nearbyPlaces = [
        { icon: ShoppingBag, name: 'Shopping Center', distance: '0.5 km' },
        { icon: Coffee, name: 'Café Central', distance: '0.2 km' },
        { icon: Building2, name: 'Estação Metro', distance: '0.3 km' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header with mini map */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
                {/* Abstract map pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path d="M 10,30 L 40,30 L 40,50 L 70,50 L 70,80" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M 30,10 L 30,60 L 90,60" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                        <circle cx="40" cy="50" r="5" fill="white" />
                    </svg>
                </div>

                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{neighborhood}</h3>
                        <p className="text-white/80">{city}</p>
                    </div>
                    {isDeliveryArea && (
                        <span className="px-3 py-1.5 bg-emerald-400/20 text-emerald-200 rounded-full text-xs font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Área coberta
                        </span>
                    )}
                </div>
            </div>

            {/* Area Features */}
            <div className="p-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-4">Características da área</p>
                <div className="grid grid-cols-2 gap-3">
                    {areaFeatures.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl"
                            >
                                <Icon className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm text-slate-600">{feature.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Nearby Places */}
            <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">Pontos de referência próximos</p>
                <div className="space-y-3">
                    {nearbyPlaces.map((place, index) => {
                        const Icon = place.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Icon className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <span className="font-medium text-slate-700">{place.name}</span>
                                </div>
                                <span className="text-sm text-slate-500">{place.distance}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Delivery Time Info */}
            <div className="px-6 pb-6">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                        <p className="text-sm font-medium text-indigo-700">Horário de entrega usual</p>
                        <p className="text-xs text-indigo-600/70">Das 08h às 18h em dias úteis</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
