'use client'

import {
    Shield,
    CheckCircle2,
    Clock,
    RefreshCw,
    Truck,
    FileText,
    Info
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryGuaranteeBadgeProps {
    status: string
    estimatedDelivery?: string | null
}

export function DeliveryGuaranteeBadge({ status, estimatedDelivery }: DeliveryGuaranteeBadgeProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDelivered = status === 'delivered'
    const isFailed = status === 'failed'

    // Calculate if on time
    const isOnTime = () => {
        if (!estimatedDelivery) return true
        if (isDelivered) return new Date() <= new Date(estimatedDelivery)
        return true
    }

    const onTime = isOnTime()

    const guarantees = [
        {
            icon: Shield,
            title: 'Seguro de Carga',
            description: 'Cobertura conforme termos do contrato',
            color: 'text-slate-600 bg-slate-50'
        },
        {
            icon: Clock,
            title: 'Prazo Estimado',
            description: onTime ? 'Dentro da janela prevista' : 'Atualização em andamento',
            color: onTime ? 'text-slate-600 bg-slate-50' : 'text-amber-600 bg-amber-50'
        },
        {
            icon: RefreshCw,
            title: 'Múltiplas Tentativas',
            description: 'Até 3 tentativas de entrega',
            color: 'text-slate-600 bg-slate-50'
        },
        {
            icon: Truck,
            title: 'Rastreio Disponível',
            description: 'Atualizações durante o trajeto',
            color: 'text-slate-600 bg-slate-50'
        }
    ]

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-slate-800 p-5">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Informações do Serviço</h3>
                            <p className="text-slate-300 text-sm">Condições aplicáveis à sua entrega</p>
                        </div>
                    </div>
                    <button
                        className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-white/80 hover:bg-white/20 transition-colors"
                        title="Ver termos completos"
                    >
                        <Info className="w-4 h-4" />
                        <span className="text-sm">Termos</span>
                    </button>
                </div>
            </div>

            {/* Guarantees Grid */}
            <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {guarantees.map((guarantee, index) => {
                        const Icon = guarantee.icon
                        return (
                            <div
                                key={index}
                                className={`
                                    p-3 rounded-xl text-center border border-slate-100
                                    ${guarantee.color}
                                `}
                            >
                                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                    <Icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <h4 className="font-semibold text-sm mb-1 text-slate-800">{guarantee.title}</h4>
                                <p className="text-xs text-slate-500">{guarantee.description}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Footer - Link to terms */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Condições sujeitas aos <a href="/termos" className="text-slate-600 hover:underline">termos de serviço</a>.
                        Consulte a política de seguro para coberturas específicas.
                    </p>
                </div>
            </div>
        </div>
    )
}
