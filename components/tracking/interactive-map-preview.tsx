'use client'

import {
    Truck,
    Package,
    MapPin,
    Navigation,
    Wind,
    Gauge
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface InteractiveMapPreviewProps {
    originCity?: string
    destinationCity?: string
    currentLocation?: string | null
    status?: string
    progress?: number
}

export function InteractiveMapPreview({
    originCity = 'São Paulo',
    destinationCity = 'Rio de Janeiro',
    currentLocation,
    status = 'in_transit',
    progress = 65
}: InteractiveMapPreviewProps) {
    const [mounted, setMounted] = useState(false)
    const [truckPosition, setTruckPosition] = useState(0)
    const [isAnimating, setIsAnimating] = useState(true)

    useEffect(() => {
        setMounted(true)

        // Animate truck along path
        const targetProgress = progress / 100
        let current = 0

        const animate = () => {
            current += 0.01
            if (current < targetProgress) {
                setTruckPosition(current)
                requestAnimationFrame(animate)
            } else {
                setTruckPosition(targetProgress)
            }
        }

        requestAnimationFrame(animate)
    }, [progress])

    // Calculate position on path (simplified bezier curve)
    const getPositionOnPath = (t: number) => {
        // Control points for curved path
        const p0 = { x: 50, y: 280 } // Start
        const p1 = { x: 150, y: 150 } // Control 1
        const p2 = { x: 350, y: 200 } // Control 2
        const p3 = { x: 450, y: 100 } // End

        const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x
        const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y

        return { x, y }
    }

    const truckPos = getPositionOnPath(truckPosition)

    const landmarks = [
        { name: originCity, position: getPositionOnPath(0), type: 'origin' },
        { name: 'Centro de Distribuição', position: getPositionOnPath(0.35), type: 'hub' },
        { name: currentLocation || 'Em trânsito', position: getPositionOnPath(truckPosition), type: 'current' },
        { name: destinationCity, position: getPositionOnPath(1), type: 'destination' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl border border-slate-200 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Background Map Pattern */}
            <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[...Array(10)].map((_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 30} x2="500" y2={i * 30} stroke="#94a3b8" strokeWidth="0.5" />
                    ))}
                    {[...Array(20)].map((_, i) => (
                        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="300" stroke="#94a3b8" strokeWidth="0.5" />
                    ))}
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <svg className="w-full h-[300px]" viewBox="0 0 500 300">
                    {/* Route Path Background */}
                    <path
                        d="M 50,280 Q 150,150 250,200 T 450,100"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Completed Route */}
                    <path
                        d="M 50,280 Q 150,150 250,200 T 450,100"
                        fill="none"
                        stroke="url(#routeGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset={1000 - (1000 * truckPosition)}
                        className="transition-all duration-300"
                    />

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>

                    {/* Origin Marker */}
                    <g transform={`translate(${getPositionOnPath(0).x}, ${getPositionOnPath(0).y})`}>
                        <circle r="12" fill="#3b82f6" className="animate-pulse" />
                        <circle r="6" fill="#ffffff" />
                    </g>

                    {/* Destination Marker */}
                    <g transform={`translate(${getPositionOnPath(1).x}, ${getPositionOnPath(1).y})`}>
                        <circle r="12" fill="#22c55e" className="animate-pulse" />
                        <circle r="6" fill="#ffffff" />
                    </g>

                    {/* Truck Icon */}
                    <g transform={`translate(${truckPos.x}, ${truckPos.y})`}>
                        <circle r="18" fill="#8b5cf6" className="animate-pulse" />
                        <g transform="translate(-8, -8) scale(0.7)">
                            <rect x="0" y="6" width="20" height="12" rx="2" fill="white" />
                            <rect x="14" y="2" width="10" height="16" rx="2" fill="white" />
                        </g>
                    </g>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-slate-600">{originCity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-xs text-slate-600">Em trânsito</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-600">{destinationCity}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Gauge className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-indigo-600">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
