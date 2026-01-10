'use client'

import {
    Gift,
    Star,
    TrendingUp,
    Sparkles,
    Award,
    Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LoyaltyProgramCardProps {
    customerEmail?: string | null
}

interface LoyaltyTier {
    name: string
    icon: typeof Star
    color: string
    minPoints: number
    benefits: string[]
}

const loyaltyTiers: LoyaltyTier[] = [
    {
        name: 'Bronze',
        icon: Star,
        color: 'text-amber-700 bg-amber-100',
        minPoints: 0,
        benefits: ['Rastreio prioritário', '5% desconto']
    },
    {
        name: 'Prata',
        icon: Star,
        color: 'text-slate-500 bg-slate-100',
        minPoints: 500,
        benefits: ['10% desconto', 'Suporte prioritário']
    },
    {
        name: 'Ouro',
        icon: Award,
        color: 'text-yellow-600 bg-yellow-100',
        minPoints: 1500,
        benefits: ['15% desconto', 'Frete grátis em promoções']
    },
    {
        name: 'Platinum',
        icon: Zap,
        color: 'text-purple-600 bg-purple-100',
        minPoints: 5000,
        benefits: ['20% desconto', 'Gerente exclusivo', 'Entregas VIP']
    }
]

export function LoyaltyProgramCard({ customerEmail }: LoyaltyProgramCardProps) {
    // Demo data - in real app would fetch from API
    const currentPoints = 847
    const currentTier = loyaltyTiers.find(t => currentPoints >= t.minPoints) || loyaltyTiers[0]
    const nextTier = loyaltyTiers[loyaltyTiers.indexOf(currentTier) + 1]
    const pointsToNextTier = nextTier ? nextTier.minPoints - currentPoints : 0
    const progressPercentage = nextTier
        ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
        : 100

    const TierIcon = currentTier.icon

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-gradient-to-br from-slate-50 to-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                    </div>
                    Programa de Fidelidade
                    <Sparkles className="w-4 h-4 text-amber-400 ml-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Current Tier */}
                <div className={`flex items-center gap-3 p-4 rounded-xl ${currentTier.color}`}>
                    <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
                        <TierIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg">Nível {currentTier.name}</p>
                        <p className="text-sm opacity-80">{currentPoints} pontos acumulados</p>
                    </div>
                </div>

                {/* Progress to Next Tier */}
                {nextTier && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Próximo nível: {nextTier.name}</span>
                            <span className="font-medium text-slate-700">{pointsToNextTier} pts restantes</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Benefits */}
                <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                        Seus Benefícios
                    </p>
                    <div className="space-y-1">
                        {currentTier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Earning Info */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        Ganhe 1 ponto a cada R$ 10 em entregas. Esta entrega vale <strong>10 pontos!</strong>
                    </p>
                </div>

                {/* CTA */}
                {!customerEmail && (
                    <Button variant="outline" className="w-full">
                        <Gift className="w-4 h-4 mr-2" />
                        Cadastrar para ganhar pontos
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
