'use client'

import {
    Shield,
    CheckCircle2,
    FileText,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface InsuranceInfoCardProps {
    trackingCode: string
    declaredValue?: number | null
    hasInsurance?: boolean
    status: string
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function InsuranceInfoCard({ trackingCode, declaredValue, hasInsurance = true, status }: InsuranceInfoCardProps) {
    const coverageAmount = declaredValue || 1000 // Default coverage

    // Show for all statuses except delivered
    if (status === 'delivered') {
        return (
            <div className="premium-card overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-emerald-800 text-lg">Entrega concluída com segurança</p>
                            <p className="text-sm text-emerald-600 mt-0.5">Sua encomenda foi entregue sem incidentes</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="premium-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">Seguro de Transporte</h3>
                </div>
                <Badge
                    className={`font-semibold ${hasInsurance
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                    variant="outline"
                >
                    {hasInsurance ? (
                        <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ativo
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Não contratado
                        </>
                    )}
                </Badge>
            </div>

            <div className="p-5 space-y-5">
                {hasInsurance ? (
                    <>
                        {/* Coverage Details */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-blue-700 font-medium">Valor Coberto</span>
                                <span className="text-2xl font-bold text-blue-800">
                                    {formatCurrency(coverageAmount)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Cobertura total contra danos, extravio e roubo</span>
                            </div>
                        </div>

                        {/* Coverage Items */}
                        <div className="space-y-3">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                Coberturas Incluídas
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    'Danos físicos',
                                    'Extravio',
                                    'Roubo/Furto',
                                    'Avarias',
                                    'Acidentes',
                                    'Sinistros'
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Policy */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Ver apólice completa
                        </Button>
                    </>
                ) : (
                    <>
                        {/* No Insurance Warning */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-800">Sem cobertura de seguro</p>
                                    <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                                        Esta encomenda não possui seguro contratado. Em caso de sinistro, a cobertura será limitada.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Coverage */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-sm text-slate-700 mb-3 font-medium">
                                Para futuras encomendas, considere contratar o seguro:
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">A partir de</span>
                                <span className="text-xl font-bold text-blue-600">
                                    0,5% do valor
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* Reference */}
                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400 font-medium">
                        Código: <span className="font-mono font-semibold">{trackingCode.toUpperCase()}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
