'use client'

import {
    Navigation2,
    MapPin,
    Truck,
    Clock,
    Wind
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface LiveLocationTrackerProps {
    status: string
    currentLocation?: string | null
    destination: string
    estimatedArrival?: string | null
}

export function LiveLocationTracker({ status, currentLocation, destination, estimatedArrival }: LiveLocationTrackerProps) {
    const [eta, setEta] = useState<string>('')
    const [distance, setDistance] = useState<string>('')
    const [speed, setSpeed] = useState<number>(0)
    const [heading, setHeading] = useState<number>(0)

    // Simulate live updates
    useEffect(() => {
        if (status !== 'out_for_delivery') return

        const updateSimulation = () => {
            // Simulate ETA
            const now = new Date()
            const randomMinutes = Math.floor(Math.random() * 60) + 30
            const arrival = new Date(now.getTime() + randomMinutes * 60 * 1000)
            setEta(arrival.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

            // Simulate distance
            const randomKm = (Math.random() * 10 + 2).toFixed(1)
            setDistance(`${randomKm} km`)

            // Simulate speed
            setSpeed(Math.floor(Math.random() * 30) + 20)

            // Simulate heading
            setHeading(Math.floor(Math.random() * 360))
        }

        updateSimulation()
        const interval = setInterval(updateSimulation, 30000) // Update every 30 seconds

        return () => clearInterval(interval)
    }, [status])

    // Only show for out_for_delivery status
    if (status !== 'out_for_delivery') {
        return null
    }

    return (
        <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 overflow-hidden">
            {/* Live Badge */}
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">RASTREAMENTO AO VIVO</span>
                </div>
                <div className="flex items-center gap-1 text-white/80 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Atualiza a cada 30s</span>
                </div>
            </div>

            <CardContent className="p-5">
                {/* Animated Truck */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        {/* Radar Effect */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="absolute w-24 h-24 rounded-full bg-purple-400/20 animate-ping" />
                            <span className="absolute w-16 h-16 rounded-full bg-purple-400/30" />
                        </div>

                        {/* Truck Icon */}
                        <div
                            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl"
                            style={{ transform: `rotate(${heading - 90}deg)` }}
                        >
                            <Navigation2 className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <p className="text-2xl font-bold text-purple-600">{eta || '--:--'}</p>
                        <p className="text-xs text-slate-500">Chegada Estimada</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <p className="text-2xl font-bold text-indigo-600">{distance || '-- km'}</p>
                        <p className="text-xs text-slate-500">Distância</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <div className="flex items-center justify-center gap-1">
                            <p className="text-2xl font-bold text-violet-600">{speed}</p>
                            <Wind className="w-4 h-4 text-violet-400" />
                        </div>
                        <p className="text-xs text-slate-500">km/h</p>
                    </div>
                </div>

                {/* Route Info */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
                            <div className="w-0.5 h-10 bg-gradient-to-b from-violet-300 to-purple-300 my-1" />
                            <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Localização Atual</p>
                                <p className="font-semibold text-purple-700">{currentLocation || 'Em trânsito'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Destino</p>
                                <p className="font-semibold text-slate-800">{destination}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-purple-600">
                    <Truck className="w-4 h-4" />
                    <span>Motorista em rota • Mantenha seu telefone por perto</span>
                </div>
            </CardContent>
        </Card>
    )
}
