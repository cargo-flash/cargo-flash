'use client'

import {
    MapPin,
    Clock,
    Package,
    Truck,
    CheckCircle2,
    Navigation,
    Building2
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface AnimatedRoutePathProps {
    status: string
    originCity: string
    destinationCity: string
    currentCity?: string | null
}

interface RoutePoint {
    city: string
    state: string
    type: 'origin' | 'hub' | 'current' | 'destination'
    completed: boolean
}

export function AnimatedRoutePath({ status, originCity, destinationCity, currentCity }: AnimatedRoutePathProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedPoints, setAnimatedPoints] = useState(0)

    const isDelivered = status === 'delivered'
    const isOutForDelivery = status === 'out_for_delivery'
    const isInTransit = status === 'in_transit'

    // Generate route points
    const routePoints: RoutePoint[] = [
        { city: originCity.split(',')[0], state: 'SP', type: 'origin', completed: true },
        { city: 'Centro de Distribuição', state: '', type: 'hub', completed: isInTransit || isOutForDelivery || isDelivered },
        { city: currentCity || 'Hub Regional', state: '', type: 'current', completed: isOutForDelivery || isDelivered },
        { city: destinationCity.split(',')[0], state: '', type: 'destination', completed: isDelivered }
    ]

    useEffect(() => {
        setMounted(true)
        // Animate points appearing
        routePoints.forEach((_, index) => {
            setTimeout(() => {
                setAnimatedPoints(prev => Math.max(prev, index + 1))
            }, index * 300)
        })
    }, [])

    return (
        <div className={`relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 overflow-hidden ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Rota da Entrega</h3>
                        <p className="text-sm text-slate-500">Acompanhe o trajeto</p>
                    </div>
                </div>

                {/* Route Visualization */}
                <div className="relative">
                    {routePoints.map((point, index) => {
                        const isLast = index === routePoints.length - 1
                        const isVisible = index < animatedPoints

                        return (
                            <div
                                key={index}
                                className={`relative flex gap-5 pb-8 ${isVisible ? 'animate-in fade-in slide-in-from-left duration-500' : 'opacity-0'
                                    }`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Connector Line */}
                                {!isLast && (
                                    <div className={`absolute left-6 top-12 w-0.5 h-[calc(100%-12px)] ${point.completed ? 'bg-gradient-to-b from-indigo-500 to-purple-500' : 'bg-slate-200'
                                        }`} />
                                )}

                                {/* Icon */}
                                <div className="relative z-10">
                                    <div className={`
                                        w-12 h-12 rounded-2xl flex items-center justify-center
                                        transition-all duration-500
                                        ${point.completed
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200'
                                            : 'bg-slate-100'
                                        }
                                        ${point.type === 'current' && !isDelivered ? 'animate-pulse scale-110' : ''}
                                    `}>
                                        {point.type === 'origin' && <Package className={`w-5 h-5 ${point.completed ? 'text-white' : 'text-slate-400'}`} />}
                                        {point.type === 'hub' && <Building2 className={`w-5 h-5 ${point.completed ? 'text-white' : 'text-slate-400'}`} />}
                                        {point.type === 'current' && <Truck className={`w-5 h-5 ${point.completed ? 'text-white' : 'text-slate-400'}`} />}
                                        {point.type === 'destination' && <MapPin className={`w-5 h-5 ${point.completed ? 'text-white' : 'text-slate-400'}`} />}
                                    </div>

                                    {/* Live indicator for current */}
                                    {point.type === 'current' && !isDelivered && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white">
                                            <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className={`font-semibold ${point.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {point.city}
                                            </h4>
                                            <p className={`text-sm ${point.completed ? 'text-slate-500' : 'text-slate-300'}`}>
                                                {point.type === 'origin' && 'Ponto de coleta'}
                                                {point.type === 'hub' && 'Centro de triagem'}
                                                {point.type === 'current' && 'Posição atual'}
                                                {point.type === 'destination' && 'Destino final'}
                                            </p>
                                        </div>
                                        {point.completed && (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ETA */}
                {!isDelivered && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Previsão de chegada no destino em breve</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
