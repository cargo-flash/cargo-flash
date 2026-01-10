'use client'

import {
    User,
    Phone,
    Star,
    MessageCircle,
    Truck,
    Shield,
    Clock,
    MapPin
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryDriverCardProps {
    status: string
    showDriver?: boolean
}

export function DeliveryDriverCard({ status, showDriver = true }: DeliveryDriverCardProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Only show for out_for_delivery status
    if (status !== 'out_for_delivery' || !showDriver) {
        return null
    }

    const driver = {
        name: 'Carlos Silva',
        rating: 4.9,
        deliveries: 1247,
        vehicle: 'Van Prata',
        plate: 'ABC-1234',
        eta: '15 min',
        phone: '(11) 99999-9999'
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>

                <div className="relative flex items-center gap-4">
                    {/* Driver Avatar */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                            <Shield className="w-4 h-4 text-white" />
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{driver.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-white font-medium">{driver.rating}</span>
                            </div>
                            <span className="text-white/50">•</span>
                            <span className="text-white/80">{driver.deliveries} entregas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Info */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <Truck className="w-7 h-7 text-slate-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-800">{driver.vehicle}</p>
                        <p className="text-sm text-slate-500">Placa: {driver.plate}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-bold">{driver.eta}</span>
                        </div>
                        <p className="text-xs text-slate-500">de distância</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                    <a
                        href={`tel:${driver.phone.replace(/\D/g, '')}`}
                        className="flex items-center justify-center gap-2 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">Ligar</span>
                    </a>
                    <a
                        href={`https://wa.me/55${driver.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Mensagem</span>
                    </a>
                </div>

                {/* ETA Notice */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>Previsão de chegada atualizada em tempo real</span>
                </div>
            </div>
        </div>
    )
}
