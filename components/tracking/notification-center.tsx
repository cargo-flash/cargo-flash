'use client'

import {
    Bell,
    BellRing,
    Mail,
    MessageCircle,
    Smartphone,
    Check,
    Settings,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface NotificationCenterProps {
    trackingCode: string
    email?: string | null
    phone?: string | null
}

interface NotificationOption {
    id: string
    icon: typeof Bell
    title: string
    description: string
    enabled: boolean
}

export function NotificationCenter({ trackingCode, email, phone }: NotificationCenterProps) {
    const [mounted, setMounted] = useState(false)
    const [notifications, setNotifications] = useState<NotificationOption[]>([
        { id: 'status', icon: BellRing, title: 'Mudanças de status', description: 'Seja notificado a cada atualização', enabled: true },
        { id: 'delivery', icon: Zap, title: 'Saiu para entrega', description: 'Alerta quando o entregador sair', enabled: true },
        { id: 'arrival', icon: Bell, title: 'Chegou ao destino', description: 'Confirmação de entrega', enabled: true },
        { id: 'daily', icon: Mail, title: 'Resumo diário', description: 'Status do dia por e-mail', enabled: false }
    ])
    const [activeChannel, setActiveChannel] = useState<'push' | 'email' | 'whatsapp'>('push')

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleNotification = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, enabled: !n.enabled } : n
        ))
    }

    const channels = [
        { id: 'push', icon: Smartphone, label: 'Push' },
        { id: 'email', icon: Mail, label: 'E-mail' },
        { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Bell className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Centro de Notificações</h3>
                            <p className="text-white/80">Personalize seus alertas</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Settings className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Channel Selector */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500 mb-3">Receber notificações via:</p>
                <div className="flex gap-2">
                    {channels.map((channel) => {
                        const Icon = channel.icon
                        const isActive = activeChannel === channel.id
                        return (
                            <button
                                key={channel.id}
                                onClick={() => setActiveChannel(channel.id as 'push' | 'email' | 'whatsapp')}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                                    ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{channel.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Notification Options */}
            <div className="p-6 space-y-4">
                {notifications.map((notification) => {
                    const Icon = notification.icon
                    return (
                        <div
                            key={notification.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`font-medium ${notification.enabled ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-slate-400">{notification.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleNotification(notification.id)}
                                className={`
                                    relative w-12 h-7 rounded-full transition-colors
                                    ${notification.enabled ? 'bg-indigo-600' : 'bg-slate-200'}
                                `}
                            >
                                <span className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all
                                    ${notification.enabled ? 'left-6' : 'left-1'}
                                `}>
                                    {notification.enabled && (
                                        <Check className="w-3 h-3 text-indigo-600 absolute top-1 left-1" />
                                    )}
                                </span>
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Contact Info */}
            {(email || phone) && (
                <div className="px-6 pb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                        <p className="text-sm text-blue-700">
                            📬 Notificações serão enviadas para:
                        </p>
                        <p className="font-medium text-blue-800 mt-1">
                            {activeChannel === 'email' && email}
                            {activeChannel === 'whatsapp' && phone}
                            {activeChannel === 'push' && 'Seu dispositivo'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
