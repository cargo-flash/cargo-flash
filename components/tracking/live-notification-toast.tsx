'use client'

import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    X,
    Truck
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Toast {
    id: string
    type: 'success' | 'warning' | 'info' | 'delivery'
    title: string
    message: string
    duration?: number
}

interface LiveNotificationToastProps {
    status: string
    trackingCode: string
}

export function LiveNotificationToast({ status, trackingCode }: LiveNotificationToastProps) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Show initial toast based on status
        const initialToast = getStatusToast(status)
        if (initialToast) {
            setTimeout(() => addToast(initialToast), 1000)
        }

        // Simulate live updates
        const interval = setInterval(() => {
            const randomToast = getRandomUpdateToast()
            if (randomToast && Math.random() > 0.7) {
                addToast(randomToast)
            }
        }, 30000) // Every 30 seconds with 30% chance

        return () => clearInterval(interval)
    }, [status])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id }

        setToasts(prev => [...prev, newToast])

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id)
        }, toast.duration || 5000)
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const getStatusToast = (status: string): Omit<Toast, 'id'> | null => {
        switch (status) {
            case 'out_for_delivery':
                return {
                    type: 'delivery',
                    title: '🚚 Motorista a Caminho!',
                    message: 'Sua encomenda chegará em breve. Fique atento!',
                    duration: 8000
                }
            case 'delivered':
                return {
                    type: 'success',
                    title: '✅ Entrega Confirmada!',
                    message: 'Sua encomenda foi entregue com sucesso.',
                    duration: 10000
                }
            case 'in_transit':
                return {
                    type: 'info',
                    title: '📦 Em Trânsito',
                    message: 'Sua encomenda está viajando com segurança.',
                    duration: 6000
                }
            default:
                return null
        }
    }

    const getRandomUpdateToast = (): Omit<Toast, 'id'> | null => {
        const updates = [
            {
                type: 'info' as const,
                title: '📍 Atualização de Localização',
                message: 'Nova posição registrada no sistema',
                duration: 4000
            },
            {
                type: 'success' as const,
                title: '✨ Tudo Certo!',
                message: 'Sua encomenda segue no prazo previsto',
                duration: 4000
            },
            {
                type: 'info' as const,
                title: '🔄 Sistema Sincronizado',
                message: 'Dados atualizados em tempo real',
                duration: 3000
            }
        ]
        return updates[Math.floor(Math.random() * updates.length)]
    }

    const toastConfig = {
        success: {
            icon: CheckCircle2,
            bgClass: 'bg-[#166534]',
            borderClass: 'border-slate-200',
            bgLightClass: 'bg-white'
        },
        warning: {
            icon: AlertTriangle,
            bgClass: 'bg-[#b45309]',
            borderClass: 'border-slate-200',
            bgLightClass: 'bg-white'
        },
        info: {
            icon: Info,
            bgClass: 'bg-[#1e3a5f]',
            borderClass: 'border-slate-200',
            bgLightClass: 'bg-white'
        },
        delivery: {
            icon: Truck,
            bgClass: 'bg-[#1e3a5f]',
            borderClass: 'border-slate-200',
            bgLightClass: 'bg-white'
        }
    }

    if (!mounted) return null

    return (
        <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
            {toasts.map((toast, index) => {
                const config = toastConfig[toast.type]
                const Icon = config.icon

                return (
                    <div
                        key={toast.id}
                        className={`
                            relative overflow-hidden rounded-xl shadow-lg border
                            ${config.borderClass} ${config.bgLightClass}
                            animate-in slide-in-from-right duration-300
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Progress bar */}
                        <div
                            className={`absolute bottom-0 left-0 h-1 ${config.bgClass}`}
                            style={{
                                animation: `shrink ${toast.duration || 5000}ms linear forwards`
                            }}
                        />

                        <div className="flex items-start gap-4 p-4">
                            <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm">
                                    {toast.title}
                                </h4>
                                <p className="text-slate-600 text-sm mt-0.5">
                                    {toast.message}
                                </p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )
            })}

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    )
}
