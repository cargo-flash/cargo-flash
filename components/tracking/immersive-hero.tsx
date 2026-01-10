'use client'

import {
    Package,
    CheckCircle2,
    Truck,
    MapPin,
    User,
    Navigation,
    Building2,
    Circle
} from 'lucide-react'

interface ImmersiveHeroProps {
    status: string
    trackingCode: string
    estimatedDelivery?: string | null
    createdAt?: string | null
    destinationCity: string
    destinationState?: string
    originCity?: string
    originState?: string
    recipientName?: string | null
    currentLocation?: string | null
    progressPercent?: number
}

const statusConfig: Record<string, {
    title: string
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
    headerBg: string
    statusColor: string
}> = {
    pending: {
        title: 'Aguardando Coleta',
        subtitle: 'Sua encomenda está sendo preparada para envio',
        icon: Package,
        headerBg: 'bg-slate-700',
        statusColor: 'text-slate-700'
    },
    collected: {
        title: 'Coletado',
        subtitle: 'Encomenda coletada e em processamento',
        icon: Package,
        headerBg: 'bg-[#1e3a5f]',
        statusColor: 'text-[#1e3a5f]'
    },
    in_transit: {
        title: 'Em Trânsito',
        subtitle: 'Sua encomenda está a caminho do destino',
        icon: Truck,
        headerBg: 'bg-[#1e3a5f]',
        statusColor: 'text-[#1e3a5f]'
    },
    out_for_delivery: {
        title: 'Saiu para Entrega',
        subtitle: 'O entregador está se deslocando até você',
        icon: Navigation,
        headerBg: 'bg-[#b45309]',
        statusColor: 'text-[#b45309]'
    },
    delivered: {
        title: 'Entregue',
        subtitle: 'Encomenda entregue com sucesso ao destinatário',
        icon: CheckCircle2,
        headerBg: 'bg-[#166534]',
        statusColor: 'text-[#166534]'
    },
    failed: {
        title: 'Tentativa de Entrega',
        subtitle: 'Não foi possível realizar a entrega — ação necessária',
        icon: MapPin,
        headerBg: 'bg-[#c2410c]',
        statusColor: 'text-[#c2410c]'
    },
    returned: {
        title: 'Devolvido ao Remetente',
        subtitle: 'Encomenda retornou ao ponto de origem',
        icon: Package,
        headerBg: 'bg-slate-700',
        statusColor: 'text-slate-700'
    }
}

export function ImmersiveHero({
    status,
    trackingCode,
    destinationCity,
    destinationState = '',
    originCity = 'São Paulo',
    originState = 'SP',
    recipientName,
    currentLocation,
    progressPercent
}: ImmersiveHeroProps) {
    const config = statusConfig[status] || statusConfig.pending
    const StatusIcon = config.icon

    // Use real progressPercent from history, fallback to status-based defaults
    const getDefaultProgress = (s: string): number => {
        switch (s) {
            case 'pending': return 0
            case 'collected': return 10
            case 'in_transit': return 50
            case 'out_for_delivery': return 95
            case 'delivered': return 100
            case 'failed': return 85
            default: return 0
        }
    }
    const progressPosition = progressPercent ?? getDefaultProgress(status)

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header with Status */}
            <div className={`${config.headerBg} px-4 sm:px-6 py-4 sm:py-5`}>
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg sm:text-xl font-bold text-white">
                                {config.title}
                            </h1>
                            {status === 'in_transit' && (
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                            )}
                        </div>
                        <p className="text-white/80 text-sm mt-0.5">
                            {config.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Tracking Code */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                        Código de Rastreamento
                    </p>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-slate-800 tracking-wide break-all">
                        {trackingCode.toUpperCase()}
                    </p>
                </div>

                {/* Route Visualization */}
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">
                        Trajeto da Entrega
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0">
                        {/* Origin */}
                        <div className="flex-shrink-0 sm:w-32">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-slate-600" />
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Origem</span>
                            </div>
                            <p className="font-semibold text-slate-800">{originCity}</p>
                            <p className="text-xs text-slate-500">{originState}</p>
                        </div>

                        {/* Progress Line */}
                        <div className="flex-1 py-4 sm:pt-4 sm:pb-0 px-0 sm:px-4 order-last sm:order-none">
                            <div className="relative">
                                {/* Background line */}
                                <div className="h-1 bg-slate-200 rounded-full" />

                                {/* Active line */}
                                <div
                                    className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-700 ${config.headerBg}`}
                                    style={{ width: `${progressPosition}%` }}
                                />

                                {/* Start dot */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-white shadow-sm" />

                                {/* Current position indicator */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
                                    style={{ left: `${progressPosition}%` }}
                                >
                                    <div className={`w-8 h-8 rounded-full ${config.headerBg} flex items-center justify-center shadow-lg border-2 border-white`}>
                                        <Truck className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* End dot */}
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm ${status === 'delivered' ? 'bg-emerald-500' : 'bg-slate-300'
                                    }`} />
                            </div>

                            {/* Current Location */}
                            {currentLocation && status === 'in_transit' && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                                    <Navigation className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-600">Localização: <strong className="text-slate-800">{currentLocation}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Destination */}
                        <div className="flex-shrink-0 sm:w-32 text-left sm:text-right">
                            <div className="flex items-center sm:justify-end gap-2 mb-1">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider order-last sm:order-first">Destino</span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status === 'delivered' ? 'bg-emerald-100' : 'bg-slate-100'
                                    }`}>
                                    {status === 'delivered' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <MapPin className="w-4 h-4 text-slate-600" />
                                    )}
                                </div>
                            </div>
                            <p className="font-semibold text-slate-800">{destinationCity}</p>
                            <p className="text-xs text-slate-500">{destinationState}</p>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Destino</p>
                                <p className="font-semibold text-slate-800">{destinationCity}, {destinationState}</p>
                            </div>
                        </div>
                    </div>

                    {recipientName && (
                        <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Destinatário</p>
                                    <p className="font-semibold text-slate-800 truncate">{recipientName}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
