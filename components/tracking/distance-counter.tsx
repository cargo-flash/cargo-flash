'use client'

import { useEffect, useState } from 'react'
import { MapPin, Navigation, Truck, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DistanceCounterProps {
    currentLat?: number
    currentLng?: number
    destinationLat?: number
    destinationLng?: number
    originLat?: number
    originLng?: number
    progressPercent: number
    estimatedDelivery?: string
    status: string
    className?: string
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

/**
 * Format distance for display
 */
function formatDistance(km: number): { value: string; unit: string } {
    if (km < 1) {
        return { value: Math.round(km * 1000).toString(), unit: 'm' }
    }
    if (km < 10) {
        return { value: km.toFixed(1), unit: 'km' }
    }
    return { value: Math.round(km).toLocaleString('pt-BR'), unit: 'km' }
}

/**
 * Calculate estimated time based on distance and average speed
 */
function calculateETA(distanceKm: number, avgSpeedKmh: number = 60): string {
    const hours = distanceKm / avgSpeedKmh

    if (hours < 1) {
        const minutes = Math.round(hours * 60)
        return `${minutes} min`
    }

    if (hours < 24) {
        const h = Math.floor(hours)
        const m = Math.round((hours - h) * 60)
        return m > 0 ? `${h}h ${m}min` : `${h}h`
    }

    const days = Math.round(hours / 24)
    return `${days} ${days === 1 ? 'dia' : 'dias'}`
}

export function DistanceCounter({
    currentLat,
    currentLng,
    destinationLat,
    destinationLng,
    originLat,
    originLng,
    progressPercent,
    estimatedDelivery,
    status,
    className
}: DistanceCounterProps) {
    const [animatedDistance, setAnimatedDistance] = useState(0)
    const [animatedProgress, setAnimatedProgress] = useState(0)

    // Calculate actual remaining distance
    const hasCoordinates = currentLat && currentLng && destinationLat && destinationLng
    const remainingDistance = hasCoordinates
        ? calculateDistanceKm(currentLat, currentLng, destinationLat, destinationLng)
        : 0

    // Calculate total distance from origin to destination
    const totalDistance = originLat && originLng && destinationLat && destinationLng
        ? calculateDistanceKm(originLat, originLng, destinationLat, destinationLng)
        : 0

    // Calculate traveled distance
    const traveledDistance = totalDistance - remainingDistance

    // Animate the distance number
    useEffect(() => {
        const duration = 1500 // Animation duration in ms
        const steps = 60
        const stepTime = duration / steps
        const increment = remainingDistance / steps

        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= remainingDistance) {
                setAnimatedDistance(remainingDistance)
                clearInterval(timer)
            } else {
                setAnimatedDistance(current)
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [remainingDistance])

    // Animate progress bar
    useEffect(() => {
        const duration = 1000
        const steps = 50
        const stepTime = duration / steps
        const increment = progressPercent / steps

        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= progressPercent) {
                setAnimatedProgress(progressPercent)
                clearInterval(timer)
            } else {
                setAnimatedProgress(current)
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [progressPercent])

    const formattedDistance = formatDistance(animatedDistance)
    const eta = calculateETA(remainingDistance)

    // Status-based styling
    const isDelivered = status === 'delivered'
    const isOutForDelivery = status === 'out_for_delivery'

    if (!hasCoordinates) {
        return null
    }

    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border border-slate-700/50",
            "shadow-xl",
            className
        )}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-pulse" />
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/30 to-transparent transition-all duration-1000"
                    style={{ width: `${animatedProgress}%` }}
                />
            </div>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                            <Navigation className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                            Distância até você
                        </span>
                    </div>
                    {isOutForDelivery && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400">Em rota</span>
                        </div>
                    )}
                </div>

                {/* Main Distance Display */}
                <div className="flex items-baseline gap-2 mb-6">
                    {isDelivered ? (
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                <MapPin className="h-8 w-8 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">Entregue!</p>
                                <p className="text-sm text-slate-400">Sua encomenda chegou ao destino</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="text-5xl font-bold text-white tabular-nums tracking-tight">
                                {formattedDistance.value}
                            </span>
                            <span className="text-2xl font-medium text-slate-400">
                                {formattedDistance.unit}
                            </span>
                            <span className="ml-2 text-sm text-slate-500">restantes</span>
                        </>
                    )}
                </div>

                {/* Progress Bar */}
                {!isDelivered && (
                    <div className="mb-6">
                        <div className="relative h-3 rounded-full bg-slate-700/50 overflow-hidden">
                            {/* Animated progress */}
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-emerald-400 transition-all duration-500"
                                style={{ width: `${animatedProgress}%` }}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>

                            {/* Truck icon on progress */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                                style={{ left: `${animatedProgress}%` }}
                            >
                                <div className="p-1.5 rounded-full bg-white shadow-lg shadow-emerald-500/30">
                                    <Truck className="h-3 w-3 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        {/* Progress labels */}
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>Origem</span>
                            <span className="font-medium text-slate-300">{Math.round(animatedProgress)}%</span>
                            <span>Destino</span>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                {!isDelivered && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* Traveled */}
                        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span className="text-[10px] uppercase tracking-wider text-slate-500">Percorrido</span>
                            </div>
                            <p className="text-lg font-semibold text-white">
                                {formatDistance(traveledDistance).value}
                                <span className="text-xs text-slate-400 ml-1">km</span>
                            </p>
                        </div>

                        {/* ETA */}
                        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span className="text-[10px] uppercase tracking-wider text-slate-500">Tempo Est.</span>
                            </div>
                            <p className="text-lg font-semibold text-white">
                                {eta}
                            </p>
                        </div>

                        {/* Speed indicator */}
                        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Zap className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] uppercase tracking-wider text-slate-500">Status</span>
                            </div>
                            <p className="text-lg font-semibold text-emerald-400">
                                {isOutForDelivery ? 'Próximo' : 'Normal'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Reassurance message */}
                <div className="mt-4 pt-4 border-t border-slate-700/30">
                    <p className="text-xs text-slate-400 text-center">
                        {isDelivered
                            ? '✨ Obrigado por escolher Cargo Flash!'
                            : isOutForDelivery
                                ? '🚚 Seu pacote está a caminho! O entregador está próximo.'
                                : `📦 Sua encomenda está segura e ${remainingDistance > 100 ? 'viajando' : 'chegando'}...`
                        }
                    </p>
                </div>
            </div>

            {/* CSS for shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    )
}
