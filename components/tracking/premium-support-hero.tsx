'use client'

import {
    Headphones,
    MessageCircle,
    Phone,
    Mail,
    Clock,
    ChevronRight,
    Bot,
    Users,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PremiumSupportHeroProps {
    trackingCode: string
    status: string
}

export function PremiumSupportHero({ trackingCode, status }: PremiumSupportHeroProps) {
    const [mounted, setMounted] = useState(false)
    const [onlineAgents, setOnlineAgents] = useState(5)

    useEffect(() => {
        setMounted(true)
        // Simulate agent count changes
        const interval = setInterval(() => {
            setOnlineAgents(prev => Math.max(3, Math.min(8, prev + Math.floor(Math.random() * 3) - 1)))
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    const supportOptions = [
        {
            icon: MessageCircle,
            title: 'Chat ao Vivo',
            description: 'Resposta em ~2 min',
            action: 'Iniciar Chat',
            color: 'from-blue-500 to-indigo-600',
            available: true
        },
        {
            icon: Phone,
            title: 'Ligar Agora',
            description: '0800 123 4567',
            action: 'Ligação Gratuita',
            color: 'from-emerald-500 to-teal-600',
            available: true
        },
        {
            icon: Mail,
            title: 'E-mail',
            description: 'Resposta em 24h',
            action: 'Enviar E-mail',
            color: 'from-purple-500 to-pink-600',
            available: true
        },
        {
            icon: Bot,
            title: 'Assistente IA',
            description: 'Disponível 24/7',
            action: 'Conversar',
            color: 'from-amber-500 to-orange-600',
            available: true
        }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 shadow-2xl ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                }} />
            </div>

            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Headphones className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Suporte Premium</h3>
                            <p className="text-indigo-200">Estamos aqui para ajudar</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-emerald-500/20 px-4 py-2 rounded-full">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-slate-900 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-slate-600" />
                                </div>
                            ))}
                        </div>
                        <span className="text-emerald-300 text-sm font-medium">
                            {onlineAgents} agentes online
                        </span>
                    </div>
                </div>

                {/* Support Options Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {supportOptions.map((option, index) => {
                        const Icon = option.icon
                        return (
                            <button
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all hover:scale-105 text-left"
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <Icon className="w-7 h-7 text-indigo-300 mb-4" />
                                <h4 className="font-bold text-white mb-1">{option.title}</h4>
                                <p className="text-sm text-slate-400 mb-4">{option.description}</p>
                                <span className="inline-flex items-center gap-1 text-sm text-indigo-300 font-medium group-hover:text-indigo-200 transition-colors">
                                    {option.action}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Quick Info */}
                <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Suporte 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Tempo médio: 3 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Código: {trackingCode.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
