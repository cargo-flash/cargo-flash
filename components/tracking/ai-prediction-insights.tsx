'use client'

import {
    Bot,
    Sparkles,
    Clock,
    TrendingUp,
    Target,
    Brain,
    Lightbulb
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface AIPredictionInsightsProps {
    status: string
    estimatedDelivery?: string | null
    distanceKm?: number
}

export function AIPredictionInsights({
    status,
    estimatedDelivery,
    distanceKm = 450
}: AIPredictionInsightsProps) {
    const [mounted, setMounted] = useState(false)
    const [isThinking, setIsThinking] = useState(true)
    const [accuracy, setAccuracy] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Simulate AI thinking
        setTimeout(() => {
            setIsThinking(false)
            // Animate accuracy
            let current = 0
            const target = 94 + Math.random() * 5
            const timer = setInterval(() => {
                current += 2
                if (current >= target) {
                    setAccuracy(target)
                    clearInterval(timer)
                } else {
                    setAccuracy(current)
                }
            }, 30)
        }, 2000)
    }, [])

    const insights = [
        {
            icon: Clock,
            title: 'Tempo Estimado',
            value: estimatedDelivery
                ? new Date(estimatedDelivery).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })
                : '2-3 dias',
            confidence: '98%'
        },
        {
            icon: Target,
            title: 'Precisão da Rota',
            value: `${distanceKm} km`,
            confidence: '96%'
        },
        {
            icon: TrendingUp,
            title: 'Tendência',
            value: 'Adiantado',
            confidence: '87%'
        }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 shadow-2xl ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />

                {/* Glowing orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            {isThinking && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                Previsões IA
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            </h3>
                            <p className="text-slate-400">Análise preditiva inteligente</p>
                        </div>
                    </div>

                    {/* Accuracy Meter */}
                    <div className="text-right">
                        <p className="text-3xl font-black text-white">
                            {accuracy.toFixed(1)}%
                        </p>
                        <p className="text-xs text-indigo-300">Precisão do modelo</p>
                    </div>
                </div>

                {/* AI Thinking Animation */}
                {isThinking && (
                    <div className="flex items-center justify-center gap-4 py-12">
                        <div className="flex items-center gap-2">
                            <Bot className="w-8 h-8 text-indigo-400 animate-bounce" />
                            <span className="text-indigo-300">Analisando dados...</span>
                        </div>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Insights Grid */}
                {!isThinking && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {insights.map((insight, index) => {
                            const Icon = insight.icon
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 animate-in fade-in zoom-in duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Icon className="w-6 h-6 text-indigo-400 mb-3" />
                                    <p className="text-white font-bold text-xl mb-1">{insight.value}</p>
                                    <p className="text-xs text-slate-400">{insight.title}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                style={{ width: insight.confidence }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500">{insight.confidence}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* AI Tip */}
                {!isThinking && (
                    <div className="flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-300">
                                <span className="text-indigo-300 font-medium">Dica da IA:</span> Com base no histórico desta rota,
                                68% das entregas chegam antes do prazo. Você pode esperar sua encomenda
                                {estimatedDelivery ? ' até ' + new Date(estimatedDelivery).toLocaleDateString('pt-BR') : ' em breve'}!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
