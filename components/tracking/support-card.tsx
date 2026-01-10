'use client'

import {
    Phone,
    MessageCircle,
    Clock,
    Headphones,
    Mail,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SupportCardProps {
    trackingCode: string
    status: string
}

export function SupportCard({ trackingCode, status }: SupportCardProps) {
    const isPriority = ['failed', 'returned'].includes(status)

    const whatsappMessage = encodeURIComponent(
        `Olá, gostaria de informações sobre o rastreamento ${trackingCode.toUpperCase()}`
    )

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Central de Atendimento</h3>
                    <p className="text-xs text-slate-500">Suporte ao cliente</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Reference */}
                <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Informe ao atendente:</p>
                    <p className="font-mono text-sm font-bold text-slate-800">
                        {trackingCode.toUpperCase()}
                    </p>
                </div>

                {/* Priority Notice */}
                {isPriority && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800 font-medium">
                            ⚠️ Caso precise de ajuda, entre em contato conosco.
                        </p>
                    </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
                        asChild
                    >
                        <a
                            href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                            <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                        </a>
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href="tel:+551140028922">
                                <Phone className="w-4 h-4 mr-1.5" />
                                Ligar
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href="mailto:contato@cargoflash.com.br">
                                <Mail className="w-4 h-4 mr-1.5" />
                                E-mail
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Hours */}
                <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Seg-Sex: 08h às 18h | Sáb: 08h às 12h</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
