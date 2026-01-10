'use client'

import {
    Package,
    MapPin,
    User,
    Phone,
    Mail,
    Scale,
    FileText,
    Navigation,
    Building2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatWeight } from '@/lib/utils'
import type { Delivery } from '@/lib/types'

interface DeliveryDetailsCardProps {
    delivery: Delivery
}

export function DeliveryDetailsCard({ delivery }: DeliveryDetailsCardProps) {
    return (
        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    Detalhes da Entrega
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Rota */}
                <div className="space-y-4">
                    {/* Origem */}
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                        </div>
                        <div className="absolute left-3 top-7 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-indigo-300" />
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Origem</p>
                        <p className="font-medium text-slate-900">
                            {delivery.origin_city || 'Centro de Distribuição'}, {delivery.origin_state || 'SP'}
                        </p>
                        {delivery.sender_name && (
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <Building2 className="w-3 h-3" />
                                {delivery.sender_name}
                            </p>
                        )}
                    </div>

                    {/* Destino */}
                    <div className="relative pl-8 pt-4">
                        <div className="absolute left-0 top-5 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-indigo-600" />
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Destino</p>
                        <p className="font-medium text-slate-900">
                            {delivery.destination_city}, {delivery.destination_state}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            {delivery.destination_address}
                        </p>
                        {delivery.destination_zip && (
                            <p className="text-sm text-slate-400 mt-0.5">
                                CEP: {delivery.destination_zip}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Destinatário */}
                <div className="space-y-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        Destinatário
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <p className="font-semibold text-slate-900 text-lg">
                            {delivery.recipient_name}
                        </p>
                        {delivery.recipient_phone && (
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {delivery.recipient_phone}
                            </p>
                        )}
                        {delivery.recipient_email && (
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {delivery.recipient_email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Pacote */}
                {(delivery.package_description || delivery.package_weight) && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                                <Package className="w-3.5 h-3.5" />
                                Informações do Pacote
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                {delivery.package_description && (
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Descrição</p>
                                        <p className="font-medium text-slate-800">
                                            {delivery.package_description}
                                        </p>
                                    </div>
                                )}
                                {delivery.package_weight && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                                            <Scale className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Peso</p>
                                            <p className="font-semibold text-slate-800">
                                                {formatWeight(delivery.package_weight)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Localização atual */}
                {delivery.current_location && delivery.status !== 'delivered' && (
                    <>
                        <Separator />
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold mb-1">
                                    📍 Última localização
                                </p>
                                <p className="font-semibold text-slate-800">
                                    {delivery.current_location}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
