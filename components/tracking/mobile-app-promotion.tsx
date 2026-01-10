'use client'

import {
    Smartphone,
    Bell,
    MapPin,
    Zap,
    QrCode,
    Download,
    Star
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MobileAppPromotionProps {
    trackingCode: string
}

export function MobileAppPromotion({ trackingCode }: MobileAppPromotionProps) {
    const appStoreUrl = 'https://apps.apple.com/app/cargo-flash'
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cargoflash'

    const features = [
        { icon: Bell, label: 'Notificações push em tempo real' },
        { icon: MapPin, label: 'Rastreamento ao vivo no mapa' },
        { icon: Zap, label: 'Acesso offline ao histórico' },
    ]

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <CardContent className="p-5 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">App Cargo Flash</h3>
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                                <span className="text-slate-400 ml-1">4.9</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-5">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span>{feature.label}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Download Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <a
                            href={appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            App Store
                        </a>
                        <a
                            href={playStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            Google Play
                        </a>
                    </div>

                    {/* QR Code Hint */}
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <QrCode className="w-4 h-4" />
                        <span>Ou escaneie o QR Code acima para baixar</span>
                    </div>

                    {/* Deep Link */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs text-slate-400">
                            Seu código <span className="font-mono text-white">{trackingCode.toUpperCase()}</span> será importado automaticamente
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
