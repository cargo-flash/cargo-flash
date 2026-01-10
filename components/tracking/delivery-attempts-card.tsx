'use client'

import {
    AlertTriangle,
    Clock,
    XCircle,
    RefreshCw,
    Home,
    Phone,
    Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DeliveryHistory } from '@/lib/types'

interface DeliveryAttemptsCardProps {
    history: DeliveryHistory[]
    status: string
}

const failureReasons: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
    'ausente': { icon: Home, label: 'Destinatário ausente', color: 'bg-amber-100 text-amber-700' },
    'endereco': { icon: AlertTriangle, label: 'Endereço não localizado', color: 'bg-orange-100 text-orange-700' },
    'recusado': { icon: XCircle, label: 'Recusa do destinatário', color: 'bg-red-100 text-red-700' },
    'horario': { icon: Clock, label: 'Fora do horário de entrega', color: 'bg-blue-100 text-blue-700' },
    'default': { icon: AlertTriangle, label: 'Tentativa não concluída', color: 'bg-slate-100 text-slate-700' }
}

function getFailureInfo(description: string | null | undefined) {
    if (!description) return failureReasons.default

    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('ausente') || lowerDesc.includes('ninguém')) return failureReasons.ausente
    if (lowerDesc.includes('endereço') || lowerDesc.includes('localiza')) return failureReasons.endereco
    if (lowerDesc.includes('recusa') || lowerDesc.includes('negou')) return failureReasons.recusado
    if (lowerDesc.includes('horário') || lowerDesc.includes('fechado')) return failureReasons.horario

    return failureReasons.default
}

function formatDateTime(dateString: string): { date: string; time: string } {
    const d = new Date(dateString)
    return {
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
}

export function DeliveryAttemptsCard({ history, status }: DeliveryAttemptsCardProps) {
    // Filter failed delivery attempts
    const failedAttempts = history.filter(h => h.status === 'failed')

    if (failedAttempts.length === 0) {
        return null
    }

    const latestAttempt = failedAttempts[0]
    const failureInfo = getFailureInfo(latestAttempt.description)
    const FailureIcon = failureInfo.icon

    return (
        <Card className="border border-amber-200 shadow-lg shadow-amber-100/50 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-3 border-b border-amber-200">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                    Tentativas de Entrega
                    <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-700 border-amber-200">
                        {failedAttempts.length} {failedAttempts.length === 1 ? 'tentativa' : 'tentativas'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Latest Attempt Highlight */}
                <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full ${failureInfo.color} flex items-center justify-center flex-shrink-0`}>
                            <FailureIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-slate-800">Última Tentativa</p>
                                <span className="text-xs text-slate-500">
                                    {formatDateTime(latestAttempt.created_at).date} às {formatDateTime(latestAttempt.created_at).time}
                                </span>
                            </div>
                            <p className="text-sm text-amber-700">{failureInfo.label}</p>
                            {latestAttempt.description && (
                                <p className="text-sm text-slate-600 mt-2">{latestAttempt.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Previous Attempts */}
                {failedAttempts.length > 1 && (
                    <div className="space-y-2">
                        <p className="text-xs text-amber-600 uppercase tracking-wider font-medium">Tentativas Anteriores</p>
                        {failedAttempts.slice(1).map((attempt) => {
                            const attemptInfo = getFailureInfo(attempt.description)
                            const AttemptIcon = attemptInfo.icon
                            const { date, time } = formatDateTime(attempt.created_at)

                            return (
                                <div key={attempt.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                                    <div className={`w-8 h-8 rounded-full ${attemptInfo.color} flex items-center justify-center flex-shrink-0`}>
                                        <AttemptIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 truncate">{attemptInfo.label}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{date} {time}</span>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Action Buttons */}
                {status === 'failed' && (
                    <div className="space-y-2 pt-2">
                        <p className="text-sm text-amber-800 font-medium text-center">
                            Nova tentativa será realizada automaticamente
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="bg-white">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                Reagendar
                            </Button>
                            <Button variant="outline" size="sm" className="bg-white">
                                <Phone className="w-4 h-4 mr-1.5" />
                                Suporte
                            </Button>
                        </div>
                    </div>
                )}

                {/* Notice */}
                <div className="text-center pt-2">
                    <p className="text-xs text-amber-600">
                        Até 3 tentativas de entrega são realizadas automaticamente
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
