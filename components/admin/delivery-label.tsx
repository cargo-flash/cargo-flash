'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { QRCodeSVG } from 'qrcode.react'
import type { Delivery } from '@/lib/types'

interface DeliveryLabelProps {
    delivery: Delivery
}

export function DeliveryLabel({ delivery }: DeliveryLabelProps) {
    const trackingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rastrear/${delivery.tracking_code}`

    return (
        <div className="bg-white text-black p-6 font-sans" style={{ width: '400px' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold">CARGO FLASH</h1>
                    <p className="text-xs text-gray-600">Sistema de Entregas Rápidas</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-600">Data de Emissão</p>
                    <p className="font-semibold">
                        {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                </div>
            </div>

            {/* Tracking Code */}
            <div className="bg-gray-100 p-4 mb-4 text-center">
                <p className="text-xs text-gray-600 mb-1">CÓDIGO DE RASTREIO</p>
                <p className="text-2xl font-mono font-bold tracking-widest">{delivery.tracking_code}</p>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Sender */}
                <div className="border border-gray-300 p-3">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">Remetente</p>
                    <p className="font-semibold text-sm">{delivery.sender_name || 'Cargo Flash'}</p>
                    <p className="text-xs text-gray-700">{delivery.origin_address}</p>
                    <p className="text-xs text-gray-700">
                        {delivery.origin_city}, {delivery.origin_state}
                    </p>
                    <p className="text-xs text-gray-700">CEP: {delivery.origin_zip}</p>
                </div>

                {/* Recipient */}
                <div className="border-2 border-black p-3">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">Destinatário</p>
                    <p className="font-bold text-sm">{delivery.recipient_name}</p>
                    <p className="text-xs text-gray-700">{delivery.destination_address}</p>
                    <p className="text-xs text-gray-700">
                        {delivery.destination_city}, {delivery.destination_state}
                    </p>
                    <p className="text-xs text-gray-700">CEP: {delivery.destination_zip}</p>
                    {delivery.recipient_phone && (
                        <p className="text-xs text-gray-700 mt-1">Tel: {delivery.recipient_phone}</p>
                    )}
                </div>
            </div>

            {/* Package Info */}
            {delivery.package_description && (
                <div className="border border-gray-300 p-3 mb-4">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-1">Conteúdo</p>
                    <p className="text-sm">{delivery.package_description}</p>
                    {delivery.package_weight && (
                        <p className="text-xs text-gray-600 mt-1">Peso: {delivery.package_weight}kg</p>
                    )}
                </div>
            )}

            {/* QR Code and Info */}
            <div className="flex justify-between items-end">
                <div className="bg-white p-2 border border-gray-300">
                    <QRCodeSVG value={trackingUrl} size={80} />
                </div>
                <div className="text-right text-xs text-gray-600">
                    {delivery.estimated_delivery && (
                        <p>
                            Previsão: <strong className="text-black">
                                {format(new Date(delivery.estimated_delivery), "dd/MM/yyyy", { locale: ptBR })}
                            </strong>
                        </p>
                    )}
                    <p className="mt-1">Escaneie para rastrear</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-300 text-center">
                <p className="text-xs text-gray-500">
                    {trackingUrl}
                </p>
            </div>
        </div>
    )
}

// Print function
export function printDeliveryLabel(delivery: Delivery) {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Etiqueta - ${delivery.tracking_code}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            @page { margin: 10mm; size: 105mm 148mm; }
            body { margin: 0; }
        }
        body { font-family: system-ui, -apple-system, sans-serif; }
        .tracking-widest { letter-spacing: 0.25em; }
    </style>
</head>
<body class="p-4">
    <div class="border-2 border-black p-4" style="width: 100%; max-width: 380px;">
        <div class="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
            <div>
                <h1 class="text-xl font-bold">CARGO FLASH</h1>
                <p class="text-[10px] text-gray-600">Entregas Rápidas</p>
            </div>
            <div class="text-right text-[10px]">
                <p>${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
        
        <div class="bg-gray-100 p-3 mb-3 text-center">
            <p class="text-[10px] text-gray-600">RASTREIO</p>
            <p class="text-lg font-mono font-bold tracking-widest">${delivery.tracking_code}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-3 text-[10px]">
            <div class="border border-gray-400 p-2">
                <p class="font-bold text-gray-600 mb-1">DE:</p>
                <p class="font-semibold">${delivery.sender_name || 'Cargo Flash'}</p>
                <p>${delivery.origin_city}, ${delivery.origin_state}</p>
            </div>
            <div class="border-2 border-black p-2">
                <p class="font-bold text-gray-600 mb-1">PARA:</p>
                <p class="font-bold">${delivery.recipient_name}</p>
                <p>${delivery.destination_address || ''}</p>
                <p>${delivery.destination_city}, ${delivery.destination_state}</p>
                <p>CEP: ${delivery.destination_zip}</p>
            </div>
        </div>
        
        <div class="text-center text-[10px] text-gray-600">
            <p>Escaneie o QR Code ou acesse:</p>
            <p class="font-mono">${typeof window !== 'undefined' ? window.location.origin : ''}/rastrear/${delivery.tracking_code}</p>
        </div>
    </div>
    <script>window.onload = () => window.print();</script>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
}
