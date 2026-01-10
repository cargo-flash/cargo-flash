'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Package,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Download,
    Plus,
    RefreshCw,
    Terminal,
    Crosshair,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    CheckSquare,
    Square,
    Zap,
    History,
    RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { STATUS_LABELS, type DeliveryStatus, type Delivery } from '@/lib/types'
import { toast } from 'sonner'

export default function HackerEntregasPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [bulkLoading, setBulkLoading] = useState(false)
    const [regenerateLoading, setRegenerateLoading] = useState(false)
    const [scanningId, setScanningId] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState<string>('--:--:--')

    // Update time only on client side to avoid hydration mismatch
    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString('pt-BR'))
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR'))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const fetchDeliveries = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '15',
                ...(search && { search }),
                ...(statusFilter !== 'all' && { status: statusFilter }),
            })

            const response = await fetch(`/api/admin/deliveries?${params}`)
            const data = await response.json()

            if (data.success) {
                setDeliveries(data.data)
                setTotalPages(data.total_pages)
            }
        } catch {
            toast.error('Erro ao carregar entregas')
        } finally {
            setLoading(false)
        }
    }, [page, search, statusFilter])

    useEffect(() => {
        fetchDeliveries()
    }, [fetchDeliveries])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchDeliveries()
    }

    const handleExport = async () => {
        try {
            const response = await fetch(`/api/admin/deliveries/export?status=${statusFilter !== 'all' ? statusFilter : ''}`)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `entregas_${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Exportação concluída!')
        } catch {
            toast.error('Erro ao exportar entregas')
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (!deliveries || selectedIds.length === deliveries.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(deliveries.map(d => d.id))
        }
    }

    const handleBulkAction = async (newStatus: DeliveryStatus) => {
        if (selectedIds.length === 0) {
            toast.error('Selecione pelo menos uma entrega')
            return
        }

        setBulkLoading(true)
        try {
            const response = await fetch('/api/admin/deliveries/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ids: selectedIds,
                    status: newStatus,
                }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success(data.message)
                setSelectedIds([])
                fetchDeliveries()
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao processar ação em lote')
        } finally {
            setBulkLoading(false)
        }
    }

    const handleRegenerateHistory = async (all: boolean = false) => {
        if (!all && selectedIds.length === 0) {
            toast.error('Selecione pelo menos uma entrega')
            return
        }

        const message = all
            ? 'Regenerar histórico de TODAS as entregas ativas? Esta ação pode levar alguns segundos.'
            : `Regenerar histórico de ${selectedIds.length} entrega(s) selecionada(s)?`

        if (!confirm(message)) return

        setRegenerateLoading(true)
        try {
            const response = await fetch('/api/admin/deliveries/regenerate-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(all ? { all: true } : { ids: selectedIds }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success(data.message)
                if (!all) setSelectedIds([])
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao regenerar histórico')
        } finally {
            setRegenerateLoading(false)
        }
    }

    const getStatusConfig = (status: DeliveryStatus) => {
        const configs: Record<DeliveryStatus, { color: string; icon: React.ElementType; glow: string }> = {
            pending: { color: '#ffb000', icon: Clock, glow: 'shadow-[0_0_10px_#ffb000]' },
            collected: { color: '#00fff7', icon: Package, glow: 'shadow-[0_0_10px_#00fff7]' },
            in_transit: { color: '#ff00ff', icon: Truck, glow: 'shadow-[0_0_10px_#ff00ff]' },
            out_for_delivery: { color: '#00ff41', icon: Zap, glow: 'shadow-[0_0_10px_#00ff41]' },
            delivered: { color: '#00ff41', icon: CheckCircle, glow: 'shadow-[0_0_10px_#00ff41]' },
            failed: { color: '#ff0040', icon: XCircle, glow: 'shadow-[0_0_10px_#ff0040]' },
            returned: { color: '#ffb000', icon: Package, glow: 'shadow-[0_0_10px_#ffb000]' },
        }
        return configs[status]
    }

    const simulateScan = (id: string) => {
        setScanningId(id)
        setTimeout(() => setScanningId(null), 1500)
    }

    return (
        <div className="space-y-4">
            {/* Header Terminal */}
            <div className="relative overflow-hidden rounded-xl border border-[#00ff41]/30 bg-black/50 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/5 via-transparent to-[#00ff41]/5" />
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Terminal className="h-8 w-8 text-[#00ff41]" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff41] rounded-full animate-ping" />
                        </div>
                        <div>
                            <h1 className="font-mono text-lg text-[#00ff41] neon-glow flex items-center gap-2">
                                <span>&gt; DELIVERY_CONTROL_MODULE</span>
                                <span className="animate-pulse">▌</span>
                            </h1>
                            <p className="font-mono text-xs text-[#00ff41]/50">
                                {(deliveries || []).length} registros carregados • {selectedIds.length} selecionados
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="matrixGhost"
                            size="sm"
                            onClick={() => handleRegenerateHistory(true)}
                            disabled={regenerateLoading}
                            className="font-mono text-xs"
                            title="Regenerar histórico de todas as entregas ativas"
                        >
                            {regenerateLoading ? (
                                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <History className="h-4 w-4 mr-2" />
                            )}
                            REGEN_ALL
                        </Button>
                        <Button variant="matrixGhost" size="sm" onClick={handleExport} className="font-mono text-xs">
                            <Download className="h-4 w-4 mr-2" />
                            EXPORT.CSV
                        </Button>
                        <Link href="/admin/entregas/nova">
                            <Button variant="matrix" size="sm" className="font-mono text-xs">
                                <Plus className="h-4 w-4 mr-2" />
                                NEW_ENTRY
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <Card variant="matrix" className="overflow-hidden">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Crosshair className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00ff41]/50" />
                            <Input
                                variant="matrix"
                                placeholder="SCAN: código, nome, cidade..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 font-mono text-sm"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger variant="matrix" className="w-full md:w-48 font-mono">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="STATUS" />
                            </SelectTrigger>
                            <SelectContent variant="matrix">
                                <SelectItem value="all" variant="matrix">ALL_STATUS</SelectItem>
                                <SelectItem value="pending" variant="matrix">PENDING</SelectItem>
                                <SelectItem value="collected" variant="matrix">COLLECTED</SelectItem>
                                <SelectItem value="in_transit" variant="matrix">IN_TRANSIT</SelectItem>
                                <SelectItem value="out_for_delivery" variant="matrix">OUT_DELIVERY</SelectItem>
                                <SelectItem value="delivered" variant="matrix">DELIVERED</SelectItem>
                                <SelectItem value="failed" variant="matrix">FAILED</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" variant="matrix" className="font-mono">
                            <Search className="h-4 w-4 mr-2" />
                            SEARCH
                        </Button>
                        <Button type="button" variant="matrixGhost" onClick={() => { setSearch(''); setStatusFilter('all'); setPage(1); fetchDeliveries() }}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
                <div className="rounded-lg border border-[#ffb000]/30 bg-[#ffb000]/5 p-3 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-sm text-[#ffb000]">
                            ▸ {selectedIds.length} TARGET(S) SELECTED
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="matrix" size="sm" onClick={() => handleBulkAction('collected')} disabled={bulkLoading} className="font-mono text-xs">
                                SET_COLLECTED
                            </Button>
                            <Button variant="matrix" size="sm" onClick={() => handleBulkAction('in_transit')} disabled={bulkLoading} className="font-mono text-xs">
                                SET_TRANSIT
                            </Button>
                            <Button variant="matrix" size="sm" onClick={() => handleBulkAction('delivered')} disabled={bulkLoading} className="font-mono text-xs">
                                SET_DELIVERED
                            </Button>
                            <Button
                                variant="matrixGhost"
                                size="sm"
                                onClick={() => handleRegenerateHistory(false)}
                                disabled={regenerateLoading}
                                className="font-mono text-xs border-[#00fff7]/30 text-[#00fff7]"
                            >
                                {regenerateLoading ? (
                                    <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                    <History className="h-4 w-4 mr-1" />
                                )}
                                REGEN_HISTORY
                            </Button>
                            <Button variant="matrixGhost" size="sm" onClick={() => setSelectedIds([])} className="font-mono text-xs">
                                CLEAR
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <Card variant="matrix" className="overflow-hidden">
                <CardHeader className="py-2 px-4 border-b border-[#00ff41]/20">
                    <CardTitle className="font-mono text-sm text-[#00ff41] flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        DATA_STREAM [{(deliveries || []).length}]
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex items-center gap-3 font-mono text-[#00ff41]">
                                <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
                                LOADING_DATA...
                            </div>
                        </div>
                    ) : (deliveries || []).length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="h-16 w-16 text-[#00ff41]/20 mx-auto mb-4" />
                            <p className="font-mono text-[#00ff41]/60">NO_RECORDS_FOUND</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full font-mono text-sm">
                                <thead>
                                    <tr className="border-b border-[#00ff41]/20 text-left bg-[#00ff41]/5">
                                        <th className="p-3 w-12">
                                            <button onClick={toggleSelectAll} className="text-[#00ff41]/60 hover:text-[#00ff41]">
                                                {selectedIds.length === (deliveries || []).length && (deliveries || []).length > 0 ?
                                                    <CheckSquare className="h-4 w-4" /> :
                                                    <Square className="h-4 w-4" />
                                                }
                                            </button>
                                        </th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">TRACKING_ID</th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">RECIPIENT</th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">LOCATION</th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">STATUS</th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">TIMESTAMP</th>
                                        <th className="p-3 text-[10px] text-[#00ff41]/60 uppercase tracking-wider">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(deliveries || []).map((delivery) => {
                                        const statusConfig = getStatusConfig(delivery.status)
                                        const StatusIcon = statusConfig.icon
                                        const isScanning = scanningId === delivery.id

                                        return (
                                            <tr
                                                key={delivery.id}
                                                className={`border-b border-[#00ff41]/10 hover:bg-[#00ff41]/5 transition-all ${selectedIds.includes(delivery.id) ? 'bg-[#00ff41]/10' : ''
                                                    } ${isScanning ? 'animate-pulse bg-[#00ff41]/20' : ''}`}
                                            >
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => toggleSelect(delivery.id)}
                                                        className="text-[#00ff41]/60 hover:text-[#00ff41]"
                                                    >
                                                        {selectedIds.includes(delivery.id) ?
                                                            <CheckSquare className="h-4 w-4 text-[#00ff41]" /> :
                                                            <Square className="h-4 w-4" />
                                                        }
                                                    </button>
                                                </td>
                                                <td className="p-3">
                                                    <Link
                                                        href={`/admin/entregas/${delivery.id}`}
                                                        className="text-[#00ff41] hover:text-[#00fff7] transition-colors"
                                                    >
                                                        {delivery.tracking_code}
                                                    </Link>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-[#00ff41]/80">{delivery.recipient_name}</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1 text-[#00ff41]/60">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="text-xs">{delivery.destination_city}, {delivery.destination_state}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase ${statusConfig.glow}`}
                                                        style={{
                                                            backgroundColor: `${statusConfig.color}20`,
                                                            color: statusConfig.color,
                                                            border: `1px solid ${statusConfig.color}50`
                                                        }}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {STATUS_LABELS[delivery.status]}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-[10px] text-[#00ff41]/50 tabular-nums">
                                                        {new Date(delivery.created_at).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => simulateScan(delivery.id)}
                                                            className="p-1.5 rounded hover:bg-[#00ff41]/10 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
                                                            title="Scan"
                                                        >
                                                            <Crosshair className="h-4 w-4" />
                                                        </button>
                                                        <Link
                                                            href={`/admin/entregas/${delivery.id}`}
                                                            className="p-1.5 rounded hover:bg-[#00ff41]/10 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/entregas/${delivery.id}?edit=true`}
                                                            className="p-1.5 rounded hover:bg-[#00fff7]/10 text-[#00fff7]/60 hover:text-[#00fff7] transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#00ff41]/60">
                        PAGE {page}/{totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="matrixGhost"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="font-mono"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            PREV
                        </Button>
                        <Button
                            variant="matrixGhost"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="font-mono"
                        >
                            NEXT
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Bottom Status */}
            <div className="rounded-lg border border-[#00ff41]/20 bg-black/50 p-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#00ff41]/60">
                    <span>MODULE: DELIVERY_CONTROL v1.2.0</span>
                    <span>LAST_SYNC: {currentTime}</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
