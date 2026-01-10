'use client'

import {
    ThermometerSnowflake,
    AlertTriangle,
    Package,
    FlaskConical,
    Flame,
    Skull
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SpecialHandlingCardProps {
    specialInstructions?: string | null
    isFragile?: boolean
    requiresRefrigeration?: boolean
    isDangerous?: boolean
    handlingNotes?: string | null
}

export function SpecialHandlingCard({
    specialInstructions,
    isFragile = false,
    requiresRefrigeration = false,
    isDangerous = false,
    handlingNotes
}: SpecialHandlingCardProps) {
    const hasSpecialHandling = isFragile || requiresRefrigeration || isDangerous || specialInstructions || handlingNotes

    if (!hasSpecialHandling) {
        return null
    }

    const handlingTypes = [
        {
            condition: isFragile,
            icon: AlertTriangle,
            label: 'Frágil',
            description: 'Requer manuseio cuidadoso',
            color: 'text-amber-600 bg-amber-50 border-amber-200'
        },
        {
            condition: requiresRefrigeration,
            icon: ThermometerSnowflake,
            label: 'Refrigerado',
            description: 'Cadeia de frio controlada',
            color: 'text-sky-600 bg-sky-50 border-sky-200'
        },
        {
            condition: isDangerous,
            icon: Flame,
            label: 'Perigoso',
            description: 'Material com restrições de transporte',
            color: 'text-red-600 bg-red-50 border-red-200'
        },
    ].filter(h => h.condition)

    return (
        <Card className="border border-amber-200 shadow-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <CardHeader className="pb-3 border-b border-amber-200">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    Manuseio Especial
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Handling Badges */}
                {handlingTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {handlingTypes.map((type, index) => {
                            const Icon = type.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${type.color}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <div>
                                        <p className="font-semibold text-sm">{type.label}</p>
                                        <p className="text-xs opacity-80">{type.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Special Instructions */}
                {specialInstructions && (
                    <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <p className="text-xs text-amber-600 uppercase tracking-wider font-medium mb-2">
                            Instruções Especiais
                        </p>
                        <p className="text-sm text-slate-700">{specialInstructions}</p>
                    </div>
                )}

                {/* Handling Notes */}
                {handlingNotes && (
                    <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <p className="text-xs text-amber-600 uppercase tracking-wider font-medium mb-2">
                            Notas de Manuseio
                        </p>
                        <p className="text-sm text-slate-700">{handlingNotes}</p>
                    </div>
                )}

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                        Esta encomenda requer cuidados especiais durante o transporte e entrega.
                        Nossos motoristas foram instruídos adequadamente.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
