'use client'

import {
    Trophy,
    Medal,
    Star,
    Zap,
    Heart,
    Crown,
    TrendingUp,
    Award
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface CustomerRewardsProps {
    customerEmail?: string | null
    deliveriesCount?: number
}

export function CustomerRewards({ customerEmail, deliveriesCount = 5 }: CustomerRewardsProps) {
    const [mounted, setMounted] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const rewards = [
        {
            icon: Medal,
            title: 'Primeira Entrega',
            description: 'Bem-vindo à Cargo Flash!',
            achieved: deliveriesCount >= 1,
            color: 'text-amber-500 bg-amber-50'
        },
        {
            icon: Star,
            title: 'Cliente Frequente',
            description: '5 entregas realizadas',
            achieved: deliveriesCount >= 5,
            color: 'text-blue-500 bg-blue-50'
        },
        {
            icon: Trophy,
            title: 'VIP',
            description: '10 entregas realizadas',
            achieved: deliveriesCount >= 10,
            color: 'text-purple-500 bg-purple-50'
        },
        {
            icon: Crown,
            title: 'Lenda',
            description: '50+ entregas realizadas',
            achieved: deliveriesCount >= 50,
            color: 'text-amber-600 bg-amber-100'
        }
    ]

    const achievedCount = rewards.filter(r => r.achieved).length

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Suas Conquistas</h3>
                            <p className="text-white/80">{achievedCount} de {rewards.length} desbloqueados</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white">{deliveriesCount}</div>
                        <p className="text-xs text-white/70">entregas</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-1000"
                            style={{ width: `${(achievedCount / rewards.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Rewards Grid */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    {rewards.map((reward, index) => {
                        const Icon = reward.icon
                        return (
                            <div
                                key={index}
                                className={`
                                    relative p-4 rounded-2xl text-center transition-all duration-300
                                    ${reward.achieved
                                        ? `${reward.color} hover:scale-105`
                                        : 'bg-slate-50 opacity-50 grayscale'
                                    }
                                `}
                            >
                                <div className={`
                                    w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                                    ${reward.achieved ? 'bg-white shadow-sm' : 'bg-slate-100'}
                                `}>
                                    <Icon className={`w-6 h-6 ${reward.achieved ? '' : 'text-slate-400'}`} />
                                </div>
                                <h4 className="font-bold text-sm mb-1">{reward.title}</h4>
                                <p className="text-xs opacity-70">{reward.description}</p>

                                {reward.achieved && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-white" />
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Next Reward */}
                {achievedCount < rewards.length && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">Próxima conquista</p>
                                <p className="text-xs text-slate-500">
                                    Faltam {rewards.find(r => !r.achieved)?.description || 'mais entregas'}
                                </p>
                            </div>
                            <Award className="w-6 h-6 text-amber-400" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
