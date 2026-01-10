'use client'

import {
    Cloud,
    Sun,
    CloudRain,
    CloudSnow,
    Wind,
    Thermometer,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface WeatherImpactCardProps {
    destinationCity: string
    status: string
}

interface WeatherData {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'
    temperature: number
    humidity: number
    windSpeed: number
    hasImpact: boolean
    impactMessage: string | null
}

const weatherConfig: Record<string, { icon: typeof Sun; color: string; label: string }> = {
    sunny: { icon: Sun, color: 'text-amber-500 bg-amber-50', label: 'Ensolarado' },
    cloudy: { icon: Cloud, color: 'text-slate-500 bg-slate-50', label: 'Nublado' },
    rainy: { icon: CloudRain, color: 'text-blue-500 bg-blue-50', label: 'Chuvoso' },
    stormy: { icon: CloudRain, color: 'text-indigo-500 bg-indigo-50', label: 'Tempestade' },
    snowy: { icon: CloudSnow, color: 'text-sky-500 bg-sky-50', label: 'Neve' }
}

function simulateWeather(): WeatherData {
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy']
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    const temperature = Math.floor(Math.random() * 20) + 15 // 15-35°C
    const humidity = Math.floor(Math.random() * 40) + 40 // 40-80%
    const windSpeed = Math.floor(Math.random() * 30) + 5 // 5-35 km/h

    let hasImpact = false
    let impactMessage: string | null = null

    if (condition === 'stormy') {
        hasImpact = true
        impactMessage = 'Possível atraso devido a condições climáticas severas'
    } else if (condition === 'rainy' && windSpeed > 25) {
        hasImpact = true
        impactMessage = 'Chuva forte pode causar lentidão na entrega'
    }

    return { condition, temperature, humidity, windSpeed, hasImpact, impactMessage }
}

export function WeatherImpactCard({ destinationCity, status }: WeatherImpactCardProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null)

    useEffect(() => {
        // Simulate weather data
        setWeather(simulateWeather())
    }, [destinationCity])

    // Only show for active deliveries
    if (['delivered', 'returned'].includes(status) || !weather) {
        return null
    }

    const config = weatherConfig[weather.condition]
    const WeatherIcon = config.icon

    return (
        <Card className={`border shadow-lg overflow-hidden ${weather.hasImpact ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
                            <WeatherIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">Clima em {destinationCity}</p>
                            <p className="text-xs text-slate-500">{config.label}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{weather.temperature}°C</p>
                    </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <Thermometer className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                        <p className="text-xs text-slate-600">{weather.temperature}°C</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <CloudRain className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                        <p className="text-xs text-slate-600">{weather.humidity}%</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <Wind className="w-4 h-4 mx-auto text-slate-500 mb-1" />
                        <p className="text-xs text-slate-600">{weather.windSpeed} km/h</p>
                    </div>
                </div>

                {/* Impact Alert */}
                {weather.hasImpact ? (
                    <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{weather.impactMessage}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs text-emerald-700">Condições favoráveis para entrega</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
