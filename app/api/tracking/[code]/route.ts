import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface RouteParams {
    params: Promise<{ code: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { code } = await params

        if (!code || code.length < 8) {
            return NextResponse.json(
                { success: false, error: 'Código de rastreamento inválido' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Fetch delivery
        const { data: delivery, error: deliveryError } = await supabase
            .from('deliveries')
            .select('*')
            .eq('tracking_code', code.toUpperCase())
            .single()

        if (deliveryError || !delivery) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Fetch history
        const { data: history } = await supabase
            .from('delivery_history')
            .select('*')
            .eq('delivery_id', delivery.id)
            .order('created_at', { ascending: false })

        return NextResponse.json({
            success: true,
            delivery: {
                tracking_code: delivery.tracking_code,
                status: delivery.status,
                current_location: delivery.current_location,
                recipient_name: delivery.recipient_name,
                destination_city: delivery.destination_city,
                destination_state: delivery.destination_state,
                origin_city: delivery.origin_city,
                origin_state: delivery.origin_state,
                estimated_delivery: delivery.estimated_delivery,
                delivered_at: delivery.delivered_at,
                driver_name: delivery.driver_name,
                package_description: delivery.package_description,
                created_at: delivery.created_at,
            },
            history: history || [],
        })
    } catch (error) {
        console.error('Tracking API error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
