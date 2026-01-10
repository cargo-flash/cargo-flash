'use client'

import {
    MapPin,
    Package,
    Truck,
    CheckCircle2,
    Navigation,
    ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface JourneyVisualizerProps {
    status: string
    originCity: string
    originState: string
    destinationCity: string
    destinationState: string
    currentLocation?: string | null
}

const journeySteps = [
    { key: 'origin', label: 'Origem', icon: Package },
    { key: 'transit', label: 'Em Trânsito', icon: Truck },
    { key: 'destination', label: 'Destino', icon: MapPin },
]

function getProgressForStatus(status: string): number {
    const statusProgress: Record<string, number> = {
        pending: 0,
        collected: 15,
        in_transit: 50,
        out_for_delivery: 85,
        delivered: 100,
        failed: 75,
        returned: 50
    }
    return statusProgress[status] || 0
}

export function JourneyVisualizer({
    status,
    originCity,
    originState,
    destinationCity,
    destinationState,
    currentLocation
}: JourneyVisualizerProps) {
    const progress = getProgressForStatus(status)
    const isDelivered = status === 'delivered'
    const isInTransit = ['in_transit', 'out_for_delivery'].includes(status)

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white overflow-hidden">
            <CardContent className="p-5">
                {/* Title */}
                <div className="flex items-center gap-2 mb-6">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Trajeto da Entrega</span>
                </div>

                {/* Journey Line */}
                <div className="relative">
                    {/* Background Track */}
                    <div className="absolute top-6 left-8 right-8 h-1.5 bg-slate-200 rounded-full" />

                    {/* Progress Track */}
                    <div
                        className={`absolute top-6 left-8 h-1.5 rounded-full transition-all duration-1000 ${isDelivered
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
                            }`}
                        style={{ width: `calc(${progress}% - 64px)` }}
                    />

                    {/* Moving Vehicle Icon (if in transit) */}
                    {isInTransit && (
                        <div
                            className="absolute top-3 transition-all duration-1000"
                            style={{ left: `calc(${progress}% - 12px)` }}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-bounce">
                                    <Truck className="w-4 h-4 text-white" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
                            </div>
                        </div>
                    )}

                    {/* Journey Points */}
                    <div className="flex justify-between relative">
                        {/* Origin */}
                        <div className="flex flex-col items-center w-24">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${progress >= 0
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                <Package className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-3">Origem</p>
                            <p className="text-xs text-slate-500 text-center">
                                {originCity}<br />{originState}
                            </p>
                        </div>

                        {/* Current Location (middle) */}
                        <div className="flex flex-col items-center w-32">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${isInTransit
                                    ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white ring-4 ring-purple-100'
                                    : isDelivered
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                <Truck className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-3">
                                {isInTransit ? 'Posição Atual' : 'Trânsito'}
                            </p>
                            <p className="text-xs text-slate-500 text-center max-w-[100px] truncate">
                                {currentLocation || 'Aguardando'}
                            </p>
                        </div>

                        {/* Destination */}
                        <div className="flex flex-col items-center w-24">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${isDelivered
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                {isDelivered ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <MapPin className="w-6 h-6" />
                                )}
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-3">Destino</p>
                            <p className="text-xs text-slate-500 text-center">
                                {destinationCity}<br />{destinationState}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Percentage */}
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-100">
                    <div className={`text-lg font-bold ${isDelivered ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {progress}%
                    </div>
                    <span className="text-sm text-slate-500">do trajeto concluído</span>
                </div>
            </CardContent>
        </Card>
    )
}
