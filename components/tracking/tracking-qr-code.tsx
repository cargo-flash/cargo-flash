'use client'

import { useState } from 'react'
import { QrCode, Download, Copy, Check } from 'lucide-react'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getShareUrl, copyToClipboard } from '@/lib/utils'

interface TrackingQRCodeProps {
    code: string
}

export function TrackingQRCode({ code }: TrackingQRCodeProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl = getShareUrl(code)

    const handleCopy = async () => {
        const success = await copyToClipboard(shareUrl)
        if (success) {
            setCopied(true)
            toast.success('Link copiado!')
            setTimeout(() => setCopied(false), 2000)
        } else {
            toast.error('Erro ao copiar link')
        }
    }

    const handleDownload = () => {
        const svg = document.getElementById('tracking-qr-code')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)

            const pngUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `rastreamento-${code}.png`
            link.href = pngUrl
            link.click()

            toast.success('QR Code baixado!')
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code de Rastreamento</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-6">
                    <div className="bg-white p-4 rounded-xl shadow-lg border">
                        <QRCode
                            id="tracking-qr-code"
                            value={shareUrl}
                            size={200}
                            level="H"
                        />
                    </div>

                    <p className="mt-4 font-mono text-lg font-bold text-slate-900">
                        {code.toUpperCase()}
                    </p>

                    <p className="text-sm text-slate-500 text-center mt-2">
                        Escaneie o código para rastrear a entrega
                    </p>

                    <div className="flex gap-2 mt-6 w-full">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copiar Link
                                </>
                            )}
                        </Button>
                        <Button
                            variant="default"
                            className="flex-1"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
