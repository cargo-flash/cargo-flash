'use client'

import {
    Shield,
    Clock,
    Truck,
    CheckCircle2,
    Info,
    TrendingUp
} from 'lucide-react'

interface ConfidenceMetersProps {
    status: string
}

// Métricas apresentadas de forma qualitativa
const meterConfig: Record<string, {
    security: { level: string; label: string };
    punctuality: { level: string; label: string };
    tracking: { level: string; label: string };
    overall: { level: string; label: string };
}> = {
    pending: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Excelente', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Ótimo', label: 'Satisfação geral' }
    },
    collected: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Excelente', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Ótimo', label: 'Satisfação geral' }
    },
    in_transit: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Excelente', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Ótimo', label: 'Satisfação geral' }
    },
    out_for_delivery: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Excelente', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Ótimo', label: 'Satisfação geral' }
    },
    delivered: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Excelente', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Ótimo', label: 'Satisfação geral' }
    },
    failed: {
        security: { level: 'Alto', label: 'Índice de segurança' },
        punctuality: { level: 'Bom', label: 'Histórico de entregas' },
        tracking: { level: 'Total', label: 'Cobertura de rastreio' },
        overall: { level: 'Bom', label: 'Satisfação geral' }
    }
}

const iconColors = {
    security: {
        bg: 'from-emerald-500 to-emerald-600',
        light: 'bg-emerald-50',
        text: 'text-emerald-600'
    },
    punctuality: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-600'
    },
    tracking: {
        bg: 'from-violet-500 to-violet-600',
        light: 'bg-violet-50',
        text: 'text-violet-600'
    },
    overall: {
        bg: 'from-cyan-500 to-cyan-600',
        light: 'bg-cyan-50',
        text: 'text-cyan-600'
    }
}

export function ConfidenceMeters({ status }: ConfidenceMetersProps) {
    const values = meterConfig[status] || meterConfig.pending

    const metrics = [
        { key: 'security', ...values.security, icon: Shield, colors: iconColors.security },
        { key: 'punctuality', ...values.punctuality, icon: Clock, colors: iconColors.punctuality },
        { key: 'tracking', ...values.tracking, icon: Truck, colors: iconColors.tracking },
        { key: 'overall', ...values.overall, icon: CheckCircle2, colors: iconColors.overall }
    ]

    return (
        <div className="premium-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Indicadores da Rota</h3>
                        <p className="text-xs text-slate-500">Avaliação da transportadora</p>
                    </div>
                </div>
                <button
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Indicadores baseados no histórico de entregas"
                >
                    <Info className="w-4 h-4" />
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon
                    return (
                        <div
                            key={metric.key}
                            className={`relative p-4 rounded-xl ${metric.colors.light} border border-slate-100/50 
                                transition-all duration-500 hover:shadow-md hover:-translate-y-0.5`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon and Level */}
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.colors.bg} flex items-center justify-center shadow-sm`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className={`text-lg font-bold ${metric.colors.text}`}>
                                    {metric.level}
                                </span>
                            </div>

                            {/* Label */}
                            <p className="text-xs text-slate-600 text-center font-medium leading-tight">
                                {metric.label}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Footer - Source Context */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <p>
                        Indicadores calculados com base em entregas similares.
                    </p>
                </div>
            </div>
        </div>
    )
}
