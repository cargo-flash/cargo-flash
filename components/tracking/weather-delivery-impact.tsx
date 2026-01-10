'use client'

import {
    CloudRain,
    Sun,
    CloudSun,
    Wind,
    Thermometer,
    AlertTriangle,
    CheckCircle2,
    Umbrella
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface WeatherDeliveryImpactProps {
    destinationCity?: string
    estimatedDelivery?: string | null
}

interface WeatherData {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'stormy'
    temperature: number
    humidity: number
    impact: 'none' | 'low' | 'medium' | 'high'
    message: string
}

const weatherIcons = {
    sunny: Sun,
    cloudy: CloudSun,
    rainy: CloudRain,
    windy: Wind,
    stormy: Umbrella
}

const impactColors = {
    none: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    low: 'bg-blue-50 text-blue-600 border-blue-200',
    medium: 'bg-amber-50 text-amber-600 border-amber-200',
    high: 'bg-red-50 text-red-600 border-red-200'
}

export function WeatherDeliveryImpact({ destinationCity = 'São Paulo', estimatedDelivery }: WeatherDeliveryImpactProps) {
    const [mounted, setMounted] = useState(false)
    const [weather, setWeather] = useState<WeatherData>({
        condition: 'sunny',
        temperature: 28,
        humidity: 65,
        impact: 'none',
        message: 'Condições ideais para entrega'
    })

    useEffect(() => {
        setMounted(true)

        // Simulate weather conditions
        const conditions: WeatherData[] = [
            { condition: 'sunny', temperature: 28, humidity: 55, impact: 'none', message: 'Condições ideais para entrega' },
            { condition: 'cloudy', temperature: 24, humidity: 70, impact: 'low', message: 'Tempo nublado, sem impacto significativo' },
            { condition: 'rainy', temperature: 22, humidity: 85, impact: 'medium', message: 'Chuva pode causar pequenos atrasos' },
        ]
        setWeather(conditions[Math.floor(Math.random() * conditions.length)])
    }, [])

    const WeatherIcon = weatherIcons[weather.condition]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header with weather animation */}
            <div className={`relative p-6 ${weather.condition === 'sunny'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                    : weather.condition === 'rainy'
                        ? 'bg-gradient-to-r from-slate-500 to-slate-600'
                        : 'bg-gradient-to-r from-sky-400 to-blue-500'
                }`}>
                {/* Animated elements */}
                {weather.condition === 'rainy' && (
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 h-4 bg-white/30 rounded-full animate-fall"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: '1s'
                                }}
                            />
                        ))}
                    </div>
                )}

                {weather.condition === 'sunny' && (
                    <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-300/30 rounded-full blur-xl animate-pulse" />
                )}

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <WeatherIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Clima em {destinationCity}</h3>
                            <p className="text-white/80">Impacto na entrega</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-white">{weather.temperature}°</div>
                        <p className="text-xs text-white/70">Umidade: {weather.humidity}%</p>
                    </div>
                </div>
            </div>

            {/* Impact Status */}
            <div className="p-6">
                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${impactColors[weather.impact]}`}>
                    {weather.impact === 'none' ? (
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    )}
                    <div>
                        <p className="font-bold">
                            {weather.impact === 'none' && 'Sem impacto'}
                            {weather.impact === 'low' && 'Impacto baixo'}
                            {weather.impact === 'medium' && 'Impacto moderado'}
                            {weather.impact === 'high' && 'Alto impacto'}
                        </p>
                        <p className="text-sm opacity-80">{weather.message}</p>
                    </div>
                </div>

                {/* Weather forecast mini */}
                <div className="mt-4 flex gap-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => {
                        const icons = [Sun, CloudSun, CloudRain, Sun, CloudSun]
                        const Icon = icons[i]
                        return (
                            <div key={day} className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 mb-1">{day}</p>
                                <Icon className="w-5 h-5 mx-auto text-slate-600" />
                                <p className="text-xs font-bold text-slate-700 mt-1">{22 + i}°</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes fall {
                    0% { transform: translateY(-20px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100px); opacity: 0; }
                }
                .animate-fall {
                    animation: fall 1s linear infinite;
                }
            `}</style>
        </div>
    )
}
