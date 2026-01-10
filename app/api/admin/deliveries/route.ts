import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { createDeliverySchema } from '@/lib/validations'
import { generateTrackingCode } from '@/lib/utils'
import { generateDeliveryEvents, estimateDeliveryDate } from '@/lib/simulation-engine'
import { getNotificationConfig, sendDeliveryNotification, formatPhoneForWhatsApp } from '@/lib/notifications'
import { format } from 'date-fns'

// GET - List deliveries with pagination and filters
export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('per_page') || '20')
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sort_by') || 'created_at'
        const sortOrder = searchParams.get('sort_order') || 'desc'

        const supabase = await createServiceClient()

        let query = supabase
            .from('deliveries')
            .select('*', { count: 'exact' })

        // Filters
        if (status) {
            query = query.eq('status', status)
        }

        if (search) {
            query = query.or(`tracking_code.ilike.%${search}%,recipient_name.ilike.%${search}%,destination_city.ilike.%${search}%`)
        }

        // Sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        // Pagination
        const from = (page - 1) * perPage
        const to = from + perPage - 1
        query = query.range(from, to)

        const { data, count, error } = await query

        if (error) {
            console.error('Deliveries list error:', error)
            return NextResponse.json(
                { success: false, error: 'Erro ao listar entregas' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            total: count || 0,
            page,
            per_page: perPage,
            total_pages: Math.ceil((count || 0) / perPage),
        })
    } catch (error) {
        console.error('Deliveries API error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// POST - Create new delivery
export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success) return auth.response!

        const body = await request.json()

        // Validate input
        const validation = createDeliverySchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data
        const supabase = await createServiceClient()

        // Get simulation config
        const { data: config } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        // Generate tracking code
        const trackingCode = generateTrackingCode()

        // Calculate estimated delivery
        const estimatedDelivery = data.estimated_delivery
            ? new Date(data.estimated_delivery)
            : estimateDeliveryDate(
                config || {
                    origin_city: 'São Paulo',
                    origin_state: 'SP',
                    origin_lat: -23.5505,
                    origin_lng: -46.6333,
                    min_delivery_days: 15,
                    max_delivery_days: 19,
                } as never,
                data.destination_city,
                data.destination_state
            )

        // Create delivery
        const { data: delivery, error: createError } = await supabase
            .from('deliveries')
            .insert({
                tracking_code: trackingCode,
                status: 'pending',
                sender_name: data.sender_name || config?.origin_company_name,
                sender_email: data.sender_email,
                sender_phone: data.sender_phone,
                origin_address: data.origin_address || config?.origin_address,
                origin_city: data.origin_city || config?.origin_city,
                origin_state: data.origin_state || config?.origin_state,
                origin_zip: data.origin_zip || config?.origin_zip,
                origin_lat: config?.origin_lat,
                origin_lng: config?.origin_lng,
                recipient_name: data.recipient_name,
                recipient_email: data.recipient_email,
                recipient_phone: data.recipient_phone,
                destination_address: data.destination_address,
                destination_city: data.destination_city,
                destination_state: data.destination_state,
                destination_zip: data.destination_zip,
                package_description: data.package_description,
                package_weight: data.package_weight,
                estimated_delivery: format(estimatedDelivery, 'yyyy-MM-dd'),
                current_location: `${config?.origin_city || 'São Paulo'}, ${config?.origin_state || 'SP'}`,
            })
            .select()
            .single()

        if (createError || !delivery) {
            console.error('Create delivery error:', {
                error: createError,
                code: createError?.code,
                message: createError?.message,
                details: createError?.details,
                hint: createError?.hint
            })
            return NextResponse.json(
                {
                    success: false,
                    error: 'Erro ao criar entrega',
                    debug: createError?.message || 'Unknown error'
                },
                { status: 500 }
            )
        }

        // Create initial history entry
        await supabase.from('delivery_history').insert({
            delivery_id: delivery.id,
            status: 'pending',
            location: config?.origin_company_name || 'Centro de Distribuição',
            city: config?.origin_city || 'São Paulo',
            state: config?.origin_state || 'SP',
            lat: config?.origin_lat,
            lng: config?.origin_lng,
            description: 'Pedido recebido no sistema. Aguardando coleta.',
        })

        // Generate simulation events if auto_simulate is true
        if (data.auto_simulate !== false && config) {
            const events = generateDeliveryEvents(delivery, config)

            if (events.length > 0) {
                await supabase.from('scheduled_events').insert(events)
            }
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'create_delivery',
            resource_type: 'delivery',
            resource_id: delivery.id,
            details: { tracking_code: trackingCode },
        })

        // Send notification if phone is present
        let notificationSent = false
        if (delivery.recipient_phone) {
            try {
                const notifConfig = await getNotificationConfig(supabase)
                if (notifConfig.enabled && notifConfig.notify_on_create) {
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                    const result = await sendDeliveryNotification(notifConfig, {
                        phone: delivery.recipient_phone,
                        tracking_code: trackingCode,
                        recipient_name: delivery.recipient_name,
                        status: 'pending',
                        status_label: 'Aguardando Coleta',
                        estimated_delivery: delivery.estimated_delivery ? format(new Date(delivery.estimated_delivery), 'dd/MM/yyyy') : undefined,
                        tracking_url: `${baseUrl}/rastrear/${trackingCode}`,
                    })

                    notificationSent = result.success

                    // Log notification
                    await supabase.from('notification_logs').insert({
                        delivery_id: delivery.id,
                        phone: formatPhoneForWhatsApp(delivery.recipient_phone),
                        channel: notifConfig.preferred_channel || 'whatsapp',
                        provider: result.provider,
                        message_id: result.messageId,
                        status: result.success ? 'sent' : 'failed',
                        error_message: result.error,
                    })
                }
            } catch (notifError) {
                console.error('Notification error:', notifError)
                // Don't fail the delivery creation if notification fails
            }
        }

        return NextResponse.json({
            success: true,
            delivery,
            message: 'Entrega criada com sucesso',
            notification_sent: notificationSent,
        })
    } catch (error) {
        console.error('Create delivery error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
