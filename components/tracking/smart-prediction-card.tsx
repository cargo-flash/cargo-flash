'use client'

import {
    Brain,
    TrendingUp,
    Clock,
    Calendar,
    Sparkles,
    Target,
    Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface SmartPredictionCardProps {
    status: string
    estimatedDelivery?: string | null
    createdAt: string
    originState?: string
    destinationState?: string
}

interface Prediction {
    deliveryDate: Date
    confidence: number
    factors: { label: string; impact: 'positive' | 'negative' | 'neutral' }[]
    timeWindow: { start: string; end: string }
    probability: number
}

function generatePrediction(status: string, estimated: string | null, created: string): Prediction {
    const now = new Date()

    // Base prediction on estimated or calculate
    let deliveryDate: Date
    if (estimated) {
        deliveryDate = new Date(estimated)
    } else {
        const createdDate = new Date(created)
        deliveryDate = new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000) // +5 days
    }

    // Adjust based on status
    let confidence = 75
    let probability = 85
    const factors: Prediction['factors'] = []

    switch (status) {
        case 'out_for_delivery':
            confidence = 95
            probability = 98
            deliveryDate = now // Today
            factors.push({ label: 'Veículo a caminho', impact: 'positive' })
            factors.push({ label: 'Rota otimizada', impact: 'positive' })
            break
        case 'in_transit':
            confidence = 80
            probability = 88
            factors.push({ label: 'Trânsito normal', impact: 'positive' })
            factors.push({ label: 'Centro de distribuição próximo', impact: 'positive' })
            break
        case 'collected':
            confidence = 70
            probability = 82
            factors.push({ label: 'Coletado no prazo', impact: 'positive' })
            break
        default:
            factors.push({ label: 'Aguardando processamento', impact: 'neutral' })
    }

    // Time window
    const timeWindow = status === 'out_for_delivery'
        ? { start: '09:00', end: '14:00' }
        : { start: '08:00', end: '18:00' }

    return { deliveryDate, confidence, factors, timeWindow, probability }
}

export function SmartPredictionCard({ status, estimatedDelivery, createdAt, originState, destinationState }: SmartPredictionCardProps) {
    const [prediction, setPrediction] = useState<Prediction | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(true)

    useEffect(() => {
        // Simulate AI analysis
        setIsAnalyzing(true)
        const timer = setTimeout(() => {
            setPrediction(generatePrediction(status, estimatedDelivery ?? null, createdAt))
            setIsAnalyzing(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [status, estimatedDelivery, createdAt])

    // Don't show for delivered
    if (status === 'delivered') {
        return null
    }

    return (
        <Card className="border border-violet-200 shadow-lg bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 overflow-hidden">
            <CardHeader className="pb-3 border-b border-violet-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    Previsão Inteligente
                    <Sparkles className="w-4 h-4 text-violet-400 ml-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center animate-pulse">
                            <Brain className="w-6 h-6 text-violet-500" />
                        </div>
                        <p className="text-sm text-violet-600 mt-3">Analisando padrões de entrega...</p>
                        <div className="flex items-center gap-1 mt-2">
                            {[...Array(3)].map((_, i) => (
                                <span
                                    key={i}
                                    className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : prediction ? (
                    <>
                        {/* Main Prediction */}
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-violet-500" />
                                <span className="text-xs text-violet-600 uppercase tracking-wider font-medium">
                                    Previsão de IA
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-violet-700">
                                {prediction.deliveryDate.toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </p>

                            <div className="flex items-center justify-center gap-3 mt-3">
                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{prediction.timeWindow.start} - {prediction.timeWindow.end}</span>
                                </div>
                            </div>
                        </div>

                        {/* Confidence Meter */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600">Confiança da Previsão</span>
                                <span className="text-lg font-bold text-violet-600">{prediction.confidence}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${prediction.confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Factors */}
                        <div className="space-y-2">
                            <p className="text-xs text-violet-600 uppercase tracking-wider font-medium">
                                Fatores Analisados
                            </p>
                            {prediction.factors.map((factor, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${factor.impact === 'positive'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : factor.impact === 'negative'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    {factor.impact === 'positive' ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <Zap className="w-4 h-4" />
                                    )}
                                    <span className="text-sm">{factor.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Probability Badge */}
                        <div className="text-center pt-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                                <Sparkles className="w-3 h-3" />
                                {prediction.probability}% probabilidade de entrega no prazo
                            </span>
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
