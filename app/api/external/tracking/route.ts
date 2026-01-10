import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

// External tracking API for WooCommerce and other integrations
// GET /api/external/tracking?code=CF123456789BR&api_key=xxx

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const apiKey = searchParams.get('api_key')

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'Código de rastreamento não fornecido' },
                { status: 400 }
            )
        }

        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'API Key não fornecida' },
                { status: 401 }
            )
        }

        const supabase = await createServiceClient()

        // Verify API key
        const { data: keys } = await supabase
            .from('api_keys')
            .select('*')
            .eq('is_active', true)

        let validKey = null
        for (const key of keys || []) {
            if (await bcrypt.compare(apiKey, key.key_hash)) {
                validKey = key
                break
            }
        }

        if (!validKey) {
            return NextResponse.json(
                { success: false, error: 'API Key inválida' },
                { status: 401 }
            )
        }

        // Update last used
        await supabase
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', validKey.id)

        // Get delivery
        const { data: delivery, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('tracking_code', code.toUpperCase())
            .single()

        if (error || !delivery) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Get history
        const { data: history } = await supabase
            .from('delivery_history')
            .select('*')
            .eq('delivery_id', delivery.id)
            .order('created_at', { ascending: true })

        // Format response for external systems
        return NextResponse.json({
            success: true,
            tracking: {
                code: delivery.tracking_code,
                status: delivery.status,
                status_label: getStatusLabel(delivery.status),
                recipient: delivery.recipient_name,
                destination: {
                    city: delivery.destination_city,
                    state: delivery.destination_state,
                },
                estimated_delivery: delivery.estimated_delivery,
                delivered_at: delivery.delivered_at,
                current_location: delivery.current_location,
                created_at: delivery.created_at,
                updated_at: delivery.updated_at,
            },
            history: (history || []).map(h => ({
                status: h.status,
                status_label: getStatusLabel(h.status),
                location: h.location,
                city: h.city,
                state: h.state,
                description: h.description,
                timestamp: h.created_at,
            })),
            tracking_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/rastrear/${delivery.tracking_code}`,
        })
    } catch (error) {
        console.error('External tracking API error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno' },
            { status: 500 }
        )
    }
}

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Aguardando Coleta',
        collected: 'Coletado',
        in_transit: 'Em Trânsito',
        out_for_delivery: 'Saiu para Entrega',
        delivered: 'Entregue',
        failed: 'Tentativa de Entrega Falhou',
        returned: 'Devolvido ao Remetente',
    }
    return labels[status] || status
}
