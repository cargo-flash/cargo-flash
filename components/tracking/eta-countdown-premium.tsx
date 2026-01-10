'use client'

import {
    Clock,
    Zap,
    Sparkles,
    Calendar,
    Timer,
    AlertCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface ETACountdownPremiumProps {
    estimatedDelivery: string
    status: string
}

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
}

export function ETACountdownPremium({ estimatedDelivery, status }: ETACountdownPremiumProps) {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

    useEffect(() => {
        setMounted(true)

        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const target = new Date(estimatedDelivery).getTime()
            const difference = target - now

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                    total: difference
                }
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
        }

        setTimeLeft(calculateTimeLeft())
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
        return () => clearInterval(timer)
    }, [estimatedDelivery])

    if (status === 'delivered') return null

    const isUrgent = timeLeft.days === 0 && timeLeft.hours < 3
    const isToday = timeLeft.days === 0

    const getGradient = () => {
        if (isUrgent) return 'from-rose-500 via-red-500 to-orange-500'
        if (isToday) return 'from-amber-400 via-orange-500 to-red-500'
        return 'from-indigo-500 via-purple-600 to-pink-500'
    }

    const getGlowColor = () => {
        if (isUrgent) return 'rgba(244, 63, 94, 0.4)'
        if (isToday) return 'rgba(251, 146, 60, 0.4)'
        return 'rgba(139, 92, 246, 0.4)'
    }

    const timeUnits = [
        { value: timeLeft.days, label: 'Dias', visible: timeLeft.days > 0 },
        { value: timeLeft.hours, label: 'Horas', visible: true },
        { value: timeLeft.minutes, label: 'Min', visible: true },
        { value: timeLeft.seconds, label: 'Seg', visible: true }
    ].filter(u => u.visible)

    return (
        <div className={`
            relative overflow-hidden rounded-3xl shadow-2xl
            ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}
        `}>
            {/* Dynamic Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`} />

            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Glowing orbs */}
                <div
                    className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[80px] opacity-40 animate-pulse"
                    style={{ backgroundColor: getGlowColor() }}
                />
                <div
                    className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-[60px] opacity-30 animate-pulse"
                    style={{ backgroundColor: getGlowColor(), animationDelay: '1s' }}
                />

                {/* Floating particles */}
                {mounted && [...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/40 animate-float-up"
                        style={{
                            left: `${5 + (i * 5)}%`,
                            bottom: '-10px',
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${4 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center ${isUrgent ? 'animate-bounce' : 'animate-pulse'}`}>
                            {isUrgent ? (
                                <AlertCircle className="w-7 h-7 text-white" />
                            ) : (
                                <Timer className="w-7 h-7 text-white" />
                            )}
                        </div>
                        {isUrgent && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center animate-ping">
                                <Zap className="w-3 h-3 text-amber-900" />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-white">
                            {isUrgent ? 'Chegando Agora!' : isToday ? 'Entrega Hoje!' : 'Tempo Restante'}
                        </h3>
                        <p className="text-white/70">
                            {isUrgent ? 'Fique atento!' : 'Contagem regressiva para sua entrega'}
                        </p>
                    </div>
                </div>

                {/* Countdown Display */}
                <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
                    {timeUnits.map((unit, index) => (
                        <div key={unit.label} className="relative">
                            {/* Digit Container */}
                            <div className="relative">
                                {/* Glow behind */}
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />

                                <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl min-w-[80px] md:min-w-[100px]">
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    </div>

                                    {/* Number */}
                                    <div className="text-4xl md:text-6xl font-black text-white font-mono text-center relative">
                                        {String(unit.value).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Label */}
                                <p className="text-center text-white/60 text-xs md:text-sm font-medium mt-2 uppercase tracking-wider">
                                    {unit.label}
                                </p>
                            </div>

                            {/* Separator */}
                            {index < timeUnits.length - 1 && (
                                <div className="absolute top-6 md:top-8 -right-3 md:-right-4 flex flex-col gap-2">
                                    <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/60 rounded-full"
                        style={{ width: `${Math.max(5, 100 - (timeLeft.total / (1000 * 60 * 60 * 24 * 3)) * 100)}%` }}
                    >
                        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                </div>

                {/* Estimated Date */}
                <div className="mt-6 flex items-center justify-center gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                            Previsão: {new Date(estimatedDelivery).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float-up {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-300px); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up linear infinite;
                }

                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
