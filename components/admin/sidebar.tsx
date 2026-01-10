'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Package,
    Users,
    BarChart3,
    Settings,
    Truck,
    LogOut,
    Menu,
    X,
    Zap,
    Clock,
    Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QuickSearch } from './quick-search'
import { toast } from 'sonner'

interface SidebarProps {
    user: {
        full_name: string
        email: string
        role: string
    } | null
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Entregas', href: '/admin/entregas' },
    { icon: Users, label: 'Usuários', href: '/admin/usuarios' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Truck, label: 'Simulação', href: '/admin/simulacao' },
    { icon: Shield, label: 'Logs', href: '/admin/logs' },
    { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
]

export function AdminSidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState('')
    const [notifications, setNotifications] = useState<{ pending: number; failed: number }>({ pending: 0, failed: 0 })

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/admin/notifications')
                const data = await response.json()
                if (data.success) {
                    setNotifications({ pending: data.counts.pending, failed: data.counts.failed })
                }
            } catch {
                // Silently fail
            }
        }
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' })
            toast.success('Sessão encerrada')
            router.push('/login')
        } catch {
            toast.error('Erro ao encerrar sessão')
        }
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0d1117] border border-[#00ff41]/30 rounded-lg text-[#00ff41]"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full w-64 bg-[#0d1117]/95 backdrop-blur-md border-r border-[#00ff41]/30 z-40 transition-transform duration-300",
                "shadow-[5px_0_30px_rgba(0,255,65,0.1)]",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Animated border effect */}
                <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#00ff41] to-transparent opacity-50 animate-pulse" />

                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-[#00ff41]/20 relative">
                        {/* Radar scan effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-[#00ff41]/10 to-transparent animate-[radar-sweep_4s_ease-in-out_infinite]" />
                        </div>

                        <Link href="/admin/dashboard" className="flex items-center gap-3 relative">
                            <div className="p-2 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/30 pulse-green">
                                <Zap className="h-6 w-6 text-[#00ff41]" />
                            </div>
                            <div>
                                <h1 className="font-mono font-bold text-[#00ff41] neon-glow glitch" data-text="CARGO FLASH">
                                    CARGO FLASH
                                </h1>
                                <p className="text-[10px] font-mono text-[#00ff41]/50 tracking-[0.2em]">
                                    ADMIN CONTROL
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Status Bar */}
                    <div className="px-4 py-3 border-b border-[#00ff41]/10 font-mono text-xs bg-[#00ff41]/5">
                        <div className="flex items-center gap-2 text-[#00ff41]/70">
                            <span className="relative">
                                <span className="w-2 h-2 rounded-full bg-[#00ff41] block" />
                                <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
                            </span>
                            <span className="status-online">SISTEMA ATIVO</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[#00fff7]/70">
                            <Clock className="h-3 w-3" />
                            <span className="tabular-nums tracking-wider">{currentTime}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[#00ff41]/40 text-[9px]">
                            <span>▸ UPLINK: SECURE</span>
                        </div>
                    </div>

                    {/* Quick Search */}
                    <div className="px-4 py-3 border-b border-[#00ff41]/10">
                        <QuickSearch />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all duration-200",
                                        isActive
                                            ? "bg-[#00ff41]/10 text-[#00ff41] border-l-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                                            : "text-[#00ff41]/60 hover:text-[#00ff41] hover:bg-[#00ff41]/5"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                    {item.label === 'Entregas' && notifications.pending > 0 && (
                                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#ffb000]/20 text-[#ffb000] border border-[#ffb000]/30">
                                            {notifications.pending}
                                        </span>
                                    )}
                                    {item.label === 'Entregas' && notifications.failed > 0 && notifications.pending === 0 && (
                                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#ff0040]/20 text-[#ff0040] border border-[#ff0040]/30">
                                            {notifications.failed}
                                        </span>
                                    )}
                                    {isActive && !notifications.pending && !notifications.failed && (
                                        <span className="ml-auto text-[10px]">▌</span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-[#00ff41]/20">
                        {user && (
                            <div className="mb-4 p-3 rounded-lg bg-[#00ff41]/5 border border-[#00ff41]/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30">
                                        <Shield className="h-4 w-4 text-[#00ff41]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-[#00ff41] truncate">
                                            {user.full_name}
                                        </p>
                                        <p className="font-mono text-[10px] text-[#00ff41]/50 uppercase">
                                            {user.role.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            variant="matrixDanger"
                            className="w-full justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Encerrar Sessão
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}
