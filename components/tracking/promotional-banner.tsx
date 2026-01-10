'use client'

import {
    Gift,
    Sparkles,
    Tag,
    Calendar,
    Percent,
    ExternalLink,
    Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PromotionalBannerProps {
    customerEmail?: string | null
    isFirstDelivery?: boolean
}

export function PromotionalBanner({ customerEmail, isFirstDelivery = false }: PromotionalBannerProps) {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        setMounted(true)

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                }
                return prev
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (!isVisible) return null

    const promos = [
        {
            title: 'Primeira Entrega',
            discount: '15%',
            description: 'Desconto exclusivo para novos clientes',
            code: 'PRIMEIRA15',
            gradient: 'from-emerald-500 to-teal-600',
            expiry: '24h para expirar'
        },
        {
            title: 'Frete Grátis',
            discount: 'GRÁTIS',
            description: 'Na próxima encomenda acima de R$ 100',
            code: 'FRETE100',
            gradient: 'from-blue-500 to-indigo-600',
            expiry: '48h para expirar'
        },
        {
            title: 'Entrega Express',
            discount: '20%',
            description: 'Desconto em entregas no mesmo dia',
            code: 'EXPRESS20',
            gradient: 'from-purple-500 to-pink-600',
            expiry: '7 dias'
        }
    ]

    const currentPromo = promos[isFirstDelivery ? 0 : Math.floor(Math.random() * promos.length)]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${currentPromo.gradient} shadow-2xl ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }} />
                {/* Floating shapes */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Left - Promo Info */}
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {currentPromo.title}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">
                                {currentPromo.discount} OFF
                            </h3>
                            <p className="text-white/80">{currentPromo.description}</p>
                        </div>
                    </div>

                    {/* Right - Code & Timer */}
                    <div className="flex flex-col items-end gap-3">
                        {/* Countdown */}
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Expira em:</span>
                            <span className="font-mono font-bold">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Coupon Code */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-dashed border-white/40">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-white" />
                                    <span className="font-mono font-bold text-xl text-white tracking-wider">
                                        {currentPromo.code}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(currentPromo.code)}
                                className="px-6 py-3 bg-white text-slate-800 font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
                            >
                                Copiar
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    ×
                </button>
            </div>
        </div>
    )
}
