'use client'

import {
    BarChart3,
    TrendingUp,
    Clock,
    Package,
    Info
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CompanyStatsProps {
    compact?: boolean
}

// Métricas com linguagem neutra e fonte contextualizada
const stats = [
    {
        label: 'Entregas processadas',
        value: 'Milhares',
        sublabel: 'nos últimos 12 meses',
        icon: Package,
        color: 'text-slate-600 bg-slate-50'
    },
    {
        label: 'Taxa de conclusão',
        value: '~96%',
        sublabel: 'média última temporada',
        icon: TrendingUp,
        color: 'text-slate-600 bg-slate-50'
    },
    {
        label: 'Prazo médio',
        value: '12-18',
        sublabel: 'dias úteis',
        icon: Clock,
        color: 'text-slate-600 bg-slate-50'
    }
]

export function CompanyStats({ compact = false }: CompanyStatsProps) {
    if (compact) {
        return (
            <div className="flex items-center justify-center gap-6 py-3 text-xs text-slate-500">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{stat.value}</span>
                        <span>{stat.sublabel}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Card className="border border-slate-200/80 bg-white">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                        Dados Operacionais
                    </p>
                    <button
                        className="ml-auto text-slate-400 hover:text-slate-600"
                        title="Valores aproximados baseados em operações recentes"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                            >
                                <div className={`w-10 h-10 mx-auto rounded-full ${stat.color} flex items-center justify-center mb-2`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{stat.sublabel}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Source disclaimer */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Valores aproximados. Resultados individuais podem variar conforme a rota.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
