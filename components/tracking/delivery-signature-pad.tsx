'use client'

import {
    PenTool,
    CheckCircle2,
    Clock,
    User,
    FileSignature,
    Fingerprint
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface DeliverySignaturePadProps {
    status: string
    deliveredTo?: string | null
    requiresSignature?: boolean
}

export function DeliverySignaturePad({ status, deliveredTo, requiresSignature = false }: DeliverySignaturePadProps) {
    const [mounted, setMounted] = useState(false)
    const [hasSignature, setHasSignature] = useState(status === 'delivered')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Don't show if not delivered or signature not required
    if (status !== 'delivered' && !requiresSignature) {
        return null
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <FileSignature className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Comprovante de Assinatura</h3>
                            <p className="text-slate-400">Confirmação de recebimento</p>
                        </div>
                    </div>
                    {hasSignature && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Assinado
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {hasSignature ? (
                    /* Signature Display (when delivered) */
                    <div className="space-y-6">
                        {/* Signature Box */}
                        <div className="relative bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200">
                            <div className="absolute top-4 right-4 flex items-center gap-2 text-emerald-600 text-xs font-medium">
                                <Fingerprint className="w-4 h-4" />
                                Verificado
                            </div>

                            {/* Fake Signature SVG */}
                            <div className="h-24 flex items-center justify-center">
                                <svg viewBox="0 0 200 60" className="w-48 h-16 text-slate-700">
                                    <path
                                        d="M 10,45 Q 30,20 50,35 T 80,30 Q 100,20 120,40 T 150,35 Q 170,25 190,40"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="animate-draw"
                                    />
                                </svg>
                            </div>
                            <div className="h-px bg-slate-300 mt-4" />
                            <p className="text-center text-xs text-slate-400 mt-2">Assinatura Digital</p>
                        </div>

                        {/* Signer Info */}
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-emerald-600 font-medium">Recebido por</p>
                                <p className="font-bold text-slate-800">{deliveredTo || 'Destinatário autorizado'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Verificado em</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {new Date().toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        {/* Verification Info */}
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Assinatura registrada às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Pending Signature */
                    <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                            <PenTool className="w-10 h-10 text-amber-600" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">Assinatura Pendente</h4>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            A assinatura será coletada no momento da entrega para confirmar o recebimento.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes draw {
                    from { stroke-dashoffset: 200; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-draw {
                    stroke-dasharray: 200;
                    animation: draw 2s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
