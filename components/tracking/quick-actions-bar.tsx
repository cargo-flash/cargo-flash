'use client'

import {
    Phone,
    MessageSquare,
    Share2,
    Camera,
    Bell,
    HelpCircle,
    Copy,
    Check
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface QuickActionsBarProps {
    trackingCode: string
    status: string
}

export function QuickActionsBar({ trackingCode, status }: QuickActionsBarProps) {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(trackingCode.toUpperCase())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Rastreamento Cargo Flash',
                text: `Acompanhe a entrega: ${trackingCode.toUpperCase()}`,
                url: window.location.href
            })
        }
    }

    const actions = [
        {
            icon: copied ? Check : Copy,
            label: copied ? 'Copiado!' : 'Copiar',
            onClick: handleCopy,
            gradient: 'from-slate-500 to-slate-600',
            highlight: copied
        },
        {
            icon: MessageSquare,
            label: 'WhatsApp',
            onClick: () => window.open(`https://wa.me/5511999999999?text=Olá! Código: ${trackingCode.toUpperCase()}`),
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            icon: Phone,
            label: 'Ligar',
            onClick: () => window.open('tel:+551140028922'),
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Share2,
            label: 'Compartilhar',
            onClick: handleShare,
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            icon: Bell,
            label: 'Alertas',
            onClick: () => { },
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            icon: HelpCircle,
            label: 'Ajuda',
            onClick: () => window.location.href = '/suporte',
            gradient: 'from-cyan-500 to-blue-600'
        }
    ]

    return (
        <div className={`sticky bottom-0 left-0 right-0 z-40 ${mounted ? 'animate-in slide-in-from-bottom duration-500' : 'opacity-0'
            }`}>
            {/* Blur Background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-slate-200" />

            {/* Content */}
            <div className="relative container mx-auto px-4 py-4">
                <div className="flex items-center justify-center gap-2 md:gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`
                                    group flex flex-col items-center gap-1 p-3 rounded-2xl
                                    transition-all duration-300 hover:scale-105
                                    ${action.highlight ? 'bg-emerald-50' : 'hover:bg-slate-50'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient}
                                    flex items-center justify-center shadow-lg
                                    group-hover:shadow-xl group-hover:scale-110 transition-all
                                `}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-xs font-medium ${action.highlight ? 'text-emerald-600' : 'text-slate-600'
                                    }`}>
                                    {action.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
