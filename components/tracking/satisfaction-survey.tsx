'use client'

import {
    MessageSquareHeart,
    Star,
    Send,
    ThumbsUp,
    ThumbsDown,
    Smile,
    Meh,
    Frown,
    PartyPopper
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface SatisfactionSurveyProps {
    trackingCode: string
    status: string
    onSubmit?: (rating: number, feedback: string) => void
}

const emotions = [
    { icon: Frown, value: 1, label: 'Muito insatisfeito', color: 'bg-red-500' },
    { icon: Meh, value: 2, label: 'Insatisfeito', color: 'bg-orange-500' },
    { icon: Meh, value: 3, label: 'Neutro', color: 'bg-amber-500' },
    { icon: Smile, value: 4, label: 'Satisfeito', color: 'bg-emerald-500' },
    { icon: PartyPopper, value: 5, label: 'Muito satisfeito', color: 'bg-green-600' }
]

export function SatisfactionSurvey({ trackingCode, status, onSubmit }: SatisfactionSurveyProps) {
    const [mounted, setMounted] = useState(false)
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [step, setStep] = useState(1)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Only show for delivered status
    if (status !== 'delivered') {
        return null
    }

    const handleSubmit = () => {
        if (rating > 0) {
            setSubmitted(true)
            onSubmit?.(rating, feedback)
        }
    }

    if (submitted) {
        return (
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl p-8 text-center ${mounted ? 'animate-in fade-in zoom-in duration-500' : 'opacity-0'
                }`}>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <PartyPopper className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Obrigado pelo feedback!</h3>
                <p className="text-emerald-100">Sua opinião é muito importante para nós.</p>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>
                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <MessageSquareHeart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Como foi sua experiência?</h3>
                        <p className="text-violet-200">Conte-nos o que achou da entrega</p>
                    </div>
                </div>
            </div>

            {/* Step 1: Rating */}
            {step === 1 && (
                <div className="p-6">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        {emotions.map((emotion) => {
                            const Icon = emotion.icon
                            const isSelected = rating === emotion.value
                            return (
                                <button
                                    key={emotion.value}
                                    onClick={() => setRating(emotion.value)}
                                    className={`
                                        relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all
                                        ${isSelected
                                            ? `${emotion.color} text-white scale-110 shadow-lg`
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:scale-105'
                                        }
                                    `}
                                >
                                    <Icon className="w-8 h-8" />
                                    {isSelected && (
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600 whitespace-nowrap">
                                            {emotion.label}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => rating > 0 && setStep(2)}
                            disabled={rating === 0}
                            className={`
                                w-full py-4 rounded-2xl font-bold transition-all
                                ${rating > 0
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }
                            `}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Feedback */}
            {step === 2 && (
                <div className="p-6">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-200'
                                        }`}
                                />
                            ))}
                            <span className="text-sm text-slate-500 ml-2">
                                {emotions.find(e => e.value === rating)?.label}
                            </span>
                        </div>
                    </div>

                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Conte-nos mais sobre sua experiência (opcional)"
                        className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-4 rounded-2xl font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
