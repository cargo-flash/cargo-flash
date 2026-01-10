'use client'

import {
    Zap,
    Clock,
    Truck,
    CheckCircle2,
    Star,
    Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ServiceTier {
    name: string
    description: string
    deliveryTime: string
    price: string
    features: string[]
    isSelected: boolean
}

interface ServiceComparisonCardProps {
    currentService?: string
}

const services: ServiceTier[] = [
    {
        name: 'Expresso',
        description: 'Entrega mais rápida',
        deliveryTime: '1-2 dias',
        price: 'R$ 45,90',
        features: ['Prioridade máxima', 'Rastreio em tempo real', 'Seguro incluso'],
        isSelected: false
    },
    {
        name: 'Padrão',
        description: 'Melhor custo-benefício',
        deliveryTime: '3-5 dias',
        price: 'R$ 25,90',
        features: ['Rastreio completo', 'Seguro básico', 'Suporte 24h'],
        isSelected: true
    },
    {
        name: 'Econômico',
        description: 'Menor custo',
        deliveryTime: '5-8 dias',
        price: 'R$ 15,90',
        features: ['Rastreio básico', 'Suporte horário comercial'],
        isSelected: false
    }
]

export function ServiceComparisonCard({ currentService = 'Padrão' }: ServiceComparisonCardProps) {
    const selectedService = services.find(s => s.name === currentService) || services[1]

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                    </div>
                    Seu Serviço
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Current Service Highlight */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-indigo-800">{selectedService.name}</h3>
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                    Atual
                                </Badge>
                            </div>
                            <p className="text-sm text-indigo-600">{selectedService.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-indigo-700">{selectedService.price}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-indigo-700">
                            <Clock className="w-4 h-4" />
                            <span>{selectedService.deliveryTime}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {selectedService.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-sm text-indigo-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Comparison */}
                <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                        Outras opções para próximas entregas
                    </p>
                    {services.filter(s => s.name !== currentService).map((service, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${service.name === 'Expresso'
                                        ? 'bg-amber-100 text-amber-600'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {service.name === 'Expresso' ? (
                                        <Zap className="w-4 h-4" />
                                    ) : (
                                        <Truck className="w-4 h-4" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-700">{service.name}</p>
                                    <p className="text-xs text-slate-500">{service.deliveryTime}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-slate-700">{service.price}</p>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700">
                            Clientes frequentes ganham até 15% de desconto em serviços Expresso!
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
