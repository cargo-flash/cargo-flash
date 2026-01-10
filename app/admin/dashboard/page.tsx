'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
    Terminal,
    Activity,
    Shield,
    Zap,
    Globe,
    Server,
    Database,
    Wifi,
    Eye,
    Lock,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    Package,
    Users,
    BarChart3,
    ArrowRight,
    Play,
    Pause,
    RefreshCw,
    Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Simulated live log entries
const generateLogEntry = () => {
    const types = [
        { type: 'ACCESS', color: 'text-[#00ff41]', icon: '▸' },
        { type: 'SCAN', color: 'text-[#00fff7]', icon: '◉' },
        { type: 'QUERY', color: 'text-[#ffb000]', icon: '⚡' },
        { type: 'SYNC', color: 'text-[#ff00ff]', icon: '↻' },
        { type: 'ALERT', color: 'text-[#ff0040]', icon: '⚠' },
    ]
    const actions = [
        'Verificando integridade do sistema...',
        'Sincronizando dados com mainframe...',
        'Conexão estabelecida: NODE_BR_042',
        'Processando requisição de rastreamento...',
        'Autenticação validada: ADMIN_LEVEL_5',
        'Escaneando portas de entrada...',
        'Banco de dados respondendo: 12ms',
        'Novo pacote registrado no sistema',
        'Atualização de status processada',
        'Backup incremental iniciado',
        'Verificação de segurança OK',
        'Cache atualizado: 847 registros',
        'API externa respondendo normalmente',
        'Webhook processado com sucesso',
        'Conexão criptografada ativa',
    ]
    const t = types[Math.floor(Math.random() * types.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    return { ...t, action, time, id: Date.now() + Math.random() }
}

// Typing effect hook
function useTypingEffect(text: string, speed: number = 50) {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        setDisplayedText('')
        setIsComplete(false)
        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1))
                i++
            } else {
                setIsComplete(true)
                clearInterval(timer)
            }
        }, speed)
        return () => clearInterval(timer)
    }, [text, speed])

    return { displayedText, isComplete }
}

// Hex data generator
function generateHexData(length: number): string {
    return Array.from({ length }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    ).join(' ')
}

// Network node component
function NetworkNode({ x, y, active, label }: { x: number; y: number; active: boolean; label: string }) {
    return (
        <div
            className="absolute flex flex-col items-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        >
            <div className={`w-3 h-3 rounded-full ${active ? 'bg-[#00ff41]' : 'bg-[#00ff41]/30'} ${active ? 'animate-pulse shadow-[0_0_10px_#00ff41]' : ''}`} />
            <span className="text-[8px] font-mono text-[#00ff41]/60 mt-1">{label}</span>
        </div>
    )
}

