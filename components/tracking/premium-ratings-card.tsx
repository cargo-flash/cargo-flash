'use client'

import {
    Star,
    Users,
    Award,
    ThumbsUp,
    MessageSquare,
    CheckCircle2
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PremiumRatingsCardProps {
    routeInfo?: string
    averageRating?: number
    totalReviews?: number
}

export function PremiumRatingsCard({
    routeInfo = 'SP → RJ',
    averageRating = 4.8,
    totalReviews = 12547
}: PremiumRatingsCardProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedRating, setAnimatedRating] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Animate rating number
        const duration = 1500
        const steps = 60
        const increment = averageRating / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= averageRating) {
                setAnimatedRating(averageRating)
                clearInterval(timer)
            } else {
                setAnimatedRating(current)
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [averageRating])

    const ratingBreakdown = [
        { stars: 5, percentage: 78 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 }
    ]

    const highlights = [
        { icon: ThumbsUp, label: 'Pontualidade', value: '98%' },
        { icon: Award, label: 'Satisfação', value: '96%' },
        { icon: MessageSquare, label: 'Respostas', value: '< 2h' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header - Corporate Blue */}
            <div className="relative bg-[#1e3a5f] p-5">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Avalie sua Entrega</h3>
                            <p className="text-white/80 text-sm">{routeInfo}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                            <Users className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">
                                {totalReviews.toLocaleString('pt-BR')} avaliações
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Display */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-6">
                    {/* Big Rating Number */}
                    <div className="text-center">
                        <div className="text-5xl font-bold text-slate-800">
                            {animatedRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(animatedRating)
                                        ? 'text-[#b45309] fill-[#b45309]'
                                        : 'text-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1 space-y-2">
                        {ratingBreakdown.map((item) => (
                            <div key={item.stars} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-3">{item.stars}</span>
                                <Star className="w-3 h-3 text-[#b45309] fill-[#b45309]" />
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#1e3a5f] rounded-full transition-all duration-1000"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-10 text-right">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="p-5">
                <div className="grid grid-cols-3 gap-3">
                    {highlights.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <Icon className="w-5 h-5 mx-auto text-[#1e3a5f] mb-2" />
                                <p className="text-lg font-bold text-slate-800">{item.value}</p>
                                <p className="text-xs text-slate-500">{item.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Excellence Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                    <span className="font-medium text-slate-700 text-sm">Rota com selo de excelência</span>
                </div>
            </div>
        </div>
    )
}
