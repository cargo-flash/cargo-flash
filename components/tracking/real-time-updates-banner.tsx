'use client'

import {
    Radio,
    Wifi,
    RefreshCw,
    Bell,
    BellRing,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface RealTimeUpdatesBannerProps {
    lastUpdate?: string
    isConnected?: boolean
}

export function RealTimeUpdatesBanner({ lastUpdate, isConnected = true }: RealTimeUpdatesBannerProps) {
    const [mounted, setMounted] = useState(false)
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [timeSinceUpdate, setTimeSinceUpdate] = useState('agora')

    useEffect(() => {
        setMounted(true)

        if (!lastUpdate) return

        const updateTime = () => {
            const last = new Date(lastUpdate)
            const now = new Date()
            const diffMs = now.getTime() - last.getTime()
            const diffSecs = Math.floor(diffMs / 1000)
            const diffMins = Math.floor(diffSecs / 60)
            const diffHours = Math.floor(diffMins / 60)

            if (diffSecs < 30) setTimeSinceUpdate('agora')
            else if (diffSecs < 60) setTimeSinceUpdate(`${diffSecs}s atrás`)
            else if (diffMins < 60) setTimeSinceUpdate(`${diffMins}min atrás`)
            else setTimeSinceUpdate(`${diffHours}h atrás`)
        }

        updateTime()
        const interval = setInterval(updateTime, 10000)
        return () => clearInterval(interval)
    }, [lastUpdate])

    const toggleNotifications = async () => {
        if (!('Notification' in window)) return

        if (Notification.permission === 'granted') {
            setNotificationsEnabled(!notificationsEnabled)
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                setNotificationsEnabled(true)
            }
        }
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 ${mounted ? 'animate-in fade-in slide-in-from-top-4 duration-500' : 'opacity-0'
            }`}>
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 px-6 py-4 flex items-center justify-between">
                {/* Left side - Status */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            }`}>
                            {isConnected ? (
                                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                            ) : (
                                <Wifi className="w-5 h-5 text-red-400" />
                            )}
                        </div>
                        {isConnected && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                                {isConnected ? 'Rastreamento ao Vivo' : 'Reconectando...'}
                            </span>
                            {isConnected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">LIVE</span>
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            <RefreshCw className="w-3 h-3" />
                            Última atualização: {timeSinceUpdate}
                        </p>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleNotifications}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                            ${notificationsEnabled
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }
                        `}
                    >
                        {notificationsEnabled ? (
                            <>
                                <BellRing className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Notificações ativas</span>
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">Ativar alertas</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700">
                <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress" />
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
                .animate-progress {
                    animation: progress 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
