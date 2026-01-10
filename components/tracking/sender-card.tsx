'use client'

import {
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Delivery } from '@/lib/types'

interface SenderCardProps {
    delivery: Delivery
}

function formatPhone(phone: string | null | undefined): string {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
}

export function SenderCard({ delivery }: SenderCardProps) {
    const hasSenderInfo = delivery.sender_name || delivery.sender_phone || delivery.sender_email

    if (!hasSenderInfo) {
        return null
    }

    // Determine if it's a company or person
    const isCompany = delivery.sender_name?.includes('Ltda') ||
        delivery.sender_name?.includes('S.A.') ||
        delivery.sender_name?.includes('Loja') ||
        delivery.sender_name?.includes('Store') ||
        delivery.sender_name?.includes('Shop')

    return (
        <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                    </div>
                    Remetente
                    <Badge variant="outline" className="ml-auto text-xs font-normal text-slate-500 bg-slate-50">
                        {isCompany ? 'Pessoa Jurídica' : 'Pessoa Física'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Sender Info */}
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#1e3a5f]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-semibold text-slate-800">{delivery.sender_name}</p>
                        {(delivery.origin_city || delivery.origin_state) && (
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {delivery.origin_city && `${delivery.origin_city}, `}
                                {delivery.origin_state}
                            </p>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                {(delivery.sender_phone || delivery.sender_email) && (
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Contato do Remetente</p>

                        {delivery.sender_phone && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        {formatPhone(delivery.sender_phone)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {delivery.sender_email && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        {delivery.sender_email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Origin Address */}
                {delivery.origin_address && (
                    <div className="border border-slate-100 rounded-xl p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                            Endereço de Origem
                        </p>
                        <p className="text-sm text-slate-700">{delivery.origin_address}</p>
                        {delivery.origin_zip && (
                            <p className="text-xs text-slate-400 mt-1 font-mono">CEP: {delivery.origin_zip}</p>
                        )}
                    </div>
                )}

                {/* Info Notice */}
                <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 text-sm">ℹ️</span>
                    <p className="text-xs text-slate-600">
                        Para dúvidas sobre o produto, entre em contato direto com o remetente.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
