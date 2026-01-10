'use client'

import {
    Truck,
    MapPin,
    Navigation,
    Zap,
    Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryVehicleTrackerProps {
    status: string
    progress: number // 0-100
    driverName?: string
    vehiclePlate?: string
    estimatedMinutes?: number
}

export function DeliveryVehicleTracker({
    status,
    progress: initialProgress,
    driverName,
    vehiclePlate,
    estimatedMinutes = 30
}: DeliveryVehicleTrackerProps) {
    const [mounted, setMounted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentSpeed, setCurrentSpeed] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Animate progress
        const timer = setTimeout(() => setProgress(initialProgress), 500)

        // Animate speed
        const speedTimer = setInterval(() => {
            setCurrentSpeed(Math.floor(Math.random() * 20) + 35) // 35-55 km/h
        }, 3000)

        return () => {
            clearTimeout(timer)
            clearInterval(speedTimer)
        }
    }, [initialProgress])

    const isOutForDelivery = status === 'out_for_delivery'

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${mounted ? 'animate-in fade-in zoom-in duration-500' : 'opacity-0'
            }`}>
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-indigo-400" />
                            Rastreamento ao Vivo
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            Acompanhe em tempo real
                        </p>
                    </div>
                    {isOutForDelivery && (
                        <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full">
                            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-sm font-medium">AO VIVO</span>
                        </div>
                    )}
                </div>

                {/* Route Visualization */}
                <div className="relative h-24 mb-8">
                    {/* Road */}
                    <div className="absolute top-1/2 left-0 right-0 h-3 bg-slate-700 rounded-full transform -translate-y-1/2">
                        {/* Progress */}
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-50" />
                        </div>

                        {/* Road Markings */}
                        <div className="absolute inset-0 flex items-center justify-around px-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-4 h-0.5 bg-slate-600" />
                            ))}
                        </div>
                    </div>

                    {/* Origin */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
                        <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-slate-400" />
                        </div>
                    </div>

                    {/* Vehicle */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 z-20"
                        style={{ left: `${Math.min(progress, 92)}%` }}
                    >
                        <div className="relative">
                            {/* Vehicle Glow */}
                            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-xl opacity-50 scale-150" />

                            {/* Vehicle */}
                            <div className="relative w-14 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 animate-bounce" style={{ animationDuration: '2s' }}>
                                <Truck className="w-6 h-6 text-white" />
                            </div>

                            {/* Speed Badge */}
                            {isOutForDelivery && (
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                    <span className="text-xs text-indigo-400 font-mono">{currentSpeed} km/h</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 text-center">
                        <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{progress}%</p>
                        <p className="text-xs text-slate-400">Progresso</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 text-center">
                        <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{estimatedMinutes}</p>
                        <p className="text-xs text-slate-400">min restantes</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 text-center">
                        <Navigation className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{Math.round((100 - progress) * 0.5)}</p>
                        <p className="text-xs text-slate-400">km restantes</p>
                    </div>
                </div>

                {/* Driver Info */}
                {driverName && (
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {driverName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-semibold">{driverName}</p>
                                {vehiclePlate && (
                                    <p className="text-slate-400 text-sm font-mono">{vehiclePlate}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
