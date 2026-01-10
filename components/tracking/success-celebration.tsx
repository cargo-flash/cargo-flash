'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, User, Star } from 'lucide-react'

interface SuccessCelebrationProps {
    isDelivered: boolean
    deliveredTo?: string | null
    deliveredAt?: string | null
}

export function SuccessCelebration({ isDelivered, deliveredTo, deliveredAt }: SuccessCelebrationProps) {
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (isDelivered) {
            // Show modal with slight delay
            setTimeout(() => setShowModal(true), 500)
        }
    }, [isDelivered])

    if (!isDelivered || !showModal) return null

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Content - Professional Design */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                {/* Header - Sober Green */}
                <div className="bg-[#166534] px-6 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                            <CheckCircle2 className="w-9 h-9 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            Entrega Concluída
                        </h2>
                        <p className="text-white/80 text-sm">
                            Sua encomenda foi entregue com sucesso
                        </p>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                    {/* Delivery Info */}
                    {deliveredTo && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="w-10 h-10 rounded-lg bg-[#166534]/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-[#166534]" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Recebido por</p>
                                <p className="font-bold text-slate-800">{deliveredTo}</p>
                            </div>
                        </div>
                    )}

                    {deliveredAt && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Data da entrega</p>
                                <p className="font-semibold text-slate-800 capitalize">{formatDate(deliveredAt)}</p>
                            </div>
                        </div>
                    )}

                    {/* Rating Request - Subtle */}
                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500 text-center mb-3">
                            Avalie sua experiência
                        </p>
                        <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                                >
                                    <Star className="w-6 h-6 text-slate-300 hover:text-[#b45309] transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setShowModal(false)}
                        className="w-full py-3.5 bg-[#166534] text-white font-semibold rounded-lg hover:bg-[#14532d] transition-colors"
                    >
                        Continuar Rastreando
                    </button>
                </div>

                {/* Trust Badge */}
                <div className="px-6 pb-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verificado</span>
                        <span className="text-slate-300">•</span>
                        <span>Cargo Flash Logística</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