export default function HackerDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        delivered: 0,
        inTransit: 0,
        failed: 0,
        successRate: 0,
    })
    const [logs, setLogs] = useState<ReturnType<typeof generateLogEntry>[]>([])
    const [systemStatus, setSystemStatus] = useState('OPERATIONAL')
    const [threatLevel, setThreatLevel] = useState('LOW')
    const [isScanning, setIsScanning] = useState(true)
    const [hexStream, setHexStream] = useState('')
    const [networkActivity, setNetworkActivity] = useState(0)
    const logsRef = useRef<HTMLDivElement>(null)

    const { displayedText: systemText, isComplete } = useTypingEffect(
        '> CARGO FLASH ADMIN CONTROL SYSTEM v2.0.4 [SECURE]',
        30
    )

    // Fetch real stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/dashboard')
                const data = await response.json()
                if (data.success) {
                    setStats({
                        total: data.stats.total,
                        pending: data.stats.byStatus.pending || 0,
                        delivered: data.stats.byStatus.delivered || 0,
                        inTransit: data.stats.byStatus.in_transit || 0,
                        failed: data.stats.byStatus.failed || 0,
                        successRate: data.stats.total > 0
                            ? Math.round(((data.stats.byStatus.delivered || 0) / data.stats.total) * 100)
                            : 0,
                    })
                }
            } catch {
                // Use demo data
                setStats({
                    total: 1247,
                    pending: 23,
                    delivered: 1156,
                    inTransit: 45,
                    failed: 12,
                    successRate: 93,
                })
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    // Generate live logs
    useEffect(() => {
        const addLog = () => {
            setLogs(prev => [generateLogEntry(), ...prev].slice(0, 50))
        }
        // Initial logs
        for (let i = 0; i < 5; i++) {
            setTimeout(addLog, i * 200)
        }
        const interval = setInterval(addLog, 2000 + Math.random() * 3000)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = 0
        }
    }, [logs])

    // Hex stream
    useEffect(() => {
        const interval = setInterval(() => {
            setHexStream(generateHexData(32))
        }, 100)
        return () => clearInterval(interval)
    }, [])

    // Network activity
    useEffect(() => {
        const interval = setInterval(() => {
            setNetworkActivity(Math.floor(Math.random() * 100))
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6 relative">
            {/* System Header */}
            <div className="relative overflow-hidden rounded-xl border border-[#00ff41]/30 bg-black/50 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/5 via-transparent to-[#00ff41]/5" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Terminal className="h-8 w-8 text-[#00ff41]" />
                            <div className="absolute inset-0 animate-ping">
                                <Terminal className="h-8 w-8 text-[#00ff41] opacity-30" />
                            </div>
                        </div>
                        <div>
                            <h1 className="font-mono text-lg text-[#00ff41] neon-glow">
                                {systemText}
                                {!isComplete && <span className="animate-pulse">▌</span>}
                            </h1>
                            <div className="flex items-center gap-4 mt-1 font-mono text-xs">
                                <span className="text-[#00fff7]">NODE: BR-PRIMARY</span>
                                <span className="text-[#00ff41]/60">|</span>
                                <span className="text-[#ffb000]">UPTIME: 99.97%</span>
                                <span className="text-[#00ff41]/60">|</span>
                                <span className="text-[#ff00ff]">LATENCY: 12ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-[10px] font-mono text-[#00ff41]/60 uppercase">System</div>
                            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50 font-mono">
                                {systemStatus}
                            </Badge>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-mono text-[#00ff41]/60 uppercase">Threat</div>
                            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50 font-mono">
                                {threatLevel}
                            </Badge>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-mono text-[#00ff41]/60 uppercase">Scanner</div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 font-mono text-xs"
                                onClick={() => setIsScanning(!isScanning)}
                            >
                                {isScanning ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                                {isScanning ? 'ACTIVE' : 'PAUSED'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Hex Stream */}
                <div className="mt-3 font-mono text-[10px] text-[#00ff41]/30 overflow-hidden whitespace-nowrap">
                    {hexStream}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-4">
                {/* Left Column - Stats */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    {/* Primary Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'TOTAL OPS', value: stats.total, icon: Package, color: '#00ff41' },
                            { label: 'SUCCESS', value: `${stats.successRate}%`, icon: TrendingUp, color: '#00fff7' },
                            { label: 'PENDING', value: stats.pending, icon: Clock, color: '#ffb000' },
                            { label: 'IN TRANSIT', value: stats.inTransit, icon: Zap, color: '#ff00ff' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="relative overflow-hidden rounded-lg border border-[#00ff41]/20 bg-black/50 p-3 group hover:border-[#00ff41]/50 transition-all cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#00ff41]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <stat.icon
                                    className="h-4 w-4 mb-2 opacity-60"
                                    style={{ color: stat.color }}
                                />
                                <div
                                    className="font-mono text-2xl font-bold"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                                <div className="font-mono text-[9px] text-[#00ff41]/50 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                                {/* Scan line */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:left-[200%] transition-all duration-1000" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Network Status */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Globe className="h-3 w-3" />
                                NETWORK STATUS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="relative h-32 border border-[#00ff41]/20 rounded bg-black/50">
                                {/* Connection lines */}
                                <svg className="absolute inset-0 w-full h-full">
                                    <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#00ff41" strokeWidth="1" opacity="0.3" />
                                    <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#00ff41" strokeWidth="1" opacity="0.3" />
                                    <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#00ff41" strokeWidth="1" opacity="0.3" />
                                    <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#00ff41" strokeWidth="1" opacity="0.3" />
                                </svg>
                                {/* Nodes */}
                                <NetworkNode x={50} y={50} active={true} label="MAIN" />
                                <NetworkNode x={20} y={20} active={networkActivity > 30} label="N01" />
                                <NetworkNode x={80} y={30} active={networkActivity > 50} label="N02" />
                                <NetworkNode x={30} y={80} active={networkActivity > 70} label="N03" />
                                <NetworkNode x={75} y={75} active={networkActivity > 20} label="N04" />
                            </div>
                            <div className="mt-2 font-mono text-[10px] text-[#00ff41]/60 flex justify-between">
                                <span>LOAD: {networkActivity}%</span>
                                <span>{Math.floor(networkActivity * 1.5)} req/s</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Zap className="h-3 w-3" />
                                QUICK OPS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            <Link href="/admin/entregas/nova">
                                <Button variant="matrixGhost" size="sm" className="w-full justify-start text-xs h-8 font-mono">
                                    <Plus className="h-3 w-3 mr-2" />
                                    NEW DELIVERY
                                </Button>
                            </Link>
                            <Link href="/admin/entregas">
                                <Button variant="matrixGhost" size="sm" className="w-full justify-start text-xs h-8 font-mono">
                                    <Package className="h-3 w-3 mr-2" />
                                    VIEW ALL
                                </Button>
                            </Link>
                            <Link href="/admin/analytics">
                                <Button variant="matrixGhost" size="sm" className="w-full justify-start text-xs h-8 font-mono">
                                    <BarChart3 className="h-3 w-3 mr-2" />
                                    ANALYTICS
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Center Column - Live Terminal */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    {/* Live System Logs */}
                    <Card variant="matrix" className="overflow-hidden h-[400px]">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20 flex-row items-center justify-between">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Activity className="h-3 w-3 animate-pulse" />
                                LIVE SYSTEM LOGS
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                                <span className="font-mono text-[10px] text-[#00ff41]/60">STREAMING</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 h-[calc(100%-40px)] overflow-hidden">
                            <div
                                ref={logsRef}
                                className="h-full overflow-y-auto font-mono text-xs p-3 space-y-1 bg-black/50"
                                style={{ scrollBehavior: 'auto' }}
                            >
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-2 animate-[fadeIn_0.3s_ease-out] hover:bg-[#00ff41]/5 px-1 rounded"
                                    >
                                        <span className="text-[#00ff41]/40 shrink-0">{log.time}</span>
                                        <span className={`${log.color} shrink-0`}>[{log.type}]</span>
                                        <span className="text-[#00ff41]/80">{log.icon}</span>
                                        <span className="text-[#00ff41]/60">{log.action}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Overview */}
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { status: 'PENDING', count: stats.pending, color: '#ffb000' },
                            { status: 'COLLECTED', count: 0, color: '#00fff7' },
                            { status: 'TRANSIT', count: stats.inTransit, color: '#ff00ff' },
                            { status: 'DELIVERED', count: stats.delivered, color: '#00ff41' },
                            { status: 'FAILED', count: stats.failed, color: '#ff0040' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="relative rounded border border-[#00ff41]/20 bg-black/50 p-2 text-center overflow-hidden group hover:border-[#00ff41]/50 transition-all cursor-pointer"
                            >
                                <div
                                    className="font-mono text-xl font-bold"
                                    style={{ color: item.color }}
                                >
                                    {item.count}
                                </div>
                                <div className="font-mono text-[8px] text-[#00ff41]/50 uppercase">
                                    {item.status}
                                </div>
                                {/* Progress bar at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff41]/10">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min((item.count / stats.total) * 100, 100) || 0}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Security & Monitoring */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    {/* Security Panel */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Shield className="h-3 w-3" />
                                SECURITY STATUS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-3">
                            {[
                                { name: 'Firewall', status: 'ACTIVE', ok: true },
                                { name: 'Encryption', status: 'AES-256', ok: true },
                                { name: 'Auth System', status: 'JWT/SECURE', ok: true },
                                { name: 'Last Scan', status: '2 min ago', ok: true },
                                { name: 'Threats', status: '0 DETECTED', ok: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-[#00ff41]/60">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-[#00ff41]">{item.status}</span>
                                        {item.ok ? (
                                            <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                                        ) : (
                                            <AlertTriangle className="h-3 w-3 text-[#ff0040]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* System Resources */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Server className="h-3 w-3" />
                                RESOURCES
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-3">
                            {[
                                { name: 'CPU', value: 23, unit: '%' },
                                { name: 'Memory', value: 67, unit: '%' },
                                { name: 'Storage', value: 45, unit: '%' },
                                { name: 'Bandwidth', value: 12, unit: 'MB/s' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-mono text-[10px] mb-1">
                                        <span className="text-[#00ff41]/60">{item.name}</span>
                                        <span className="text-[#00ff41]">
                                            {item.value}{item.unit}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-[#00ff41]/10 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#00ff41] to-[#00fff7] transition-all duration-500"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Database Status */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Database className="h-3 w-3" />
                                DATABASE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                                <div className="text-[#00ff41]/60">Status:</div>
                                <div className="text-[#00ff41]">CONNECTED</div>
                                <div className="text-[#00ff41]/60">Tables:</div>
                                <div className="text-[#00ff41]">11</div>
                                <div className="text-[#00ff41]/60">Records:</div>
                                <div className="text-[#00ff41]">{stats.total.toLocaleString()}</div>
                                <div className="text-[#00ff41]/60">Latency:</div>
                                <div className="text-[#00ff41]">8ms</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sessions */}
                    <Card variant="matrix" className="overflow-hidden">
                        <CardHeader className="py-2 px-3 border-b border-[#00ff41]/20">
                            <CardTitle className="text-xs font-mono text-[#00ff41] flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                ACTIVE SESSIONS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-mono text-[10px]">
                                    <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                                    <span className="text-[#00ff41]">ADMIN@MAIN</span>
                                    <span className="text-[#00ff41]/40 ml-auto">NOW</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="rounded-lg border border-[#00ff41]/20 bg-black/50 p-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                    <div className="flex items-center gap-6">
                        <span className="text-[#00ff41]/60">
                            SECURE CONNECTION: <span className="text-[#00ff41]">TLS 1.3</span>
                        </span>
                        <span className="text-[#00ff41]/60">
                            SESSION: <span className="text-[#00fff7]">ACTIVE</span>
                        </span>
                        <span className="text-[#00ff41]/60">
                            IP: <span className="text-[#ffb000]">***.***.***</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[#00ff41]/40">
                            {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}
                        </span>
                        <Button size="sm" variant="matrixGhost" className="h-6 px-2 text-[10px]">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            REFRESH
                        </Button>
                    </div>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
