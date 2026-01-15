import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { wooCommerceWebhookSchema } from '@/lib/validations'
import { generateTrackingCode } from '@/lib/utils'
import { generateDeliveryEvents, estimateDeliveryDate } from '@/lib/simulation-engine'
import { format } from 'date-fns'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    const startTime = Date.now()
    console.log('[WooCommerce Webhook] Request received at', new Date().toISOString())

    try {
        // Verify API Key
        const apiKey = request.headers.get('x-api-key')
        console.log('[WooCommerce Webhook] API Key present:', !!apiKey)
        console.log('[WooCommerce Webhook] API Key prefix:', apiKey?.substring(0, 10) + '...')

        if (!apiKey) {
            console.log('[WooCommerce Webhook] ERROR: No API Key provided')
            return NextResponse.json(
                { success: false, error: 'API Key não fornecida' },
                { status: 401 }
            )
        }

        const supabase = await createServiceClient()

        // Find and verify API key
        const { data: keys, error: keysError } = await supabase
            .from('api_keys')
            .select('*')
            .eq('is_active', true)

        console.log('[WooCommerce Webhook] Active keys found:', keys?.length || 0)
        if (keysError) {
            console.log('[WooCommerce Webhook] Keys fetch error:', keysError.message)
        }

        let validKey = null
        for (const key of keys || []) {
            console.log('[WooCommerce Webhook] Checking key:', key.name, '- Hash prefix:', key.key_hash?.substring(0, 20) + '...')
            try {
                const isMatch = await bcrypt.compare(apiKey, key.key_hash)
                console.log('[WooCommerce Webhook] Key match result for', key.name, ':', isMatch)
                if (isMatch) {
                    validKey = key
                    break
                }
            } catch (bcryptError) {
                console.log('[WooCommerce Webhook] bcrypt error for key', key.name, ':', bcryptError)
            }
        }

        if (!validKey) {
            console.log('[WooCommerce Webhook] ERROR: No matching API key found')
            return NextResponse.json(
                { success: false, error: 'API Key inválida' },
                { status: 401 }
            )
        }

        console.log('[WooCommerce Webhook] Valid key found:', validKey.name)

        // Check expiration
        if (validKey.expires_at && new Date(validKey.expires_at) < new Date()) {
            console.log('[WooCommerce Webhook] ERROR: API Key expired')
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
        console.log('[WooCommerce Webhook] Request body:', JSON.stringify(body, null, 2))

        const validation = wooCommerceWebhookSchema.safeParse(body)

        if (!validation.success) {
            console.log('[WooCommerce Webhook] Validation error:', JSON.stringify(validation.error.flatten()))
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        console.log('[WooCommerce Webhook] Validation passed')

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
        const { data: config, error: configError } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        console.log('[WooCommerce Webhook] Config loaded:', !!config, configError?.message || 'OK')

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
        console.log('[WooCommerce Webhook] Generated tracking code:', trackingCode)

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

        console.log('[WooCommerce Webhook] Creating delivery...')

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
                destination_city: customer.address.city || 'Não informada',
                destination_state: customer.address.state || 'SP',
                destination_zip: customer.address.zip?.replace(/\D/g, ''),
                package_description: packageDescription,
                estimated_delivery: format(estimatedDelivery, 'yyyy-MM-dd'),
                current_location: `${originData.city}, ${originData.state}`,
            })
            .select()
            .single()

        if (createError || !delivery) {
            console.error('[WooCommerce Webhook] Create delivery error:', createError)
            return NextResponse.json(
                { success: false, error: 'Erro ao criar entrega: ' + (createError?.message || 'unknown') },
                { status: 500 }
            )
        }

        console.log('[WooCommerce Webhook] Delivery created:', delivery.id)

        // Create initial history
        await supabase.from('delivery_history').insert({
            delivery_id: delivery.id,
            status: 'pending',
            location: originData.company,
            city: originData.city,
            state: originData.state,
            lat: originData.lat,
            lng: originData.lng,
            description: 'Objeto postado - Aguardando coleta',
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
            console.log('[WooCommerce Webhook] Scheduled events created:', events.length)
        }

        // Log webhook success
        await supabase.from('webhook_logs').insert({
            source: 'woocommerce',
            endpoint: '/api/webhooks/woocommerce',
            method: 'POST',
            request_body: { order_id, customer: { name: customer.name, city: customer.address.city } },
            response_body: { tracking_code: trackingCode, delivery_id: delivery.id },
            status_code: 200,
            success: true,
            api_key_id: validKey.id,
        })

        const duration = Date.now() - startTime
        console.log('[WooCommerce Webhook] SUCCESS in', duration, 'ms - Tracking:', trackingCode)

        return NextResponse.json({
            success: true,
            tracking_code: trackingCode,
            delivery_id: delivery.id,
            estimated_delivery: format(estimatedDelivery, 'yyyy-MM-dd'),
            tracking_url: `https://cargoflash.com.br/rastrear/${trackingCode}`,
        })
    } catch (error) {
        console.error('[WooCommerce Webhook] FATAL ERROR:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno: ' + (error instanceof Error ? error.message : 'unknown') },
            { status: 500 }
        )
    }
}

// Also support GET for health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: 'WooCommerce Webhook',
        method: 'POST required',
        headers: { 'x-api-key': 'required' },
        body: { order_id: 'required', customer: 'required' },
    })
}
