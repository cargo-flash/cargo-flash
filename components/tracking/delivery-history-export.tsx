'use client'

import {
    Download,
    FileText,
    Printer,
    Mail,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DeliveryHistory } from '@/lib/types'

interface DeliveryHistoryExportProps {
    trackingCode: string
    history: DeliveryHistory[]
    status: string
}

export function DeliveryHistoryExport({ trackingCode, history, status }: DeliveryHistoryExportProps) {
    const handleExportPDF = () => {
        // In a real app, this would generate a PDF
        alert('Exportação PDF iniciada para código ' + trackingCode.toUpperCase())
    }

    const handlePrint = () => {
        window.print()
    }

    const handleEmailReport = () => {
        // In a real app, this would open email dialog or send to API
        alert('Relatório será enviado por e-mail')
    }

    // Only show if there's history
    if (!history || history.length === 0) {
        return null
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    Histórico Completo
                    <span className="ml-auto text-xs text-slate-400 font-normal">
                        {history.length} registro{history.length > 1 ? 's' : ''}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 text-emerald-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <p className="text-lg font-bold text-slate-800">
                                {history.length > 0
                                    ? Math.ceil((new Date(history[0].created_at).getTime() - new Date(history[history.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))
                                    : 0
                                }
                            </p>
                            <p className="text-xs text-slate-500">Dias</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-blue-600">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <p className="text-lg font-bold text-slate-800">
                                {new Set(history.map(h => h.location).filter(Boolean)).size}
                            </p>
                            <p className="text-xs text-slate-500">Locais</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 text-purple-600">
                                <Clock className="w-4 h-4" />
                            </div>
                            <p className="text-lg font-bold text-slate-800">
                                {history.length}
                            </p>
                            <p className="text-xs text-slate-500">Eventos</p>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                        Opções de Exportação
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportPDF}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                            <Download className="w-5 h-5 text-red-500" />
                            <span className="text-xs">PDF</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                            <Printer className="w-5 h-5 text-slate-500" />
                            <span className="text-xs">Imprimir</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEmailReport}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                            <Mail className="w-5 h-5 text-blue-500" />
                            <span className="text-xs">E-mail</span>
                        </Button>
                    </div>
                </div>

                {/* Delivery Status */}
                {status === 'delivered' && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm text-emerald-700">
                            Comprovante de entrega disponível no PDF
                        </span>
                    </div>
                )}

                {/* Reference */}
                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400">
                        Código: <span className="font-mono">{trackingCode.toUpperCase()}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
