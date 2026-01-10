'use client'

import {
    Clock,
    Package,
    Truck,
    MapPin,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Calendar,
    AlertTriangle,
    Info
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DeliveryStatus } from '@/lib/types'

interface StatusHeroProps {
    status: DeliveryStatus
    trackingCode: string
    estimatedDelivery?: string | null
    currentLocation?: string | null
    updatedAt: string
}

// Status configurations
const statusConfig: Record<DeliveryStatus, {
    icon: React.ComponentType<{ className?: string }>
    label: string
    operationalMessage: string
    friendlyMessage: string
    explanation: string
    color: {
        bg: string
        gradient: string
        text: string
        badge: string
        border: string
    }
}> = {
    pending: {
        icon: Clock,
        label: 'Aguardando Coleta',
        operationalMessage: 'Pedido registrado no sistema',
        friendlyMessage: 'Seu pedido foi recebido com sucesso',
        explanation: 'O remetente está preparando sua encomenda para envio. Em breve ela será coletada pela nossa equipe.',
        color: {
            bg: 'from-amber-50 to-orange-50',
            gradient: 'from-amber-500 to-orange-500',
            text: 'text-amber-900',
            badge: 'bg-amber-100 text-amber-800 border-amber-200',
            border: 'border-amber-200'
        }
    },
    collected: {
        icon: Package,
        label: 'Coletado',
        operationalMessage: 'Objeto coletado na origem',
        friendlyMessage: 'Sua encomenda já está conosco',
        explanation: 'Coletamos sua encomenda e ela está sendo processada em nosso centro de distribuição.',
        color: {
            bg: 'from-blue-50 to-indigo-50',
            gradient: 'from-blue-500 to-indigo-500',
            text: 'text-blue-900',
            badge: 'bg-blue-100 text-blue-800 border-blue-200',
            border: 'border-blue-200'
        }
    },
    in_transit: {
        icon: Truck,
        label: 'Em Trânsito',
        operationalMessage: 'Objeto em transferência para unidade de destino',
        friendlyMessage: 'Sua encomenda está a caminho',
        explanation: 'Seu pacote está sendo transportado para a região de destino. Você receberá atualizações conforme o trajeto.',
        color: {
            bg: 'from-indigo-50 to-purple-50',
            gradient: 'from-indigo-500 to-purple-500',
            text: 'text-indigo-900',
            badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            border: 'border-indigo-200'
        }
    },
    out_for_delivery: {
        icon: MapPin,
        label: 'Saiu para Entrega',
        operationalMessage: 'Objeto em rota de entrega',
        friendlyMessage: 'Hoje é o grande dia!',
        explanation: 'Sua encomenda saiu para entrega e deve chegar hoje. Por favor, mantenha alguém disponível para receber.',
        color: {
            bg: 'from-purple-50 to-violet-50',
            gradient: 'from-purple-500 to-violet-500',
            text: 'text-purple-900',
            badge: 'bg-purple-100 text-purple-800 border-purple-200',
            border: 'border-purple-200'
        }
    },
    delivered: {
        icon: CheckCircle2,
        label: 'Entregue',
        operationalMessage: 'Objeto entregue ao destinatário',
        friendlyMessage: 'Entrega concluída com sucesso!',
        explanation: 'Sua encomenda foi entregue. Caso tenha alguma dúvida, entre em contato com nosso suporte.',
        color: {
            bg: 'from-emerald-50 to-teal-50',
            gradient: 'from-emerald-500 to-teal-500',
            text: 'text-emerald-900',
            badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            border: 'border-emerald-200'
        }
    },
    failed: {
        icon: XCircle,
        label: 'Falha na Entrega',
        operationalMessage: 'Tentativa de entrega não concluída',
        friendlyMessage: 'Não conseguimos entregar',
        explanation: 'Houve um problema na entrega. Uma nova tentativa será realizada ou você pode reagendar.',
        color: {
            bg: 'from-red-50 to-rose-50',
            gradient: 'from-red-500 to-rose-500',
            text: 'text-red-900',
            badge: 'bg-red-100 text-red-800 border-red-200',
            border: 'border-red-200'
        }
    },
    returned: {
        icon: RotateCcw,
        label: 'Em Devolução',
        operationalMessage: 'Objeto em processo de devolução',
        friendlyMessage: 'Sua encomenda está retornando',
        explanation: 'Não foi possível concluir a entrega. O pacote está sendo devolvido ao remetente.',
        color: {
            bg: 'from-slate-50 to-gray-50',
            gradient: 'from-slate-500 to-gray-500',
            text: 'text-slate-900',
            badge: 'bg-slate-100 text-slate-800 border-slate-200',
            border: 'border-slate-200'
        }
    }
}

