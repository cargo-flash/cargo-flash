'use client'

import {
    Award,
    Star,
    TrendingUp,
    Clock,
    Truck,
    Users,
    ThumbsUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DeliveryRatingsSummaryProps {
    route?: string // e.g., "SP → RJ"
}

export function DeliveryRatingsSummary({ route }: DeliveryRatingsSummaryProps) {
    // Simulated ratings data for the route
    const routeStats = {
        averageRating: 4.8,
        totalDeliveries: 12847,
        onTimePercentage: 97.3,
        averageDeliveryTime: '2.1 dias',
        satisfactionRate: 98.2
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <CardHeader className="pb-3 border-b border-amber-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                    </div>
                    Desempenho da Rota
                    {route && (
                        <span className="ml-auto text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded-full">
                            {route}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Main Rating */}
                <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-xl">
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                            <span className="text-4xl font-bold text-amber-500">{routeStats.averageRating}</span>
                            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Avaliação média</p>
                    </div>
                    <div className="h-12 w-px bg-slate-200" />
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                            <span className="text-4xl font-bold text-emerald-500">{routeStats.onTimePercentage}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">No prazo</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                        <Truck className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
                        <p className="text-lg font-bold text-slate-800">{(routeStats.totalDeliveries / 1000).toFixed(1)}k</p>
                        <p className="text-[10px] text-slate-500">Entregas</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                        <Clock className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                        <p className="text-lg font-bold text-slate-800">{routeStats.averageDeliveryTime}</p>
                        <p className="text-[10px] text-slate-500">Tempo médio</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                        <ThumbsUp className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                        <p className="text-lg font-bold text-slate-800">{routeStats.satisfactionRate}%</p>
                        <p className="text-[10px] text-slate-500">Satisfação</p>
                    </div>
                </div>

                {/* Star Breakdown */}
                <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Distribuição de Avaliações</p>
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : 2
                        return (
                            <div key={stars} className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-500 w-3">{stars}</span>
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-8">{percentage}%</span>
                            </div>
                        )
                    })}
                </div>

                {/* Trust Message */}
                <div className="flex items-center justify-center gap-2 text-xs text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Top 5% rotas mais bem avaliadas</span>
                </div>
            </CardContent>
        </Card>
    )
}
