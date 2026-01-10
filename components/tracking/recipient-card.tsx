'use client'

import {
    User,
    Phone,
    Mail,
    MapPin,
    Building
} from 'lucide-react'
import type { Delivery } from '@/lib/types'

interface RecipientCardProps {
    delivery: Delivery
}

function formatPhone(phone: string | null | undefined): string {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
}

function formatCEP(cep: string | null | undefined): string {
    if (!cep) return ''
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length === 8) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    return cep
}

export function RecipientCard({ delivery }: RecipientCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Destinatário</h3>
            </div>

            <div className="p-5 space-y-4">
                {/* Name */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nome</p>
                    <p className="font-semibold text-slate-800">{delivery.recipient_name}</p>
                </div>

                {/* Contact */}
                {(delivery.recipient_phone || delivery.recipient_email) && (
                    <div className="space-y-2">
                        {delivery.recipient_phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {formatPhone(delivery.recipient_phone)}
                            </div>
                        )}
                        {delivery.recipient_email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {delivery.recipient_email}
                            </div>
                        )}
                    </div>
                )}

                {/* Address */}
                <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Endereço de Entrega</p>
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-600">
                            <p>{delivery.destination_address}</p>
                            <p className="mt-0.5">
                                {delivery.destination_city}, {delivery.destination_state}
                                {delivery.destination_zip && (
                                    <span className="text-slate-400"> - {formatCEP(delivery.destination_zip)}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {delivery.delivery_notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700 font-medium mb-1">Observações:</p>
                        <p className="text-sm text-amber-800">{delivery.delivery_notes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
