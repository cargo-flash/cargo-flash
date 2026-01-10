'use client'

import { useEffect, useState, useRef } from 'react'
import {
    Terminal,
    Shield,
    Eye,
    Clock,
    Filter,
    Download,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Info,
    Zap,
    Search,
    Pause,
    Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface LogEntry {
    id: string
    admin_name: string
    action: string
    resource_type: string
    resource_id?: string
    details?: Record<string, unknown>
    created_at: string
}

const actionLabels: Record<string, { label: string; color: string; icon: typeof Info }> = {
    login: { label: 'LOGIN', color: '#00ff41', icon: CheckCircle },
    logout: { label: 'LOGOUT', color: '#ffb000', icon: Info },
    create_delivery: { label: 'CREATE', color: '#00fff7', icon: Zap },
    update_delivery: { label: 'UPDATE', color: '#ff00ff', icon: RefreshCw },
    update_status: { label: 'STATUS', color: '#00ff41', icon: Shield },
    delete_delivery: { label: 'DELETE', color: '#ff0040', icon: AlertTriangle },
    export_data: { label: 'EXPORT', color: '#ffb000', icon: Download },
    create_user: { label: 'USER_ADD', color: '#00fff7', icon: Zap },
    update_user: { label: 'USER_MOD', color: '#ff00ff', icon: RefreshCw },
    create_api_key: { label: 'KEY_GEN', color: '#00ff41', icon: Shield },
}

export default function HackerLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filter, setFilter] = useState('')
    const [actionFilter, setActionFilter] = useState('all')
    const [isStreaming, setIsStreaming] = useState(true)
    const logsRef = useRef<HTMLDivElement>(null)

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '50',
            })
            const response = await fetch(`/api/admin/logs?${params}`)
            const data = await response.json()
            if (data.success) {
                setLogs(data.logs || [])
                setTotalPages(data.total_pages || 1)
            }
        } catch {
            // Use demo data
            setLogs([
                { id: '1', admin_name: 'Admin', action: 'login', resource_type: 'auth', created_at: new Date().toISOString() },
                { id: '2', admin_name: 'Admin', action: 'create_delivery', resource_type: 'delivery', resource_id: 'CF123', created_at: new Date().toISOString() },
            ])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [page])

    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(fetchLogs, 10000)
            return () => clearInterval(interval)
        }
    }, [isStreaming])

    const getActionConfig = (action: string) => {
        return actionLabels[action] || { label: action.toUpperCase(), color: '#00ff41', icon: Info }
    }

    const filteredLogs = logs.filter(log => {
        const matchesFilter = !filter ||
            log.admin_name.toLowerCase().includes(filter.toLowerCase()) ||
            log.action.toLowerCase().includes(filter.toLowerCase()) ||
            log.resource_id?.toLowerCase().includes(filter.toLowerCase())
        const matchesAction = actionFilter === 'all' || log.action === actionFilter

        return matchesFilter && matchesAction
    })

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border border-[#00ff41]/30 bg-black/50 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff0040]/5 via-transparent to-[#ff0040]/5" />
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Shield className="h-8 w-8 text-[#ff0040]" />
                            {isStreaming && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff41] rounded-full animate-ping" />
                            )}
                        </div>
                        <div>
                            <h1 className="font-mono text-lg text-[#00ff41] neon-glow flex items-center gap-2">
                                <span>&gt; SECURITY_AUDIT_LOG</span>
                                <span className="animate-pulse">▌</span>
                            </h1>
                            <p className="font-mono text-xs text-[#00ff41]/50">
                                {filteredLogs.length} registros • {isStreaming ? 'STREAMING' : 'PAUSED'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={isStreaming ? 'matrix' : 'matrixGhost'}
                            size="sm"
                            onClick={() => setIsStreaming(!isStreaming)}
                            className="font-mono text-xs"
                        >
                            {isStreaming ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {isStreaming ? 'LIVE' : 'PAUSED'}
                        </Button>
                        <Button variant="matrixGhost" size="sm" onClick={fetchLogs} className="font-mono text-xs">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            REFRESH
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card variant="matrix" className="overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00ff41]/50" />
                            <Input
                                variant="matrix"
                                placeholder="SEARCH: admin, action, resource..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-10 font-mono text-sm"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger variant="matrix" className="w-full md:w-48 font-mono">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="ACTION_TYPE" />
                            </SelectTrigger>
                            <SelectContent variant="matrix">
                                <SelectItem value="all" variant="matrix">ALL_ACTIONS</SelectItem>
                                <SelectItem value="login" variant="matrix">LOGIN</SelectItem>
                                <SelectItem value="logout" variant="matrix">LOGOUT</SelectItem>
                                <SelectItem value="create_delivery" variant="matrix">CREATE</SelectItem>
                                <SelectItem value="update_status" variant="matrix">STATUS</SelectItem>
                                <SelectItem value="delete_delivery" variant="matrix">DELETE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Terminal Logs */}
            <Card variant="matrix" className="overflow-hidden">
                <CardHeader className="py-2 px-4 border-b border-[#00ff41]/20 flex-row items-center justify-between">
                    <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        AUDIT_TRAIL
                    </CardTitle>
                    {isStreaming && (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                            <span className="text-[10px] font-mono text-[#00ff41]/60">LIVE</span>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    {loading && logs.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex items-center gap-3 font-mono text-[#00ff41]">
                                <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
                                LOADING_AUDIT_DATA...
                            </div>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-20">
                            <Shield className="h-16 w-16 text-[#00ff41]/20 mx-auto mb-4" />
                            <p className="font-mono text-[#00ff41]/60">NO_LOGS_FOUND</p>
                        </div>
                    ) : (
                        <div
                            ref={logsRef}
                            className="h-[500px] overflow-y-auto font-mono text-xs bg-black/50"
                        >
                            {/* Header row */}
                            <div className="sticky top-0 bg-[#0d1117] border-b border-[#00ff41]/20 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] text-[#00ff41]/60 uppercase">
                                <div className="col-span-2">TIMESTAMP</div>
                                <div className="col-span-2">ADMIN</div>
                                <div className="col-span-2">ACTION</div>
                                <div className="col-span-2">RESOURCE</div>
                                <div className="col-span-4">DETAILS</div>
                            </div>

                            {filteredLogs.map((log, index) => {
                                const actionConfig = getActionConfig(log.action)
                                const ActionIcon = actionConfig.icon

                                return (
                                    <div
                                        key={log.id}
                                        className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-[#00ff41]/5 hover:bg-[#00ff41]/5 transition-colors items-center"
                                        style={{
                                            animation: index < 5 ? `fadeIn 0.3s ease-out ${index * 0.05}s both` : undefined
                                        }}
                                    >
                                        <div className="col-span-2 text-[#00ff41]/50 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className="tabular-nums">
                                                {new Date(log.created_at).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-[#00fff7]">
                                            @{log.admin_name?.toLowerCase().replace(' ', '_') || 'system'}
                                        </div>
                                        <div className="col-span-2">
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px]"
                                                style={{
                                                    backgroundColor: actionConfig.color + '20',
                                                    color: actionConfig.color,
                                                    border: `1px solid ${actionConfig.color}50`
                                                }}
                                            >
                                                <ActionIcon className="h-2.5 w-2.5" />
                                                {actionConfig.label}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-[#ff00ff]/80">
                                            {log.resource_id ? (
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {log.resource_id.slice(0, 8)}...
                                                </span>
                                            ) : (
                                                <span className="text-[#00ff41]/30">—</span>
                                            )}
                                        </div>
                                        <div className="col-span-4 text-[#00ff41]/50 truncate">
                                            {log.details ? (
                                                Object.entries(log.details).slice(0, 2).map(([key, value]) => (
                                                    <span key={key} className="mr-2">
                                                        <span className="text-[#ffb000]">{key}:</span>
                                                        <span className="text-[#00ff41]/70">{String(value).slice(0, 15)}</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[#00ff41]/30">no_additional_data</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#00ff41]/60">PAGE {page}/{totalPages}</span>
                    <div className="flex gap-2">
                        <Button
                            variant="matrixGhost"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            PREV
                        </Button>
                        <Button
                            variant="matrixGhost"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            NEXT
                        </Button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="rounded-lg border border-[#00ff41]/20 bg-black/50 p-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#00ff41]/60">
                    <span>MODULE: SECURITY_AUDIT v1.0.0</span>
                    <span>RETENTION: 90 DAYS</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}
