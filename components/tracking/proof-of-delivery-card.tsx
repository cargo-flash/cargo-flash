'use client'

import {
    CheckCircle2,
    Camera,
    User,
    Calendar,
    Clock,
    FileImage,
    Download,
    ZoomIn
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface ProofOfDeliveryCardProps {
    deliveredTo: string | null | undefined
    deliveredAt: string | null | undefined
    proofUrl: string | null | undefined
    signature?: string | null
}

function formatDeliveryDateTime(dateString: string): { date: string; time: string; full: string } {
    const d = new Date(dateString)
    return {
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        full: d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }
}

export function ProofOfDeliveryCard({ deliveredTo, deliveredAt, proofUrl, signature }: ProofOfDeliveryCardProps) {
    const [showFullImage, setShowFullImage] = useState(false)

    if (!deliveredTo && !deliveredAt) {
        return null
    }

    const deliveryInfo = deliveredAt ? formatDeliveryDateTime(deliveredAt) : null

    return (
        <>
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
                {/* Success Banner - Professional Green */}
                <div className="bg-[#166534] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">Entrega Concluída</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                        Verificado
                    </Badge>
                </div>

                <CardContent className="pt-4 space-y-4">
                    {/* Delivered To */}
                    {deliveredTo && (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-[#166534]" />
                                <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                                    Recebido por
                                </p>
                            </div>
                            <p className="text-xl font-bold text-slate-800">{deliveredTo}</p>
                        </div>
                    )}

                    {/* Delivery Date/Time */}
                    {deliveryInfo && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    <p className="text-xs text-slate-500">Data</p>
                                </div>
                                <p className="font-semibold text-slate-800">{deliveryInfo.date}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <p className="text-xs text-slate-500">Horário</p>
                                </div>
                                <p className="font-semibold text-slate-800">{deliveryInfo.time}</p>
                            </div>
                        </div>
                    )}

                    {/* Proof Image */}
                    {proofUrl && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <Camera className="w-3.5 h-3.5" />
                                    Comprovante de Entrega
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-[#1e3a5f] hover:text-[#2d4a6f]"
                                    onClick={() => setShowFullImage(true)}
                                >
                                    <ZoomIn className="w-3.5 h-3.5 mr-1" />
                                    Ampliar
                                </Button>
                            </div>
                            <div
                                className="relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group"
                                onClick={() => setShowFullImage(true)}
                            >
                                <img
                                    src={proofUrl}
                                    alt="Comprovante de entrega"
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="text-white text-sm font-medium">Clique para ampliar</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full border-slate-200" asChild>
                                <a href={proofUrl} download target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar Comprovante
                                </a>
                            </Button>
                        </div>
                    )}

                    {/* No Proof Yet */}
                    {!proofUrl && (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
                            <FileImage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">Comprovante fotográfico não disponível</p>
                            <p className="text-xs text-slate-500 mt-1">A imagem pode levar até 24h para ser processada</p>
                        </div>
                    )}

                    {/* Signature (if available) */}
                    {signature && (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-2">
                                Assinatura Digital
                            </p>
                            <div className="bg-white rounded-lg p-4 min-h-[80px] flex items-center justify-center border border-slate-200">
                                <img src={signature} alt="Assinatura" className="max-h-16" />
                            </div>
                        </div>
                    )}

                    {/* Legal Notice */}
                    <p className="text-[10px] text-slate-500 text-center">
                        Este documento serve como comprovante oficial de entrega e pode ser utilizado para fins legais.
                    </p>
                </CardContent>
            </Card>

            {/* Full Image Modal */}
            {showFullImage && proofUrl && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowFullImage(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
                        onClick={() => setShowFullImage(false)}
                    >
                        ✕
                    </button>
                    <img
                        src={proofUrl}
                        alt="Comprovante de entrega"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            )}
        </>
    )
}
