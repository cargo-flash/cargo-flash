'use client'

import {
    TrendingUp,
    Users,
    Package,
    Clock,
    CheckCircle2,
    Globe,
    Star,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface AnimatedStatsDisplayProps {
    variant?: 'hero' | 'compact' | 'detailed'
}

export function AnimatedStatsDisplay({ variant = 'hero' }: AnimatedStatsDisplayProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedValues, setAnimatedValues] = useState({
        deliveries: 0,
        cities: 0,
        rating: 0,
        onTime: 0
    })

    const targetValues = {
        deliveries: 1247893,
        cities: 5400,
        rating: 4.9,
        onTime: 98.7
    }

    useEffect(() => {
        setMounted(true)

        const duration = 2000
        const steps = 60
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3)

            setAnimatedValues({
                deliveries: Math.floor(targetValues.deliveries * eased),
                cities: Math.floor(targetValues.cities * eased),
                rating: Math.round(targetValues.rating * eased * 10) / 10,
                onTime: Math.round(targetValues.onTime * eased * 10) / 10
            })

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [])

    const stats = [
        {
            icon: Package,
            value: animatedValues.deliveries.toLocaleString('pt-BR'),
            label: 'Entregas realizadas',
            suffix: '+',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Globe,
            value: animatedValues.cities.toLocaleString('pt-BR'),
            label: 'Cidades atendidas',
            suffix: '+',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            icon: Star,
            value: animatedValues.rating.toFixed(1),
            label: 'Avaliação média',
            suffix: '★',
            color: 'from-amber-500 to-orange-600'
        },
        {
            icon: CheckCircle2,
            value: animatedValues.onTime.toFixed(1),
            label: 'Entregas no prazo',
            suffix: '%',
            color: 'from-purple-500 to-pink-600'
        }
    ]

    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-6 ${mounted ? 'animate-in fade-in duration-500' : 'opacity-0'}`}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="font-bold text-slate-800">{stat.value}{stat.suffix}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 shadow-2xl ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-4">
                        <Zap className="w-4 h-4" />
                        Estatísticas em tempo real
                    </div>
                    <h3 className="text-3xl font-black text-white">
                        Números que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">impressionam</span>
                    </h3>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className="relative group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                            >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                <Icon className="w-6 h-6 text-white/50 mb-4" />
                                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                    {stat.value}
                                    <span className="text-lg text-white/50">{stat.suffix}</span>
                                </div>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Live Indicator */}
                <div className="flex items-center justify-center gap-2 mt-8 text-slate-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Atualizando em tempo real
                </div>
            </div>
        </div>
    )
}
