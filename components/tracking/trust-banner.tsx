'use client'

import {
    Shield,
    CheckCircle2,
    Clock,
    Star,
    Users,
    Zap,
    Award,
    TrendingUp,
    Lock
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface TrustBannerProps {
    trackingCode: string
}

export function TrustBanner({ trackingCode }: TrustBannerProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedValues, setAnimatedValues] = useState({
        deliveries: 0,
        rating: 0,
        onTime: 0,
        satisfaction: 0
    })

    useEffect(() => {
        setMounted(true)

        const targets = { deliveries: 1247893, rating: 4.9, onTime: 98.7, satisfaction: 99.2 }
        const duration = 2000
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            setAnimatedValues({
                deliveries: Math.floor(targets.deliveries * eased),
                rating: Math.round(targets.rating * eased * 10) / 10,
                onTime: Math.round(targets.onTime * eased * 10) / 10,
                satisfaction: Math.round(targets.satisfaction * eased * 10) / 10
            })

            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [])

    const stats = [
        {
            icon: Users,
            value: animatedValues.deliveries.toLocaleString('pt-BR'),
            suffix: '+',
            label: 'Entregas realizadas',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Star,
            value: animatedValues.rating.toFixed(1),
            suffix: '★',
            label: 'Avaliação média',
            color: 'from-amber-400 to-orange-500'
        },
        {
            icon: Clock,
            value: animatedValues.onTime.toFixed(1),
            suffix: '%',
            label: 'Entregas no prazo',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            icon: TrendingUp,
            value: animatedValues.satisfaction.toFixed(1),
            suffix: '%',
            label: 'Clientes satisfeitos',
            color: 'from-purple-400 to-pink-500'
        }
    ]

    const trustBadges = [
        { icon: Shield, label: 'Proteção Total' },
        { icon: Lock, label: 'Dados Seguros' },
        { icon: Award, label: 'Selo de Qualidade' }
    ]

    return (
        <div className={`
            relative overflow-hidden rounded-3xl 
            bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900
            shadow-2xl
            ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}
        `}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Glowing orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Floating particles */}
                {mounted && [...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30 animate-float-up"
                        style={{
                            left: `${Math.random() * 100}%`,
                            bottom: '-10px',
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="w-4 h-4 text-amber-900" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            Por que confiar na Cargo Flash?
                            <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
                        </h3>
                        <p className="text-slate-400">Números que comprovam nossa excelência</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className="relative group bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all hover:scale-105 hover:-translate-y-1"
                            >
                                {/* Glow on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />

                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-3xl font-black text-white">
                                    {stat.value}
                                    <span className="text-lg text-white/60">{stat.suffix}</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
                    {trustBadges.map((badge, index) => {
                        const Icon = badge.icon
                        return (
                            <div key={index} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{badge.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes float-up {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up linear infinite;
                }
            `}</style>
        </div>
    )
}
