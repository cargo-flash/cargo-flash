import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { updateStatusSchema } from '@/lib/validations'
import { sendDeliveryNotification, getNotificationMessage, type NotificationConfig, type NotificationData } from '@/lib/notifications'

interface RouteParams {
    params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Aguardando Coleta',
    collected: 'Coletado',
    in_transit: 'Em Trânsito',
    out_for_delivery: 'Saiu para Entrega',
    delivered: 'Entregue',
    failed: 'Tentativa Falhou',
    returned: 'Devolvido',
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const { id } = await params
        const body = await request.json()

        // Validate input
        const validation = updateStatusSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { status, location, description, city, state, lat, lng } = validation.data
        const supabase = await createServiceClient()

        // Check if delivery exists
        const { data: existing } = await supabase
            .from('deliveries')
            .select('*')
            .eq('id', id)
            .single()

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Update delivery status
        const updateData: Record<string, unknown> = {
            status,
            current_location: location,
        }

        // If delivered, set delivered_at
        if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('deliveries')
            .update(updateData)
            .eq('id', id)

        if (updateError) {
            console.error('Update status error:', updateError)
            return NextResponse.json(
                { success: false, error: 'Erro ao atualizar status' },
                { status: 500 }
            )
        }

        // Create history entry
        const { error: historyError } = await supabase
            .from('delivery_history')
            .insert({
                delivery_id: id,
                status,
                location: location || 'Localização não informada',
                city: city || (location ? location.split(',')[0]?.trim() : 'N/A'),
                state: state || 'SP',
                lat,
                lng,
                description: description || `Status atualizado para ${status}`,
            })

        if (historyError) {
            console.error('History entry error:', historyError)
        }

        // Cancel pending scheduled events if manually updated to delivered
        if (status === 'delivered' || status === 'failed' || status === 'returned') {
            await supabase
                .from('scheduled_events')
                .delete()
                .eq('delivery_id', id)
                .eq('executed', false)
        }

        // Send notification if configured
        const { data: notifConfig } = await supabase
            .from('notification_config')
            .select('*')
            .single()

        if (notifConfig && notifConfig.enabled && existing.recipient_phone) {
            // Check if we should notify for this status
            const shouldNotify =
                (status === 'pending' && notifConfig.notify_on_created) ||
                (status === 'collected' && notifConfig.notify_on_collected) ||
                (status === 'in_transit' && notifConfig.notify_on_transit) ||
                (status === 'out_for_delivery' && notifConfig.notify_on_out_for_delivery) ||
                (status === 'delivered' && notifConfig.notify_on_delivered) ||
                (status === 'failed' && notifConfig.notify_on_failed)

            if (shouldNotify) {
                const config: NotificationConfig = {
                    provider: notifConfig.provider,
                    enabled: true,
                    zapi_instance_id: notifConfig.zapi_instance_id,
                    zapi_token: notifConfig.zapi_token,
                    twilio_account_sid: notifConfig.twilio_account_sid,
                    twilio_auth_token: notifConfig.twilio_auth_token,
                    twilio_phone_number: notifConfig.twilio_phone_number,
                    twilio_whatsapp_number: notifConfig.twilio_whatsapp_number,
                }

                const notifData: NotificationData = {
                    phone: existing.recipient_phone,
                    tracking_code: existing.tracking_code,
                    recipient_name: existing.recipient_name,
                    status,
                    status_label: STATUS_LABELS[status] || status,
                    current_location: location,
                    tracking_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/rastrear/${existing.tracking_code}`,
                }

                // Send notification (fire and forget)
                sendDeliveryNotification(config, notifData).then(result => {
                    // Log the notification
                    supabase.from('notification_logs').insert({
                        delivery_id: id,
                        phone: existing.recipient_phone,
                        message: getNotificationMessage(status, notifData),
                        provider: result.provider,
                        status: result.success ? 'sent' : 'failed',
                        external_id: result.messageId,
                        error: result.error,
                    })
                }).catch(console.error)
            }
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'update_status',
            resource_type: 'delivery',
            resource_id: id,
            details: {
                tracking_code: existing.tracking_code,
                old_status: existing.status,
                new_status: status,
                location,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Status atualizado com sucesso',
        })
    } catch (error) {
        console.error('Update status error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
