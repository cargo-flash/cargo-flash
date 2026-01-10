'use client'

import {
    Package,
    Ruler,
    Scale,
    Barcode,
    Box,
    Tag,
    FileText
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PackageDetailsPremiumProps {
    weight?: number | null
    dimensions?: string | null
    packageType?: string | null
    serviceType?: string | null
    trackingCode: string
}

export function PackageDetailsPremium({
    weight,
    dimensions,
    packageType = 'Caixa',
    serviceType = 'Expresso',
    trackingCode
}: PackageDetailsPremiumProps) {
    const [mounted, setMounted] = useState(false)
    const [is3DRotating, setIs3DRotating] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const parseDimensions = (dim: string | null | undefined) => {
        if (!dim) return { length: 30, width: 20, height: 15 }
        const parts = dim.split('x').map(p => parseInt(p.trim()) || 0)
        return {
            length: parts[0] || 30,
            width: parts[1] || 20,
            height: parts[2] || 15
        }
    }

    const dims = parseDimensions(dimensions)

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Detalhes do Pacote</h3>
                        <p className="text-sm text-slate-500">Especificações técnicas</p>
                    </div>
                </div>
                <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                    {packageType}
                </span>
            </div>

            {/* 3D Package Visualization */}
            <div className="p-6 border-b border-slate-100">
                <div
                    className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => setIs3DRotating(!is3DRotating)}
                >
                    {/* 3D Box Visualization */}
                    <div className={`absolute inset-0 flex items-center justify-center perspective-1000 ${is3DRotating ? 'animate-slow-spin' : ''
                        }`}>
                        <div
                            className="relative"
                            style={{
                                width: Math.min(dims.length * 2, 120),
                                height: Math.min(dims.height * 2, 100),
                                transform: 'rotateX(-15deg) rotateY(-20deg)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Front face */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg border-2 border-orange-600/20"
                                style={{ transform: `translateZ(${Math.min(dims.width, 40)}px)` }}
                            >
                                <div className="absolute inset-4 border-2 border-dashed border-orange-600/30 rounded" />
                            </div>
                            {/* Top face */}
                            <div
                                className="absolute inset-x-0 h-10 bg-gradient-to-b from-amber-300 to-amber-400 rounded-t-lg origin-bottom"
                                style={{
                                    transform: `rotateX(90deg) translateZ(${Math.min(dims.width, 40) - 10}px)`,
                                    top: '-30px'
                                }}
                            />
                            {/* Right face */}
                            <div
                                className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-orange-500 to-orange-600 rounded-r-lg origin-left"
                                style={{
                                    transform: 'rotateY(90deg)',
                                    right: '-30px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-slate-500">
                        <span>Clique para girar</span>
                        <span>{dims.length} x {dims.width} x {dims.height} cm</span>
                    </div>
                </div>
            </div>

            {/* Package Specs */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Ruler className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Dimensões</span>
                        </div>
                        <p className="font-bold text-slate-800">{dimensions || `${dims.length}x${dims.width}x${dims.height} cm`}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Scale className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Peso</span>
                        </div>
                        <p className="font-bold text-slate-800">{weight ? `${weight} kg` : '2.5 kg'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Serviço</span>
                        </div>
                        <p className="font-bold text-slate-800">{serviceType}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Barcode className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Código</span>
                        </div>
                        <p className="font-bold text-slate-800 text-sm truncate">{trackingCode.toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slow-spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 10s linear infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    )
}
