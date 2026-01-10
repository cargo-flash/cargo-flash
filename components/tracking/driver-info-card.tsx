'use client'

import {
    Truck,
    User,
    Phone,
    Star,
    Shield,
    Navigation,
    Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Delivery } from '@/lib/types'

interface DriverInfoCardProps {
    delivery: Delivery
}

// Generate avatar initials
function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase()
}

// Format phone for display
function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
}

export function DriverInfoCard({ delivery }: DriverInfoCardProps) {
    // Only show if there's driver info and delivery is out for delivery or delivered
    if (!delivery.driver_name && !delivery.driver_phone) {
        return null
    }

    const showDriverInfo = ['out_for_delivery', 'delivered'].includes(delivery.status)
    if (!showDriverInfo) {
        return null
    }

    const driverName = delivery.driver_name || 'Motorista'
    const initials = getInitials(driverName)

    return (
        <Card className="border border-purple-200 shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="pb-3 border-b border-purple-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-white" />
                    </div>
                    Motorista Responsável
                    {delivery.status === 'out_for_delivery' && (
                        <Badge className="ml-auto bg-purple-100 text-purple-700 border-purple-200">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-1.5" />
                            Em Rota
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Driver Avatar and Name */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-lg text-slate-800">{driverName}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-slate-500">4.8</span>
                        </div>
                    </div>
                </div>

                {/* Driver Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-2 text-center border border-purple-100">
                        <p className="text-lg font-bold text-purple-600">347</p>
                        <p className="text-[10px] text-slate-500 uppercase">Entregas</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center border border-purple-100">
                        <p className="text-lg font-bold text-emerald-600">98%</p>
                        <p className="text-[10px] text-slate-500 uppercase">Sucesso</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center border border-purple-100">
                        <p className="text-lg font-bold text-blue-600">2 anos</p>
                        <p className="text-[10px] text-slate-500 uppercase">Exp.</p>
                    </div>
                </div>

                {/* Vehicle Info */}
                {delivery.driver_vehicle && (
                    <div className="bg-white rounded-xl p-3 border border-purple-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Veículo</p>
                            <p className="font-medium text-slate-700">{delivery.driver_vehicle}</p>
                        </div>
                    </div>
                )}

                {/* Contact Driver */}
                {delivery.driver_phone && delivery.status === 'out_for_delivery' && (
                    <div className="space-y-2">
                        <a
                            href={`tel:${delivery.driver_phone}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg shadow-purple-500/25"
                        >
                            <Phone className="w-4 h-4" />
                            Ligar para Motorista
                        </a>
                        <p className="text-center text-xs text-purple-600">
                            {formatPhone(delivery.driver_phone)}
                        </p>
                    </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-xs text-emerald-700">
                        Motorista verificado e treinado pela Cargo Flash
                    </p>
                </div>

                {/* Live Tracking Notice */}
                {delivery.status === 'out_for_delivery' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                        <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0 animate-pulse" />
                        <p className="text-xs text-blue-700">
                            Posição do veículo atualizada em tempo real
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
