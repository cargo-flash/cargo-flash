'use client'

import {
    Copy,
    MessageCircle,
    Phone,
    Check,
    X,
    HelpCircle,
    Headphones
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface FloatingActionsProps {
    trackingCode: string
    status: string
}

export function FloatingActions({ trackingCode, status }: FloatingActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(trackingCode.toUpperCase())
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Preciso de ajuda com o rastreamento: ${trackingCode.toUpperCase()}`)}`

    if (!mounted) return null

    return (
        <>
            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
                    w-12 h-12 sm:w-14 sm:h-14 rounded-full
                    bg-[#1e3a5f] border-2 border-white/20
                    flex items-center justify-center shadow-lg
                    transform transition-all duration-300
                    hover:bg-[#2d4a6f] hover:shadow-xl hover:scale-105
                    ${isOpen ? 'rotate-90' : 'rotate-0'}
                `}
                aria-label="Contato"
            >
                {isOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                    <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Professional Contact Card */}
            <div className={`
                fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50
                w-[calc(100%-2rem)] max-w-xs sm:max-w-sm
                bg-white rounded-xl shadow-2xl border border-slate-200
                transform transition-all duration-300 origin-bottom-right
                ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }
            `}>
                {/* Header */}
                <div className="bg-[#1e3a5f] px-4 py-3 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">Central de Atendimento</h3>
                            <p className="text-white/70 text-xs">Estamos aqui para ajudar</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Tracking Code */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                            Código de Rastreamento
                        </p>
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-mono font-bold text-slate-800 text-sm">
                                {trackingCode.toUpperCase()}
                            </p>
                            <button
                                onClick={copyToClipboard}
                                className={`
                                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                                    transition-all duration-200
                                    ${copied
                                        ? 'bg-[#166534] text-white'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }
                                `}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        Copiar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Contact Options */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">WhatsApp</span>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:08001234567"
                            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">Ligar</span>
                        </a>
                    </div>

                    {/* Help Link */}
                    <a
                        href="/contato"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm font-medium"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Dúvidas Frequentes
                    </a>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 text-center">
                        Atendimento 24h • Seg - Sex
                    </p>
                </div>
            </div>
        </>
    )
}
