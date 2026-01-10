'use client'

import {
    Leaf,
    Recycle,
    TreePine,
    Zap,
    TrendingDown
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CarbonFootprintCardProps {
    distance?: number // in km
    transportMode?: 'road' | 'air' | 'sea' | 'rail'
}

function calculateCO2(distance: number, mode: string): number {
    // Average CO2 emissions in kg per km
    const emissions: Record<string, number> = {
        road: 0.15, // truck
        air: 0.5,   // airplane
        sea: 0.03,  // ship
        rail: 0.04  // train
    }
    return distance * (emissions[mode] || emissions.road)
}

function formatCO2(kg: number): string {
    if (kg < 1) return `${(kg * 1000).toFixed(0)}g`
    return `${kg.toFixed(2)}kg`
}

export function CarbonFootprintCard({ distance = 500, transportMode = 'road' }: CarbonFootprintCardProps) {
    const co2Emitted = calculateCO2(distance, transportMode)
    const treesNeeded = co2Emitted / 21 // Average tree absorbs 21kg CO2/year
    const carEquivalent = co2Emitted / 0.21 // Average car emits 0.21 kg CO2/km

    return (
        <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden">
            <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-emerald-800">Pegada de Carbono</p>
                        <p className="text-xs text-emerald-600">Impacto ambiental desta entrega</p>
                    </div>
                </div>

                {/* Main Stat */}
                <div className="bg-white rounded-xl p-4 text-center mb-4 shadow-sm">
                    <p className="text-3xl font-bold text-emerald-600">{formatCO2(co2Emitted)}</p>
                    <p className="text-sm text-slate-500">CO₂ emitido</p>
                </div>

                {/* Comparison Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                            <TreePine className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{treesNeeded.toFixed(3)}</p>
                        <p className="text-xs text-slate-500">árvores/ano</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{carEquivalent.toFixed(1)}km</p>
                        <p className="text-xs text-slate-500">equiv. carro</p>
                    </div>
                </div>

                {/* Our Commitment */}
                <div className="bg-emerald-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Recycle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-emerald-800">Compensação de Carbono</p>
                            <p className="text-xs text-emerald-700 mt-0.5">
                                A Cargo Flash compensa 100% das emissões através de projetos de reflorestamento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Green Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-emerald-600">
                    <Zap className="w-4 h-4" />
                    <span>Frota com 30% de veículos elétricos</span>
                </div>
            </CardContent>
        </Card>
    )
}
