'use client'

import {
    Star,
    ThumbsUp,
    ThumbsDown,
    Send,
    MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface FeedbackCardProps {
    trackingCode: string
    status: string
}

export function FeedbackCard({ trackingCode, status }: FeedbackCardProps) {
    const [rating, setRating] = useState<number | null>(null)
    const [feedback, setFeedback] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [showFeedbackForm, setShowFeedbackForm] = useState(false)

    // Only show for delivered or failed
    if (!['delivered', 'failed', 'returned'].includes(status)) {
        return null
    }

    const handleSubmit = () => {
        if (rating) {
            setSubmitted(true)
            // Here you would typically send to API
        }
    }

    if (submitted) {
        return (
            <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <ThumbsUp className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                        Obrigado pelo seu feedback!
                    </h3>
                    <p className="text-sm text-emerald-600">
                        Sua opinião é muito importante para melhorarmos nossos serviços.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                    </div>
                    {status === 'delivered' ? 'Avalie sua Entrega' : 'Conte sua Experiência'}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {!showFeedbackForm ? (
                    <>
                        <p className="text-sm text-slate-600 text-center">
                            {status === 'delivered'
                                ? 'Como foi a experiência com sua entrega?'
                                : 'Conte-nos o que aconteceu para melhorarmos'}
                        </p>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 py-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => {
                                        setRating(star)
                                        setShowFeedbackForm(true)
                                    }}
                                    className={`p-2 rounded-full transition-all hover:scale-110 ${rating && rating >= star
                                            ? 'text-amber-400'
                                            : 'text-slate-300 hover:text-amber-300'
                                        }`}
                                >
                                    <Star className={`w-10 h-10 ${rating && rating >= star ? 'fill-amber-400' : ''}`} />
                                </button>
                            ))}
                        </div>

                        {/* Quick Responses */}
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                onClick={() => {
                                    setRating(5)
                                    setShowFeedbackForm(true)
                                }}
                            >
                                <ThumbsUp className="w-4 h-4 mr-1.5" />
                                Ótimo
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-slate-600 border-slate-200 hover:bg-slate-50"
                                onClick={() => {
                                    setRating(3)
                                    setShowFeedbackForm(true)
                                }}
                            >
                                Regular
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                    setRating(1)
                                    setShowFeedbackForm(true)
                                }}
                            >
                                <ThumbsDown className="w-4 h-4 mr-1.5" />
                                Ruim
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Rating Display */}
                        <div className="flex justify-center gap-1 pb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${rating && rating >= star
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-200'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Feedback Form */}
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 text-center">
                                {rating && rating >= 4
                                    ? 'Ficamos felizes! Quer nos contar mais?'
                                    : 'O que podemos melhorar?'}
                            </p>

                            <Textarea
                                placeholder="Escreva seu comentário (opcional)"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[80px] resize-none"
                            />

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setRating(null)
                                        setShowFeedbackForm(false)
                                    }}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                                    onClick={handleSubmit}
                                >
                                    <Send className="w-4 h-4 mr-1.5" />
                                    Enviar
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Reference */}
                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400">
                        Referência: <span className="font-mono">{trackingCode.toUpperCase()}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
