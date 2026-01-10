'use client'

import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Phone,
    Clock,
    MapPin,
    Package,
    RotateCcw,
    AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

interface FAQCardProps {
    status: string
}

const faqs = [
    {
        question: 'Quando minha encomenda será entregue?',
        answer: 'A previsão de entrega está indicada na página. Fatores como clima, trânsito e disponibilidade podem influenciar o prazo.',
        icon: Clock,
        statuses: ['pending', 'collected', 'in_transit']
    },
    {
        question: 'Como acompanhar o motorista em tempo real?',
        answer: 'Quando o status mudar para "Saiu para Entrega", o card do motorista aparecerá com informações de contato.',
        icon: MapPin,
        statuses: ['in_transit', 'out_for_delivery']
    },
    {
        question: 'O que fazer se não houver ninguém para receber?',
        answer: 'Realizamos até 3 tentativas automáticas. Você pode reagendar ou indicar um vizinho para receber.',
        icon: Package,
        statuses: ['out_for_delivery', 'failed']
    },
    {
        question: 'Como solicitar devolução ou troca?',
        answer: 'Entre em contato com a loja vendedora. A Cargo Flash apenas realiza o transporte.',
        icon: RotateCcw,
        statuses: ['delivered']
    },
    {
        question: 'Minha entrega está atrasada, o que fazer?',
        answer: 'Entre em contato com nosso suporte. Investigaremos e daremos uma posição em até 2 horas.',
        icon: AlertTriangle,
        statuses: ['in_transit', 'failed']
    }
]

export function FAQCard({ status }: FAQCardProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    // Filter FAQs relevant to current status
    const relevantFaqs = faqs.filter(faq => faq.statuses.includes(status))

    if (relevantFaqs.length === 0) {
        return null
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    Perguntas Frequentes
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-2">
                    {relevantFaqs.map((faq, index) => {
                        const isOpen = openIndex === index
                        const Icon = faq.icon

                        return (
                            <div
                                key={index}
                                className={`rounded-xl border transition-all ${isOpen ? 'border-sky-200 bg-sky-50' : 'border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isOpen ? 'text-sky-600' : 'text-slate-400'}`} />
                                        <span className={`text-sm ${isOpen ? 'text-sky-700 font-medium' : 'text-slate-700'}`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-sky-600 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className="px-4 pb-4 pt-0">
                                        <p className="text-sm text-sky-700 leading-relaxed pl-7">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Contact CTA */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center mb-3">
                        Não encontrou sua resposta?
                    </p>
                    <div className="flex gap-2">
                        <a
                            href="https://wa.me/5511999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </a>
                        <a
                            href="tel:+551140028922"
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Ligar
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
