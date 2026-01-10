'use client'

import {
    Box,
    Thermometer,
    AlertTriangle,
    Droplets,
    Sun,
    Flame,
    Snowflake
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PackageConditionMonitorProps {
    isFragile?: boolean
    requiresRefrigeration?: boolean
    showTemperature?: boolean
}

export function PackageConditionMonitor({
    isFragile,
    requiresRefrigeration,
    showTemperature = true
}: PackageConditionMonitorProps) {
    const [mounted, setMounted] = useState(false)
    const [temperature, setTemperature] = useState(requiresRefrigeration ? 4 : 22)
    const [humidity, setHumidity] = useState(45)

    useEffect(() => {
        setMounted(true)

        // Simulate slight temperature fluctuations
        const interval = setInterval(() => {
            setTemperature(prev => prev + (Math.random() - 0.5) * 0.2)
            setHumidity(prev => Math.max(30, Math.min(60, prev + (Math.random() - 0.5) * 2)))
        }, 5000)

        return () => clearInterval(interval)
    }, [requiresRefrigeration])

    // Don't show if no special conditions
    if (!isFragile && !requiresRefrigeration) {
        return null
    }

    const getTemperatureStatus = () => {
        if (requiresRefrigeration) {
            if (temperature < 0) return { status: 'cold', color: 'text-blue-600 bg-blue-50', icon: Snowflake }
            if (temperature <= 8) return { status: 'ok', color: 'text-emerald-600 bg-emerald-50', icon: Thermometer }
            return { status: 'warning', color: 'text-amber-600 bg-amber-50', icon: Flame }
        }
        if (temperature > 35) return { status: 'hot', color: 'text-red-600 bg-red-50', icon: Sun }
        if (temperature < 10) return { status: 'cold', color: 'text-blue-600 bg-blue-50', icon: Snowflake }
        return { status: 'ok', color: 'text-emerald-600 bg-emerald-50', icon: Thermometer }
    }

    const tempStatus = getTemperatureStatus()
    const TempIcon = tempStatus.icon

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Box className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Condição da Embalagem</h3>
                        <p className="text-sm text-slate-500">Monitoramento em tempo real</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">Monitorando</span>
                </div>
            </div>

            {/* Conditions Grid */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Temperature */}
                    {showTemperature && (
                        <div className={`p-4 rounded-2xl ${tempStatus.color}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <TempIcon className="w-5 h-5" />
                                <span className="font-medium text-sm">Temperatura</span>
                            </div>
                            <p className="text-3xl font-bold">{temperature.toFixed(1)}°C</p>
                            <p className="text-xs opacity-70 mt-1">
                                {requiresRefrigeration ? 'Ideal: 2-8°C' : 'Ambiente normal'}
                            </p>
                        </div>
                    )}

                    {/* Humidity */}
                    <div className="p-4 rounded-2xl bg-cyan-50 text-cyan-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-5 h-5" />
                            <span className="font-medium text-sm">Umidade</span>
                        </div>
                        <p className="text-3xl font-bold">{humidity.toFixed(0)}%</p>
                        <p className="text-xs opacity-70 mt-1">Nível adequado</p>
                    </div>

                    {/* Fragile Status */}
                    {isFragile && (
                        <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-medium text-sm">Frágil</span>
                            </div>
                            <p className="text-lg font-bold">Cuidado Extra</p>
                            <p className="text-xs opacity-70 mt-1">Manuseio especial</p>
                        </div>
                    )}

                    {/* Refrigeration Status */}
                    {requiresRefrigeration && (
                        <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                            <div className="flex items-center gap-2 mb-2">
                                <Snowflake className="w-5 h-5" />
                                <span className="font-medium text-sm">Refrigerado</span>
                            </div>
                            <p className="text-lg font-bold">Cadeia Fria</p>
                            <p className="text-xs opacity-70 mt-1">Temperatura controlada</p>
                        </div>
                    )}
                </div>

                {/* Temperature Graph (simplified) */}
                {requiresRefrigeration && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-3">Histórico de temperatura (últimas 6h)</p>
                        <div className="flex items-end gap-1 h-16">
                            {[...Array(24)].map((_, i) => {
                                const height = 40 + Math.random() * 20
                                const isOk = height < 55
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t ${isOk ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                        style={{ height: `${height}%` }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
