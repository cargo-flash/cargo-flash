'use client'

import {
    Share2,
    Copy,
    Check,
    MessageCircle,
    Facebook,
    Twitter,
    Mail,
    Link as LinkIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useMemo } from 'react'

interface ShareCardProps {
    trackingCode: string
}

export function ShareCard({ trackingCode }: ShareCardProps) {
    const [copied, setCopied] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [trackingUrl, setTrackingUrl] = useState(`/rastrear/${trackingCode}`)

    // Set full URL after mount to avoid hydration mismatch
    useEffect(() => {
        setTrackingUrl(`${window.location.origin}/rastrear/${trackingCode}`)
    }, [trackingCode])

    const shareText = `Acompanhe minha entrega: ${trackingCode.toUpperCase()}`

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(trackingUrl)
            setCopiedLink(true)
            setTimeout(() => setCopiedLink(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(trackingCode.toUpperCase())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // Memoize share links to update when trackingUrl changes
    const shareLinks = useMemo(() => ({
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`🚚 ${shareText}\n🔗 ${trackingUrl}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackingUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(trackingUrl)}`,
        email: `mailto:?subject=${encodeURIComponent('Rastreamento de Entrega')}&body=${encodeURIComponent(`${shareText}\n\n${trackingUrl}`)}`
    }), [trackingUrl, shareText])

    const socialButtons = [
        {
            key: 'whatsapp',
            href: shareLinks.whatsapp,
            icon: MessageCircle,
            label: 'WhatsApp',
            bgColor: 'bg-emerald-500',
            hoverBg: 'hover:bg-emerald-600',
            containerBg: 'bg-emerald-50',
            containerHover: 'hover:bg-emerald-100',
            textColor: 'text-emerald-700'
        },
        {
            key: 'facebook',
            href: shareLinks.facebook,
            icon: Facebook,
            label: 'Facebook',
            bgColor: 'bg-blue-600',
            hoverBg: 'hover:bg-blue-700',
            containerBg: 'bg-blue-50',
            containerHover: 'hover:bg-blue-100',
            textColor: 'text-blue-700'
        },
        {
            key: 'twitter',
            href: shareLinks.twitter,
            icon: Twitter,
            label: 'Twitter',
            bgColor: 'bg-sky-500',
            hoverBg: 'hover:bg-sky-600',
            containerBg: 'bg-sky-50',
            containerHover: 'hover:bg-sky-100',
            textColor: 'text-sky-700'
        },
        {
            key: 'email',
            href: shareLinks.email,
            icon: Mail,
            label: 'E-mail',
            bgColor: 'bg-slate-500',
            hoverBg: 'hover:bg-slate-600',
            containerBg: 'bg-slate-50',
            containerHover: 'hover:bg-slate-100',
            textColor: 'text-slate-700'
        }
    ]

    return (
        <div className="premium-card overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Compartilhar Rastreio</h3>
            </div>

            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                {/* Tracking Code Display */}
                <div className="bg-slate-50 rounded-xl p-4 sm:p-5 text-center border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Código de Rastreamento</p>
                    <p className="text-lg sm:text-2xl font-bold font-mono text-slate-800 tracking-widest select-all break-all">
                        {trackingCode.toUpperCase()}
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`mt-3 font-semibold transition-all ${copied
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                        onClick={handleCopyCode}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1.5" />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1.5" />
                                Copiar código
                            </>
                        )}
                    </Button>
                </div>

                {/* Social Share Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {socialButtons.map((social) => {
                        const Icon = social.icon
                        return (
                            <a
                                key={social.key}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${social.containerBg} ${social.containerHover}`}
                            >
                                <div className={`w-11 h-11 rounded-full ${social.bgColor} ${social.hoverBg} flex items-center justify-center shadow-lg transition-colors`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-[10px] font-semibold ${social.textColor}`}>{social.label}</span>
                            </a>
                        )
                    })}
                </div>

                {/* Copy Link Button */}
                <Button
                    variant="outline"
                    className={`w-full h-11 font-semibold transition-all ${copiedLink
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    onClick={handleCopyLink}
                >
                    {copiedLink ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Link copiado!
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Copiar link de rastreamento
                        </>
                    )}
                </Button>

                {/* Info */}
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Envie este link para que outras pessoas acompanhem sua entrega
                </p>
            </div>
        </div>
    )
}