function formatEstimatedDelivery(dateString: string): { formatted: string; isToday: boolean; isPast: boolean; daysRemaining: number } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const delivery = new Date(dateString)
    delivery.setHours(0, 0, 0, 0)

    const diffTime = delivery.getTime() - today.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formatted = delivery.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })

    return {
        formatted,
        isToday: daysRemaining === 0,
        isPast: daysRemaining < 0,
        daysRemaining
    }
}

export function StatusHero({ status, trackingCode, estimatedDelivery, currentLocation, updatedAt }: StatusHeroProps) {
    const config = statusConfig[status]
    const Icon = config.icon

    const deliveryInfo = estimatedDelivery ? formatEstimatedDelivery(estimatedDelivery) : null
    const isDelivered = status === 'delivered'
    const isFailed = status === 'failed'
    const lastUpdateDate = new Date(updatedAt).toLocaleDateString('pt-BR')
    const lastUpdateTime = new Date(updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className={`bg-gradient-to-br ${config.color.bg} border ${config.color.border} rounded-2xl overflow-hidden`}>
            {/* Top Gradient Bar */}
            <div className={`h-1.5 bg-gradient-to-r ${config.color.gradient}`} />

            <div className="p-6 md:p-8">
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left: Status Info */}
                    <div className="flex items-start gap-5 flex-1">
                        {/* Icon */}
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color.gradient} flex items-center justify-center shadow-xl flex-shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                            {status === 'out_for_delivery' && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white" />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            {/* Operational + Friendly Message */}
                            <div className="mb-3">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                                    {config.operationalMessage}
                                </p>
                                <h2 className={`text-2xl md:text-3xl font-bold ${config.color.text}`}>
                                    {config.friendlyMessage}
                                </h2>
                            </div>

                            {/* Explanation */}
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
                                {config.explanation}
                            </p>

                            {/* Current Location */}
                            {currentLocation && !isDelivered && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-slate-200/60 shadow-sm">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">{currentLocation}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Delivery Estimate */}
                    <div className="lg:text-right flex-shrink-0">
                        {/* Badge */}
                        <Badge className={`${config.color.badge} border text-sm px-4 py-1.5 mb-4`}>
                            <Icon className="w-4 h-4 mr-2" />
                            {config.label}
                        </Badge>

                        {/* Estimated Delivery */}
                        {!isDelivered && deliveryInfo && (
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">Previsão de Entrega</span>
                                </div>

                                {deliveryInfo.isToday ? (
                                    <p className="text-xl font-bold text-emerald-600">Hoje!</p>
                                ) : deliveryInfo.isPast ? (
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <p className="text-lg font-bold text-amber-600">Em análise</p>
                                    </div>
                                ) : deliveryInfo.daysRemaining === 1 ? (
                                    <p className="text-xl font-bold text-purple-600">Amanhã</p>
                                ) : (
                                    <p className="text-lg font-semibold text-slate-800 capitalize">
                                        {deliveryInfo.formatted}
                                    </p>
                                )}

                                {!deliveryInfo.isToday && !deliveryInfo.isPast && deliveryInfo.daysRemaining > 1 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        em {deliveryInfo.daysRemaining} dias úteis
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No estimate yet */}
                        {!isDelivered && !deliveryInfo && status !== 'failed' && status !== 'returned' && (
                            <div className="bg-white/80 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">Previsão de Entrega</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-slate-400" />
                                    <p className="text-sm text-slate-600">A calcular</p>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Será definida após a coleta
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Last Update Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Última atualização: {lastUpdateDate} às {lastUpdateTime}</span>
                    <span className="font-mono">{trackingCode.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}
