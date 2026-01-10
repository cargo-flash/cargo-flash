'use client'

import { Package, Scale, Ruler, Box, Shield, FileText, Hash, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Delivery } from '@/lib/types'

interface PackageInfoCardProps {
    delivery: Delivery
}

// Helper to generate mock data for display
function generatePackageDetails(delivery: Delivery) {
    const weight = delivery.package_weight || 0.5
    const volumetricWeight = +(weight * 1.2).toFixed(2)

    // Generate dimensions based on weight
    const baseDim = Math.round(10 + weight * 5)
    const dimensions = {
        length: baseDim + 5,
        width: baseDim,
        height: Math.round(baseDim * 0.6)
    }

    return {
        grossWeight: weight,
        volumetricWeight,
        dimensions,
        packagingType: weight < 1 ? 'Envelope Reforçado' : weight < 5 ? 'Caixa Padrão' : 'Caixa Reforçada',
        declaredValue: null, // Would come from order
        cargoNature: 'Mercadoria sem restrições',
        internalCode: `LOT-${delivery.id?.slice(0, 8).toUpperCase() || 'N/A'}`,
        batchNumber: `REM-${new Date(delivery.created_at).getTime().toString(36).toUpperCase()}`
    }
}

export function PackageInfoCard({ delivery }: PackageInfoCardProps) {
    const details = generatePackageDetails(delivery)

    return (
        <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    Especificações da Carga
                    <Badge variant="outline" className="ml-auto text-xs font-normal text-slate-500">
                        Carga Geral
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Internal Codes */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Hash className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{details.internalCode}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2 text-slate-500">
                        <Layers className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{details.batchNumber}</span>
                    </div>
                </div>

                <Separator />

                {/* Weight Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Scale className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500 uppercase tracking-wide">Peso Bruto</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">
                            {details.grossWeight.toFixed(2)} <span className="text-sm font-normal text-slate-500">kg</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Box className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500 uppercase tracking-wide">Cubado</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">
                            {details.volumetricWeight.toFixed(2)} <span className="text-sm font-normal text-slate-500">kg</span>
                        </p>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Dimensões (C × L × A)</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800 font-mono">
                        {details.dimensions.length} × {details.dimensions.width} × {details.dimensions.height}
                        <span className="text-sm font-normal text-slate-500 ml-1">cm</span>
                    </p>
                </div>

                <Separator />

                {/* Additional Details */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <Box className="w-4 h-4" />
                            Tipo de Embalagem
                        </span>
                        <span className="text-sm font-medium text-slate-700">{details.packagingType}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Natureza da Carga
                        </span>
                        <span className="text-sm font-medium text-slate-700">{details.cargoNature}</span>
                    </div>

                    {delivery.package_description && (
                        <div className="flex items-start justify-between">
                            <span className="text-sm text-slate-500 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Conteúdo
                            </span>
                            <span className="text-sm font-medium text-slate-700 text-right max-w-[60%]">
                                {delivery.package_description}
                            </span>
                        </div>
                    )}
                </div>

                {/* Protection Notice */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <Shield className="w-4 h-4 text-[#166534] flex-shrink-0" />
                    <p className="text-xs text-slate-600">
                        Carga protegida por seguro durante todo o transporte
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
