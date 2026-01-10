'use client'

import {
    Package,
    Truck,
    MapPin,
    CheckCircle2,
    Clock,
    AlertCircle,
    RotateCcw,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatusCardPremiumProps {
    status: string
    lastUpdate: string
}

const statusConfig: Record<string, {
    title: string
    description: string
    icon: typeof Package
    gradient: string
    glowColor: string
    pulseColor: string
    animation: string
}> = {
    pending: {
        title: 'Aguardando Coleta',
        description: 'O remetente está preparando sua encomenda',
        icon: Clock,
        gradient: 'from-slate-500 to-slate-700',
        glowColor: 'bg-slate-400/30',
        pulseColor: 'bg-slate-400',
        animation: 'animate-pulse'
    },
    collected: {
        title: 'Coletado',
        description: 'Sua encomenda foi retirada e está a caminho',
        icon: Package,
        gradient: 'from-blue-500 to-indigo-600',
        glowColor: 'bg-blue-400/30',
        pulseColor: 'bg-blue-400',
        animation: 'animate-bounce'
    },
    in_transit: {
        title: 'Em Trânsito',
        description: 'Viajando com segurança até você',
        icon: Truck,
        gradient: 'from-indigo-500 to-purple-600',
        glowColor: 'bg-indigo-400/30',
        pulseColor: 'bg-indigo-400',
        animation: 'animate-pulse'
    },
    out_for_delivery: {
        title: 'Saiu para Entrega!',
        description: 'O motorista está a caminho do seu endereço',
        icon: MapPin,
        gradient: 'from-purple-500 to-pink-600',
        glowColor: 'bg-purple-400/30',
        pulseColor: 'bg-purple-400',
        animation: 'animate-bounce'
    },
    delivered: {
        title: 'Entregue',
        description: 'Sua encomenda foi entregue com sucesso!',
        icon: CheckCircle2,
        gradient: 'from-emerald-500 to-teal-600',
        glowColor: 'bg-emerald-400/30',
        pulseColor: 'bg-emerald-400',
        animation: ''
    },
    failed: {
        title: 'Tentativa Falhou',
        description: 'Não foi possível entregar, mas vamos tentar novamente',
        icon: AlertCircle,
        gradient: 'from-amber-500 to-orange-600',
        glowColor: 'bg-amber-400/30',
        pulseColor: 'bg-amber-400',
        animation: 'animate-pulse'
    },
    returned: {
        title: 'Devolvido',
        description: 'A encomenda retornou ao remetente',
        icon: RotateCcw,
        gradient: 'from-red-500 to-rose-600',
        glowColor: 'bg-red-400/30',
        pulseColor: 'bg-red-400',
        animation: ''
    }
}

export function StatusCardPremium({ status, lastUpdate }: StatusCardPremiumProps) {
    const [mounted, setMounted] = useState(false)
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    useEffect(() => {
        setMounted(true)
    }, [])

    const formatTime = (date: string) => {
        const d = new Date(date)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 1) return 'Agora mesmo'
        if (diffMins < 60) return `${diffMins} min atrás`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`
        return d.toLocaleDateString('pt-BR')
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl ${mounted ? 'animate-in fade-in zoom-in duration-500' : 'opacity-0'
            }`}>
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

            {/* Animated Glow */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${config.glowColor} ${config.animation}`} />
            <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl ${config.glowColor} ${config.animation}`} style={{ animationDelay: '1s' }} />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Icon Container */}
                    <div className="relative">
                        <div className={`w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 ${config.animation}`}>
                            <Icon className="w-12 h-12 text-white" />
                        </div>
                        {/* Live indicator */}
                        <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${config.pulseColor} flex items-center justify-center`}>
                            <span className={`absolute inset-0 rounded-full ${config.pulseColor} animate-ping opacity-75`} />
                            <Zap className="w-3 h-3 text-white relative z-10" />
                        </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl md:text-4xl font-black text-white">
                                {config.title}
                            </h2>
                        </div>
                        <p className="text-white/80 text-lg mb-4">
                            {config.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>Atualizado: {formatTime(lastUpdate)}</span>
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                Sistema ativo
                            </span>
                        </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="hidden lg:block">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="8"
                                    strokeDasharray={`${getProgressPercentage(status) * 3.14} 314`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {getProgressPercentage(status)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 40" className="w-full h-auto fill-white/5">
                    <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1350,30 1440,20 L1440,40 L0,40 Z" />
                </svg>
            </div>
        </div>
    )
}

function getProgressPercentage(status: string): number {
    const statusOrder = ['pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered']
    const index = statusOrder.indexOf(status)
    if (index === -1) return 0
    return Math.round(((index + 1) / statusOrder.length) * 100)
}
