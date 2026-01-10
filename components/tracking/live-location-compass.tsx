'use client'

import {
    Compass,
    Navigation,
    MapPin,
    Truck,
    Home,
    ArrowUpRight
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface LiveLocationCompassProps {
    currentLocation?: string | null
    destinationCity: string
    bearing?: number // degrees
}

export function LiveLocationCompass({ currentLocation, destinationCity, bearing = 45 }: LiveLocationCompassProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedBearing, setAnimatedBearing] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Animate compass needle
        let current = 0
        const animate = () => {
            current += (bearing - current) * 0.1
            setAnimatedBearing(current)
            if (Math.abs(bearing - current) > 0.5) {
                requestAnimationFrame(animate)
            } else {
                setAnimatedBearing(bearing)
            }
        }
        requestAnimationFrame(animate)
    }, [bearing])

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Direção da Entrega</h3>
                        <p className="text-sm text-slate-500">Bússola em tempo real</p>
                    </div>
                </div>
            </div>

            {/* Compass */}
            <div className="p-8">
                <div className="relative w-48 h-48 mx-auto">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200">
                        {/* Cardinal directions */}
                        {['N', 'L', 'S', 'O'].map((direction, i) => {
                            const angle = i * 90 - 90
                            const x = 96 + 80 * Math.cos(angle * Math.PI / 180)
                            const y = 96 + 80 * Math.sin(angle * Math.PI / 180)
                            return (
                                <span
                                    key={direction}
                                    className="absolute text-sm font-bold text-slate-400"
                                    style={{
                                        left: x,
                                        top: y,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {direction}
                                </span>
                            )
                        })}
                    </div>

                    {/* Inner circle with gradient */}
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-50 to-slate-100" />

                    {/* Compass Needle */}
                    <div
                        className="absolute inset-12 transition-transform duration-500"
                        style={{ transform: `rotate(${animatedBearing}deg)` }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* North pointer (red) */}
                            <polygon
                                points="50,10 45,50 55,50"
                                fill="#ef4444"
                                className="drop-shadow-md"
                            />
                            {/* South pointer (gray) */}
                            <polygon
                                points="50,90 45,50 55,50"
                                fill="#94a3b8"
                            />
                            {/* Center circle */}
                            <circle cx="50" cy="50" r="6" fill="#1e293b" />
                        </svg>
                    </div>

                    {/* Destination indicator */}
                    <div
                        className="absolute"
                        style={{
                            left: `${50 + 35 * Math.cos((animatedBearing - 90) * Math.PI / 180)}%`,
                            top: `${50 + 35 * Math.sin((animatedBearing - 90) * Math.PI / 180)}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Location Info */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                            <p className="text-xs text-blue-500">Localização atual</p>
                            <p className="font-medium text-blue-700">{currentLocation || 'Em trânsito'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                        <Home className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                            <p className="text-xs text-emerald-500">Destino</p>
                            <p className="font-medium text-emerald-700">{destinationCity}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}
