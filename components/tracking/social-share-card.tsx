'use client'

import {
    Share2,
    Copy,
    Check,
    Twitter,
    Facebook,
    Linkedin,
    MessageCircle,
    Link2,
    QrCode
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface SocialShareCardProps {
    trackingCode: string
    status: string
}

export function SocialShareCard({ trackingCode, status }: SocialShareCardProps) {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showQR, setShowQR] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cargoflash.com.br'}/rastrear/${trackingCode}`
    const shareText = `🚚 Acompanhe minha entrega Cargo Flash!\n📦 Código: ${trackingCode.toUpperCase()}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-emerald-500 hover:bg-emerald-600',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Compartilhar Rastreamento</h3>
                        <p className="text-sm text-slate-500">Envie o link para quem precisa acompanhar</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Copy Link */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <Link2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 bg-transparent text-sm text-slate-600 outline-none truncate"
                        />
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                            ${copied
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }
                        `}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                {/* Social Buttons */}
                <div>
                    <p className="text-sm text-slate-500 mb-3">Compartilhar via</p>
                    <div className="grid grid-cols-4 gap-3">
                        {shareOptions.map((option) => {
                            const Icon = option.icon
                            return (
                                <a
                                    key={option.name}
                                    href={option.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                        flex flex-col items-center gap-2 p-4 rounded-2xl text-white transition-all
                                        hover:scale-105 hover:shadow-lg ${option.color}
                                    `}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-xs font-medium">{option.name}</span>
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* QR Code Toggle */}
                <div>
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                        <QrCode className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-600">
                            {showQR ? 'Ocultar QR Code' : 'Mostrar QR Code'}
                        </span>
                    </button>

                    {showQR && (
                        <div className="mt-4 p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-32 h-32 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                                <QrCode className="w-20 h-20 text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-500 mt-3">
                                Escaneie para rastrear
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
