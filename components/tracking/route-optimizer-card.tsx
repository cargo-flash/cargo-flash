'use client'

import {
    Route,
    Zap,
    Clock,
    TrendingUp,
    ArrowRight,
    MapPin,
    CheckCircle2
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface RouteOptimizerCardProps {
    originCity?: string
    destinationCity?: string
    currentCity?: string | null
    status?: string
}

export function RouteOptimizerCard({
    originCity = 'São Paulo',
    destinationCity = 'Rio de Janeiro',
    currentCity,
    status = 'in_transit'
}: RouteOptimizerCardProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const routeSteps = [
        { city: originCity, completed: true, time: '08:00' },
        { city: 'Centro de Distribuição', completed: status !== 'pending', time: '10:30' },
        { city: currentCity || 'Em trânsito', completed: ['out_for_delivery', 'delivered'].includes(status), time: '14:00' },
        { city: destinationCity, completed: status === 'delivered', time: '16:30' }
    ]

    const optimizations = [
        { icon: Zap, label: 'Rota otimizada', value: '-18% tempo', color: 'text-emerald-600 bg-emerald-50' },
        { icon: TrendingUp, label: 'Economia', value: '23 km', color: 'text-blue-600 bg-blue-50' },
        { icon: Clock, label: 'Previsão', value: '4.5h restantes', color: 'text-purple-600 bg-purple-50' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Route className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Rota Otimizada</h3>
                        <p className="text-sm text-slate-500">IA escolheu o melhor caminho</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Otimizada
                </span>
            </div>

            {/* Route Steps */}
            <div className="p-6 border-b border-slate-100">
                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200">
                        <div
                            className="w-full bg-gradient-to-b from-emerald-500 to-emerald-300 transition-all duration-1000"
                            style={{
                                height: `${(routeSteps.filter(s => s.completed).length / routeSteps.length) * 100}%`
                            }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-6">
                        {routeSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-4 relative">
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center z-10
                                    ${step.completed
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }
                                `}>
                                    {step.completed ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <MapPin className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${step.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {step.city}
                                    </p>
                                    <p className="text-xs text-slate-400">{step.time}</p>
                                </div>
                                {index < routeSteps.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-slate-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Optimization Stats */}
            <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                    {optimizations.map((opt, index) => {
                        const Icon = opt.icon
                        return (
                            <div key={index} className={`p-4 rounded-2xl text-center ${opt.color}`}>
                                <Icon className="w-5 h-5 mx-auto mb-2" />
                                <p className="text-lg font-bold">{opt.value}</p>
                                <p className="text-xs opacity-70">{opt.label}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
