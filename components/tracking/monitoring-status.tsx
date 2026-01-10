'use client'

import {
    Radio,
    Clock,
    Bell,
    Wifi,
    Activity,
    Shield,
    RefreshCw
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface MonitoringStatusProps {
    trackingCode: string
    lastUpdate: string
    status: string
}

export function MonitoringStatus({ trackingCode, lastUpdate, status }: MonitoringStatusProps) {
    const [pulseCount, setPulseCount] = useState(0)
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        // Update time every minute
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }))
        }
        updateTime()
        const interval = setInterval(updateTime, 60000)

        // Pulse animation
        const pulseInterval = setInterval(() => {
            setPulseCount(prev => prev + 1)
        }, 3000)

        return () => {
            clearInterval(interval)
            clearInterval(pulseInterval)
        }
    }, [])

    const isActivelyTracking = ['collected', 'in_transit', 'out_for_delivery'].includes(status)
    const isDelivered = status === 'delivered'

    return (
        <Card className="border border-slate-200/80 shadow-md bg-gradient-to-r from-slate-50 to-white overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left - Monitoring Status */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDelivered
                                    ? 'bg-emerald-100'
                                    : isActivelyTracking
                                        ? 'bg-blue-100'
                                        : 'bg-slate-100'
                                }`}>
                                {isDelivered ? (
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                ) : isActivelyTracking ? (
                                    <Radio className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Clock className="w-5 h-5 text-slate-500" />
                                )}
                            </div>
                            {isActivelyTracking && (
                                <span
                                    key={pulseCount}
                                    className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"
                                />
                            )}
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${isDelivered
                                    ? 'text-emerald-700'
                                    : isActivelyTracking
                                        ? 'text-blue-700'
                                        : 'text-slate-700'
                                }`}>
                                {isDelivered
                                    ? 'Entrega Concluída'
                                    : isActivelyTracking
                                        ? 'Monitoramento Ativo'
                                        : 'Aguardando Movimentação'
                                }
                            </p>
                            <p className="text-xs text-slate-500">
                                {isDelivered
                                    ? 'Ciclo de rastreamento encerrado'
                                    : 'Atualizações automáticas em tempo real'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Right - Status Indicators */}
                    <div className="flex items-center gap-4">
                        {/* Connection Status */}
                        <div className="hidden sm:flex items-center gap-1.5 text-emerald-600">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs font-medium">Online</span>
                        </div>

                        {/* Notifications */}
                        <div className="hidden md:flex items-center gap-1.5 text-slate-500">
                            <Bell className="w-4 h-4" />
                            <span className="text-xs">Alertas ativos</span>
                        </div>

                        {/* Last Update */}
                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{currentTime || '--:--'}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Bar */}
                {isActivelyTracking && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Sistema operando normalmente</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                            <Bell className="w-3.5 h-3.5 text-blue-500" />
                            <span>Você será notificado em caso de atraso</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
