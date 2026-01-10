'use client'

import {
    AlertTriangle,
    Info,
    CheckCircle2,
    Clock,
    Truck,
    Bell,
    X
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface DeliveryAlertsProps {
    status: string
    estimatedDelivery?: string | null
    lastUpdate: string
}

interface Alert {
    id: string
    type: 'info' | 'warning' | 'success' | 'urgent'
    title: string
    message: string
    icon: React.ComponentType<{ className?: string }>
    dismissible: boolean
}

function generateAlerts(status: string, estimatedDelivery: string | null | undefined, lastUpdate: string): Alert[] {
    const alerts: Alert[] = []
    const now = new Date()
    const lastUpdateDate = new Date(lastUpdate)
    const hoursSinceUpdate = Math.floor((now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60))

    // Status-based alerts
    if (status === 'out_for_delivery') {
        alerts.push({
            id: 'out-for-delivery',
            type: 'urgent',
            title: '🚚 Entrega em andamento!',
            message: 'Sua encomenda está a caminho. Certifique-se de que alguém esteja disponível para receber.',
            icon: Truck,
            dismissible: false
        })
    }

    if (status === 'pending' && hoursSinceUpdate > 48) {
        alerts.push({
            id: 'pending-long',
            type: 'info',
            title: 'Aguardando coleta',
            message: 'O remetente ainda não despachou sua encomenda. Entre em contato com a loja se necessário.',
            icon: Clock,
            dismissible: true
        })
    }

    if (status === 'in_transit' && hoursSinceUpdate > 72) {
        alerts.push({
            id: 'transit-delay',
            type: 'warning',
            title: 'Possível atraso detectado',
            message: 'Sua encomenda está há mais de 3 dias sem atualização. Estamos verificando a situação.',
            icon: AlertTriangle,
            dismissible: true
        })
    }

    if (status === 'failed') {
        alerts.push({
            id: 'failed-delivery',
            type: 'warning',
            title: 'Tentativa de entrega não concluída',
            message: 'Não foi possível realizar a entrega. Uma nova tentativa será agendada automaticamente.',
            icon: AlertTriangle,
            dismissible: false
        })
    }

    // Estimated delivery alerts
    if (estimatedDelivery && ['in_transit', 'collected'].includes(status)) {
        const delivery = new Date(estimatedDelivery)
        const daysUntil = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntil === 1) {
            alerts.push({
                id: 'arriving-tomorrow',
                type: 'info',
                title: '📦 Chegando amanhã!',
                message: 'Sua encomenda deve chegar amanhã. Prepare-se para recebê-la.',
                icon: Info,
                dismissible: true
            })
        }

        if (daysUntil < 0) {
            alerts.push({
                id: 'overdue',
                type: 'warning',
                title: 'Prazo de entrega expirado',
                message: 'A previsão de entrega passou. Estamos priorizando sua encomenda.',
                icon: AlertTriangle,
                dismissible: false
            })
        }
    }

    if (status === 'delivered') {
        alerts.push({
            id: 'delivered-success',
            type: 'success',
            title: '✅ Entrega concluída com sucesso!',
            message: 'Sua encomenda foi entregue. Esperamos que aproveite sua compra!',
            icon: CheckCircle2,
            dismissible: true
        })
    }

    return alerts
}

const alertStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600'
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'text-amber-600'
    },
    success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        icon: 'text-emerald-600'
    },
    urgent: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-800',
        icon: 'text-purple-600'
    }
}

export function DeliveryAlerts({ status, estimatedDelivery, lastUpdate }: DeliveryAlertsProps) {
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
    const [alerts, setAlerts] = useState<Alert[]>([])

    useEffect(() => {
        setAlerts(generateAlerts(status, estimatedDelivery, lastUpdate))
    }, [status, estimatedDelivery, lastUpdate])

    const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))

    if (visibleAlerts.length === 0) {
        return null
    }

    const handleDismiss = (alertId: string) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]))
    }

    return (
        <div className="space-y-3">
            {visibleAlerts.map((alert) => {
                const style = alertStyles[alert.type]
                const Icon = alert.icon

                return (
                    <div
                        key={alert.id}
                        className={`relative flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.border} animate-in slide-in-from-top-2`}
                    >
                        <div className={`flex-shrink-0 ${style.icon}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${style.text}`}>{alert.title}</p>
                            <p className={`text-sm ${style.text} opacity-80 mt-0.5`}>{alert.message}</p>
                        </div>
                        {alert.dismissible && (
                            <button
                                onClick={() => handleDismiss(alert.id)}
                                className={`flex-shrink-0 p-1 rounded-full hover:bg-black/5 ${style.icon}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {alert.type === 'urgent' && (
                            <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
