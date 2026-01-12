import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { wooCommerceWebhookSchema } from '@/lib/validations'
import { generateTrackingCode } from '@/lib/utils'
import { generateDeliveryEvents, estimateDeliveryDate } from '@/lib/simulation-engine'
import { format } from 'date-fns'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        // Verify API Key
        const apiKey = request.headers.get('x-api-key')

        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'API Key não fornecida' },
                { status: 401 }
            )
        }

        const supabase = await createServiceClient()

        // Find and verify API key
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

        // Check expiration
        if (validKey.expires_at && new Date(validKey.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, error: 'API Key expirada' },
                { status: 401 }
            )
        }

        // Update last used
        await supabase
            .from('api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', validKey.id)

        // Parse and validate body
        const body = await request.json()
        const validation = wooCommerceWebhookSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { order_id, customer, items, total, origin } = validation.data

        // Try to get warehouse for this API key
        const { data: warehouse } = await supabase
            .from('warehouses')
            .select('*')
            .eq('api_key_id', validKey.id)
            .eq('is_default', true)
            .eq('is_active', true)
            .single()

        // Get simulation config as fallback
        const { data: config } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        // Determine origin with priority: 1. Warehouse, 2. Request origin, 3. Simulation config
        const originData = {
            company: warehouse?.name || origin?.company || config?.origin_company_name || 'Cargo Flash',
            address: warehouse?.address || origin?.address || config?.origin_address || '',
            city: warehouse?.city || origin?.city || config?.origin_city || 'São Paulo',
            state: warehouse?.state || origin?.state || config?.origin_state || 'SP',
            zip: warehouse?.zip || origin?.zip || config?.origin_zip || '',
            lat: warehouse?.lat || config?.origin_lat || -23.5505,
            lng: warehouse?.lng || config?.origin_lng || -46.6333,
        }

        // Generate tracking code
        const trackingCode = generateTrackingCode()

        // Calculate estimated delivery
        const estimatedDelivery = estimateDeliveryDate(
            config as never,
            customer.address.city,
            customer.address.state
        )

        // Build package description from items
        const packageDescription = items
            ?.map((item) => `${item.quantity}x ${item.name}`)
            .join(', ') || `Pedido #${order_id}`

        // Create delivery
        const { data: delivery, error: createError } = await supabase
            .from('deliveries')
            .insert({
                tracking_code: trackingCode,
                status: 'pending',
                sender_name: originData.company,
                origin_address: originData.address,
                origin_city: originData.city,
                origin_state: originData.state,
                origin_zip: originData.zip,
                origin_lat: originData.lat,
                origin_lng: originData.lng,
                recipient_name: customer.name,
                recipient_email: customer.email,
                recipient_phone: customer.phone,
                destination_address: `${customer.address.street}${customer.address.complement ? `, ${customer.address.complement}` : ''}`,
                destination_city: customer.address.city,
                destination_state: customer.address.state,
                destination_zip: customer.address.zip?.replace(/\D/g, ''),
                package_description: packageDescription,
                estimated_delivery: format(estimatedDelivery, 'yyyy-MM-dd'),
                current_location: `${config?.origin_city || 'São Paulo'}, ${config?.origin_state || 'SP'}`,
                insurance_value: total || 0,
            })
            .select()
            .single()

        if (createError || !delivery) {
            console.error('Create delivery error:', createError)
            return NextResponse.json(
                { success: false, error: 'Erro ao criar entrega' },
                { status: 500 }
            )
        }

        // Create initial history
        await supabase.from('delivery_history').insert({
            delivery_id: delivery.id,
            status: 'pending',
            location: originData.company,
            city: originData.city,
            state: originData.state,
            lat: originData.lat,
            lng: originData.lng,
            description: `Pedido #${order_id} recebido via WooCommerce`,
        })

        // Generate simulation events using originData with config as fallback for timing
        const simulationConfig = {
            origin_city: originData.city,
            origin_state: originData.state,
            origin_lat: originData.lat,
            origin_lng: originData.lng,
            min_delivery_days: config?.min_delivery_days ?? 15,
            max_delivery_days: config?.max_delivery_days ?? 19,
        }

        const events = generateDeliveryEvents(delivery, simulationConfig as never)
        if (events.length > 0) {
            await supabase.from('scheduled_events').insert(events)
        }

        // Log webhook success (fire and forget)
        supabase.from('webhook_logs').insert({
            source: 'woocommerce',
            endpoint: '/api/webhooks/woocommerce',
            method: 'POST',
            request_body: { order_id, customer: { name: customer.name, city: customer.address.city } },
            response_body: { tracking_code: trackingCode, delivery_id: delivery.id },
            status_code: 200,
            success: true,
            api_key_id: validKey.id,
        })

        return NextResponse.json({
            success: true,
            tracking_code: trackingCode,
            delivery_id: delivery.id,
            estimated_delivery: format(estimatedDelivery, 'yyyy-MM-dd'),
        })
    } catch (error) {
        console.error('WooCommerce webhook error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno' },
            { status: 500 }
        )
    }
}
