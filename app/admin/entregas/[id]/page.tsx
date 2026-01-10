'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Package,
    ArrowLeft,
    MapPin,
    Clock,
    User,
    Truck,
    Edit,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Loader2,
    Phone,
    Mail,
    Calendar,
    Printer,
    Copy,
    Tag,
    FastForward,
    History,
    RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { formatDateTimeString, formatPhone, formatCEP } from '@/lib/utils'
import { STATUS_LABELS, DELIVERY_STATUSES, type DeliveryStatus, type Delivery, type DeliveryHistory } from '@/lib/types'
import { printDeliveryLabel } from '@/components/admin/delivery-label'
import { toast } from 'sonner'

export default function EntregaDetalhePage() {
    const params = useParams()
    const router = useRouter()
    const [delivery, setDelivery] = useState<Delivery | null>(null)
    const [history, setHistory] = useState<DeliveryHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [advancing, setAdvancing] = useState(false)
    const [regenerating, setRegenerating] = useState(false)
    const [newStatus, setNewStatus] = useState<string>('')

    useEffect(() => {
        fetchDelivery()
    }, [params.id])

    const fetchDelivery = async () => {
        try {
            const response = await fetch(`/api/admin/deliveries/${params.id}`)
            const data = await response.json()

            if (data.success) {
                setDelivery(data.delivery)
                setHistory(data.history || [])
                setNewStatus(data.delivery.status)
            } else {
                toast.error('Entrega não encontrada')
                router.push('/admin/entregas')
            }
        } catch {
            toast.error('Erro ao carregar entrega')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async () => {
        if (!newStatus || newStatus === delivery?.status) return

        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/deliveries/${params.id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    description: `Status atualizado para ${STATUS_LABELS[newStatus as DeliveryStatus]}`
                }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Status atualizado')
                fetchDelivery()
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao atualizar status')
        } finally {
            setUpdating(false)
        }
    }

    const advanceStatus = async () => {
        setAdvancing(true)
        try {
            const response = await fetch(`/api/admin/deliveries/${params.id}/advance-status`, {
                method: 'POST',
            })

            const data = await response.json()
            if (data.success) {
                toast.success(data.message)
                if (data.remaining_updates > 0) {
                    toast.info(`${data.remaining_updates} atualizações restantes na rota`)
                }
                fetchDelivery()
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao avançar status')
        } finally {
            setAdvancing(false)
        }
    }

    const regenerateRoute = async () => {
        setRegenerating(true)
        try {
            const response = await fetch('/api/admin/deliveries/regenerate-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [params.id] }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success(`Rota regenerada! ${data.events} eventos criados.`)
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao regenerar rota')
        } finally {
            setRegenerating(false)
        }
    }

    const duplicateDelivery = async () => {
        if (!confirm('Deseja duplicar esta entrega? Uma nova entrega será criada com os mesmos dados.')) return

        try {
            const response = await fetch(`/api/admin/deliveries/${params.id}/duplicate`, {
                method: 'POST',
            })

            const data = await response.json()
            if (data.success) {
                toast.success(`Entrega duplicada: ${data.delivery.tracking_code}`)
                router.push(`/admin/entregas/${data.delivery.id}`)
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao duplicar entrega')
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
            case 'out_for_delivery': return <Truck className="h-4 w-4 text-purple-500" />
            case 'in_transit': return <Truck className="h-4 w-4 text-blue-500" />
            default: return <Clock className="h-4 w-4 text-amber-500" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#00ff41]" />
            </div>
        )
    }

    if (!delivery) {
        return null
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/entregas">
                        <Button variant="matrixGhost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-[#00ff41] text-glow-sm">
                            {delivery.tracking_code}
                        </h1>
                        <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                            Criado em {formatDateTimeString(delivery.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="matrixGhost" onClick={fetchDelivery}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                    <Button variant="matrixGhost" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                    </Button>
                    <Button variant="matrixGhost" onClick={duplicateDelivery}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                    </Button>
                    <Button variant="matrixGhost" onClick={() => delivery && printDeliveryLabel(delivery)}>
                        <Tag className="h-4 w-4 mr-2" />
                        Etiqueta
                    </Button>
                    <Link href={`/rastrear/${delivery.tracking_code}`} target="_blank">
                        <Button variant="matrix">
                            Ver Página Pública
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <Card variant="matrix">
                        <CardHeader className="border-b border-[#00ff41]/20">
                            <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                STATUS DA ENTREGA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <Badge
                                        variant={delivery.status === 'delivered' ? 'matrix' : delivery.status === 'failed' ? 'matrixRed' : 'matrixCyan'}
                                        className="text-sm px-3 py-1"
                                    >
                                        {STATUS_LABELS[delivery.status as DeliveryStatus]}
                                    </Badge>
                                    <p className="mt-2 font-mono text-sm text-[#00ff41]/60">
                                        Localização atual: {delivery.current_location || 'Não disponível'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger variant="matrix" className="w-48">
                                            <SelectValue placeholder="Alterar status" />
                                        </SelectTrigger>
                                        <SelectContent variant="matrix">
                                            {DELIVERY_STATUSES.map((s) => (
                                                <SelectItem key={s.value} value={s.value} variant="matrix">
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="matrixSolid"
                                        onClick={updateStatus}
                                        disabled={updating || newStatus === delivery.status}
                                    >
                                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Atualizar'}
                                    </Button>
                                    <Button
                                        variant="matrixGhost"
                                        onClick={advanceStatus}
                                        disabled={advancing || delivery.status === 'delivered'}
                                        title="Avançar para próxima atualização da rota"
                                        className="border-[#00fff7]/30"
                                    >
                                        {advancing ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <FastForward className="h-4 w-4 mr-2 text-[#00fff7]" />
                                        )}
                                        <span className="text-[#00fff7]">Avançar Rota</span>
                                    </Button>
                                    <Button
                                        variant="matrixGhost"
                                        onClick={regenerateRoute}
                                        disabled={regenerating}
                                        title="Regenerar eventos agendados da rota"
                                        className="border-[#ffb000]/30"
                                    >
                                        {regenerating ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <RotateCcw className="h-4 w-4 mr-2 text-[#ffb000]" />
                                        )}
                                        <span className="text-[#ffb000]">Regenerar Rota</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Destination */}
                    <Card variant="matrix">
                        <CardHeader className="border-b border-[#00ff41]/20">
                            <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                DESTINATÁRIO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-mono text-xs text-[#00ff41]/50 mb-1">NOME</p>
                                    <p className="font-mono text-[#00ff41]">{delivery.recipient_name}</p>
                                </div>
                                <div>
                                    <p className="font-mono text-xs text-[#00ff41]/50 mb-1">TELEFONE</p>
                                    <p className="font-mono text-[#00ff41]">{formatPhone(delivery.recipient_phone) || '-'}</p>
                                </div>
                                <div>
                                    <p className="font-mono text-xs text-[#00ff41]/50 mb-1">EMAIL</p>
                                    <p className="font-mono text-[#00ff41]">{delivery.recipient_email || '-'}</p>
                                </div>
                            </div>
                            <Separator variant="matrix" />
                            <div>
                                <p className="font-mono text-xs text-[#00ff41]/50 mb-1">ENDEREÇO</p>
                                <p className="font-mono text-[#00ff41]">{delivery.destination_address}</p>
                                <p className="font-mono text-[#00ff41]/80">
                                    {delivery.destination_city}/{delivery.destination_state} - {formatCEP(delivery.destination_zip)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Driver Info */}
                    {delivery.driver_name && (
                        <Card variant="matrix">
                            <CardHeader className="border-b border-[#00ff41]/20">
                                <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    MOTORISTA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="font-mono text-xs text-[#00ff41]/50 mb-1">NOME</p>
                                        <p className="font-mono text-[#00ff41]">{delivery.driver_name}</p>
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-[#00ff41]/50 mb-1">TELEFONE</p>
                                        <p className="font-mono text-[#00ff41]">{formatPhone(delivery.driver_phone) || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-[#00ff41]/50 mb-1">VEÍCULO</p>
                                        <p className="font-mono text-[#00ff41]">{delivery.driver_vehicle || '-'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Package Info */}
                    <Card variant="matrix">
                        <CardHeader className="border-b border-[#00ff41]/20">
                            <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                PACOTE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            <div>
                                <p className="font-mono text-xs text-[#00ff41]/50 mb-1">DESCRIÇÃO</p>
                                <p className="font-mono text-sm text-[#00ff41]">
                                    {delivery.package_description || 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-[#00ff41]/50 mb-1">PESO</p>
                                <p className="font-mono text-sm text-[#00ff41]">
                                    {delivery.package_weight ? `${delivery.package_weight} kg` : 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-[#00ff41]/50 mb-1">PREVISÃO DE ENTREGA</p>
                                <p className="font-mono text-sm text-[#00ff41]">
                                    {delivery.estimated_delivery || 'Não definida'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card variant="matrix">
                        <CardHeader className="border-b border-[#00ff41]/20">
                            <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                HISTÓRICO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {history.map((item, index) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="p-1.5 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30">
                                                {getStatusIcon(item.status)}
                                            </div>
                                            {index < history.length - 1 && (
                                                <div className="w-px h-full bg-[#00ff41]/20 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-mono text-sm text-[#00ff41]">
                                                {item.description || STATUS_LABELS[item.status as DeliveryStatus]}
                                            </p>
                                            <p className="font-mono text-xs text-[#00ff41]/50">
                                                {item.city}/{item.state}
                                            </p>
                                            <p className="font-mono text-xs text-[#00ff41]/40">
                                                {formatDateTimeString(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <p className="font-mono text-sm text-[#00ff41]/40 text-center py-4">
                                        Nenhum histórico
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
