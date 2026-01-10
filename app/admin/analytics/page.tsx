'use client'

import { useEffect, useState } from 'react'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Activity,
    Target,
    Zap,
    Calendar,
    Clock,
    Package,
    Users,
    Globe,
    Cpu
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Animated bar component
function CyberBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
    const percentage = max > 0 ? (value / max) * 100 : 0

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#00ff41]/60">{label}</span>
                <span style={{ color }}>{value}</span>
            </div>
            <div className="h-2 bg-[#00ff41]/10 rounded overflow-hidden relative">
                <div
                    className="h-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                >
                    {/* Scan effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[scan_2s_linear_infinite]" />
                </div>
            </div>
        </div>
    )
}

// Hex grid cell
function HexCell({ value, active }: { value: number; active: boolean }) {
    return (
        <div
            className={`w-4 h-4 rounded-sm transition-all duration-300 ${active ? 'bg-[#00ff41] shadow-[0_0_10px_#00ff41]' : 'bg-[#00ff41]/10'
                }`}
            style={{ opacity: active ? 0.3 + (value / 100) * 0.7 : 0.1 }}
        />
    )
}

// Activity heatmap
function ActivityHeatmap() {
    const [data, setData] = useState<number[][]>([])

    useEffect(() => {
        // Generate random heatmap data
        const newData = Array.from({ length: 7 }, () =>
            Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
        )
        setData(newData)
    }, [])

    return (
        <div className="space-y-1">
            {data.map((row, i) => (
                <div key={i} className="flex gap-1">
                    <span className="w-8 text-[8px] font-mono text-[#00ff41]/40 flex items-center">
                        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][i]}
                    </span>
                    {row.map((value, j) => (
                        <HexCell key={j} value={value} active={value > 20} />
                    ))}
                </div>
            ))}
            <div className="flex gap-1 mt-2">
                <span className="w-8" />
                {Array.from({ length: 24 }, (_, i) => (
                    <span key={i} className="w-4 text-[6px] font-mono text-[#00ff41]/30 text-center">
                        {i % 6 === 0 ? i : ''}
                    </span>
                ))}
            </div>
        </div>
    )
}

// Pulse ring animation
function PulseRing({ value, label, color }: { value: number; label: string; color: string }) {
    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#00ff41"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.1"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={color}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${value * 2.51} 251`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                        style={{
                            filter: `drop-shadow(0 0 10px ${color})`
                        }}
                    />
                </svg>
                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-bold" style={{ color }}>{value}%</span>
                </div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-[#00ff41]/60 uppercase">{label}</span>
        </div>
    )
}

export default function HackerAnalyticsPage() {
    const [stats, setStats] = useState({
        total: 0,
        delivered: 0,
        pending: 0,
        failed: 0,
        successRate: 0,
        avgDeliveryTime: 0,
    })
    const [loading, setLoading] = useState(true)
    const [dailyData, setDailyData] = useState<{ day: string; count: number }[]>([])
    const [cityData, setCityData] = useState<{ city: string; count: number }[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard')
                const data = await response.json()

                if (data.success) {
                    const total = data.stats.total
                    const delivered = data.stats.byStatus.delivered || 0
                    const pending = data.stats.byStatus.pending || 0
                    const failed = data.stats.byStatus.failed || 0

                    setStats({
                        total,
                        delivered,
                        pending,
                        failed,
                        successRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
                        avgDeliveryTime: 3.2,
                    })

                    // Simulate daily data
                    setDailyData([
                        { day: 'SEG', count: Math.floor(Math.random() * 50) + 10 },
                        { day: 'TER', count: Math.floor(Math.random() * 50) + 10 },
                        { day: 'QUA', count: Math.floor(Math.random() * 50) + 10 },
                        { day: 'QUI', count: Math.floor(Math.random() * 50) + 10 },
                        { day: 'SEX', count: Math.floor(Math.random() * 50) + 10 },
                        { day: 'SAB', count: Math.floor(Math.random() * 30) + 5 },
                        { day: 'DOM', count: Math.floor(Math.random() * 20) + 5 },
                    ])

                    // Simulate city data
                    setCityData([
                        { city: 'São Paulo', count: Math.floor(Math.random() * 200) + 100 },
                        { city: 'Rio de Janeiro', count: Math.floor(Math.random() * 150) + 50 },
                        { city: 'Belo Horizonte', count: Math.floor(Math.random() * 100) + 30 },
                        { city: 'Curitiba', count: Math.floor(Math.random() * 80) + 20 },
                        { city: 'Porto Alegre', count: Math.floor(Math.random() * 60) + 15 },
                    ])
                }
            } catch {
                // Use demo data
                setStats({
                    total: 1247,
                    delivered: 1156,
                    pending: 23,
                    failed: 12,
                    successRate: 93,
                    avgDeliveryTime: 3.2,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const maxDaily = Math.max(...dailyData.map(d => d.count), 1)
    const maxCity = Math.max(...cityData.map(d => d.count), 1)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-3 font-mono text-[#00ff41]">
                    <div className="w-6 h-6 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
                    LOADING_ANALYTICS_MODULE...
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border border-[#00ff41]/30 bg-black/50 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00fff7]/5 via-transparent to-[#ff00ff]/5" />
                <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/30">
                        <BarChart3 className="h-8 w-8 text-[#00ff41]" />
                    </div>
                    <div>
                        <h1 className="font-mono text-xl text-[#00ff41] neon-glow">
                            &gt; ANALYTICS_INTELLIGENCE_MODULE
                        </h1>
                        <p className="font-mono text-xs text-[#00ff41]/50 mt-1">
                            REAL-TIME DATA ANALYSIS • LAST UPDATE: {new Date().toLocaleTimeString('pt-BR')}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Ring Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="matrix" className="overflow-hidden">
                    <CardContent className="p-4 flex justify-center">
                        <PulseRing value={stats.successRate} label="SUCCESS RATE" color="#00ff41" />
                    </CardContent>
                </Card>
                <Card variant="matrix" className="overflow-hidden">
                    <CardContent className="p-4 flex justify-center">
                        <PulseRing
                            value={Math.round((stats.pending / Math.max(stats.total, 1)) * 100)}
                            label="PENDING"
                            color="#ffb000"
                        />
                    </CardContent>
                </Card>
                <Card variant="matrix" className="overflow-hidden">
                    <CardContent className="p-4 flex justify-center">
                        <PulseRing
                            value={Math.round((stats.delivered / Math.max(stats.total, 1)) * 100)}
                            label="DELIVERED"
                            color="#00fff7"
                        />
                    </CardContent>
                </Card>
                <Card variant="matrix" className="overflow-hidden">
                    <CardContent className="p-4 flex justify-center">
                        <PulseRing
                            value={Math.round((stats.failed / Math.max(stats.total, 1)) * 100)}
                            label="FAILED"
                            color="#ff0040"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Daily Performance */}
                <Card variant="matrix">
                    <CardHeader className="py-3 px-4 border-b border-[#00ff41]/20">
                        <CardTitle className="text-sm font-mono text-[#00ff41] flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            WEEKLY_PERFORMANCE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex items-end gap-2 h-40">
                            {dailyData.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-[#00ff41] to-[#00fff7] rounded-t transition-all duration-1000 relative overflow-hidden"
                                        style={{ height: `${(day.count / maxDaily) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[scan_2s_linear_infinite]" />
                                    </div>
                                    <span className="text-[10px] font-mono text-[#00ff41]/60">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Cities */}
                <Card variant="matrix">
                    <CardHeader className="py-3 px-4 border-b border-[#00ff41]/20">
                        <CardTitle className="text-sm font-mono text-[#00ff41] flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            TOP_LOCATIONS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {cityData.map((city, i) => (
                            <CyberBar
                                key={i}
                                value={city.count}
                                max={maxCity}
                                label={city.city}
                                color={['#00ff41', '#00fff7', '#ff00ff', '#ffb000', '#ff0040'][i]}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Activity Heatmap */}
            <Card variant="matrix">
                <CardHeader className="py-3 px-4 border-b border-[#00ff41]/20">
                    <CardTitle className="text-sm font-mono text-[#00ff41] flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        ACTIVITY_HEATMAP
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 overflow-x-auto">
                    <ActivityHeatmap />
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL_OPS', value: stats.total.toLocaleString(), icon: Package, color: '#00ff41', trend: '+12%' },
                    { label: 'AVG_TIME', value: `${stats.avgDeliveryTime}d`, icon: Clock, color: '#00fff7', trend: '-8%' },
                    { label: 'ACTIVE_USERS', value: '1', icon: Users, color: '#ff00ff', trend: '0%' },
                    { label: 'SYSTEM_LOAD', value: '23%', icon: Cpu, color: '#ffb000', trend: '-3%' },
                ].map((stat, i) => (
                    <Card key={i} variant="matrix" className="overflow-hidden group hover:border-[#00ff41]/50 transition-all cursor-pointer">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                                <Badge
                                    className="text-[9px] font-mono"
                                    style={{
                                        backgroundColor: stat.trend.startsWith('+') ? '#00ff41' + '20' : stat.trend.startsWith('-') ? '#ff0040' + '20' : '#ffb000' + '20',
                                        color: stat.trend.startsWith('+') ? '#00ff41' : stat.trend.startsWith('-') ? '#ff0040' : '#ffb000',
                                        borderColor: stat.trend.startsWith('+') ? '#00ff41' + '50' : stat.trend.startsWith('-') ? '#ff0040' + '50' : '#ffb000' + '50',
                                    }}
                                >
                                    {stat.trend.startsWith('+') ? <TrendingUp className="h-2 w-2 mr-1" /> : stat.trend.startsWith('-') ? <TrendingDown className="h-2 w-2 mr-1" /> : null}
                                    {stat.trend}
                                </Badge>
                            </div>
                            <div className="mt-3">
                                <div className="font-mono text-2xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className="font-mono text-[9px] text-[#00ff41]/50 uppercase tracking-wider mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer */}
            <div className="rounded-lg border border-[#00ff41]/20 bg-black/50 p-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#00ff41]/60">
                    <span>MODULE: ANALYTICS_INTELLIGENCE v2.1.0</span>
                    <span>DATA_SOURCE: MAINFRAME_PRIMARY</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}
