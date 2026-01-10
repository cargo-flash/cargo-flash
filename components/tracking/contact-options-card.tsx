'use client'

import {
    Phone,
    MessageSquare,
    Mail,
    MessagesSquare,
    Headphones,
    Clock,
    ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ContactOptionsCardProps {
    trackingCode: string
    status: string
}

interface ContactOption {
    id: string
    label: string
    description: string
    icon: typeof Phone
    action: string
    actionLabel: string
    color: string
    available: boolean
    hours?: string
}

export function ContactOptionsCard({ trackingCode, status }: ContactOptionsCardProps) {
    const contactOptions: ContactOption[] = [
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            description: 'Resposta em até 5 minutos',
            icon: MessageSquare,
            action: `https://wa.me/5511999999999?text=Olá! Preciso de ajuda com o rastreamento ${trackingCode.toUpperCase()}`,
            actionLabel: 'Abrir Chat',
            color: 'text-green-600 bg-green-50 hover:bg-green-100',
            available: true
        },
        {
            id: 'phone',
            label: 'Telefone',
            description: 'Atendimento humanizado',
            icon: Phone,
            action: 'tel:+551140028922',
            actionLabel: 'Ligar Agora',
            color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
            available: true,
            hours: '08h-22h'
        },
        {
            id: 'email',
            label: 'E-mail',
            description: 'Resposta em até 24h',
            icon: Mail,
            action: `mailto:suporte@cargoflash.com.br?subject=Rastreamento ${trackingCode.toUpperCase()}`,
            actionLabel: 'Enviar E-mail',
            color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
            available: true
        },
        {
            id: 'chat',
            label: 'Chat Online',
            description: 'Atendimento via site',
            icon: MessagesSquare,
            action: '/suporte',
            actionLabel: 'Iniciar Chat',
            color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
            available: true,
            hours: '24h'
        }
    ]

    // Priority contact for urgent situations
    const isUrgent = ['out_for_delivery', 'failed'].includes(status)

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-white" />
                    </div>
                    Fale Conosco
                    {isUrgent && (
                        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Prioridade
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {/* Urgent notice */}
                {isUrgent && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-xs text-amber-700">
                            ⚡ Sua entrega está em andamento. Para contato imediato, use o WhatsApp.
                        </p>
                    </div>
                )}

                {/* Contact Options Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {contactOptions.map((option) => {
                        const Icon = option.icon
                        return (
                            <a
                                key={option.id}
                                href={option.action}
                                target={option.id === 'email' ? '_blank' : undefined}
                                rel={option.id === 'email' ? 'noopener noreferrer' : undefined}
                                className={`
                                    flex flex-col items-center p-4 rounded-xl border border-transparent 
                                    transition-all ${option.color}
                                `}
                            >
                                <Icon className="w-6 h-6 mb-2" />
                                <span className="font-medium text-sm">{option.label}</span>
                                <span className="text-[10px] opacity-70 text-center mt-0.5">
                                    {option.description}
                                </span>
                                {option.hours && (
                                    <span className="text-[9px] opacity-60 mt-1 flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        {option.hours}
                                    </span>
                                )}
                            </a>
                        )
                    })}
                </div>

                {/* Driver Contact (if out for delivery) */}
                {status === 'out_for_delivery' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
                            <Phone className="w-4 h-4 mr-2" />
                            Contatar Motorista
                        </Button>
                        <p className="text-[10px] text-slate-400 text-center mt-2">
                            Disponível apenas durante a entrega
                        </p>
                    </div>
                )}

                {/* Reference */}
                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400">
                        Informe o código: <span className="font-mono">{trackingCode.toUpperCase()}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
