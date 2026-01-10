'use client'

import {
    ShoppingBag,
    Package,
    Store,
    ExternalLink,
    Receipt
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderIntegrationCardProps {
    // Use loose typing for delivery to support additional e-commerce fields
    delivery: {
        package_description?: string | null
        order_id?: string | null
        woocommerce_order_id?: string | null
        source?: string | null
        store_url?: string | null
        store_name?: string | null
        quantity?: number | null
        payment_reference?: string | null
        order_date?: string | null
    }
}

export function OrderIntegrationCard({ delivery }: OrderIntegrationCardProps) {
    // Check if this is a WooCommerce or other integration order
    const hasOrderInfo = delivery.order_id || delivery.woocommerce_order_id || delivery.source

    if (!hasOrderInfo) {
        return null
    }

    const orderId = delivery.woocommerce_order_id || delivery.order_id
    const source = delivery.source || 'unknown'

    // Determine platform
    const platformInfo: Record<string, { name: string; color: string; icon: typeof ShoppingBag }> = {
        woocommerce: { name: 'WooCommerce', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: ShoppingBag },
        shopify: { name: 'Shopify', color: 'text-green-600 bg-green-50 border-green-200', icon: ShoppingBag },
        api: { name: 'API', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Package },
        manual: { name: 'Manual', color: 'text-slate-600 bg-slate-50 border-slate-200', icon: Package },
        unknown: { name: 'E-commerce', color: 'text-slate-600 bg-slate-50 border-slate-200', icon: ShoppingBag }
    }

    const platform = platformInfo[source] || platformInfo.unknown
    const PlatformIcon = platform.icon

    return (
        <Card className="border border-slate-200/80 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    Pedido Original
                    <Badge variant="outline" className={`ml-auto text-xs ${platform.color}`}>
                        <PlatformIcon className="w-3 h-3 mr-1" />
                        {platform.name}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Order ID */}
                {orderId && (
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Número do Pedido</p>
                                    <p className="text-lg font-bold font-mono text-slate-800">#{orderId}</p>
                                </div>
                            </div>
                            {delivery.store_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <a href={delivery.store_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-1.5" />
                                        Ver Pedido
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Store Info */}
                {delivery.store_name && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            <Store className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Loja</p>
                            <p className="font-medium text-slate-700">{delivery.store_name}</p>
                        </div>
                    </div>
                )}

                {/* Product Info */}
                {delivery.package_description && (
                    <div className="border border-slate-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-4 h-4 text-slate-400" />
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                Produto
                            </p>
                        </div>
                        <p className="text-sm text-slate-700">{delivery.package_description}</p>

                        {/* Quantity if available */}
                        {delivery.quantity && delivery.quantity > 1 && (
                            <p className="text-xs text-slate-500 mt-2">
                                Quantidade: <span className="font-medium">{delivery.quantity} unidade(s)</span>
                            </p>
                        )}
                    </div>
                )}

                {/* Order Date */}
                {delivery.order_date && (
                    <div className="text-center pt-2">
                        <p className="text-xs text-slate-400">
                            Pedido realizado em {new Date(delivery.order_date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                )}

                {/* Notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        ℹ️ Para dúvidas sobre o pedido ou produto, contate a loja vendedora.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
