import { createServiceClient } from '@/lib/supabase/server'
import {
    sendWhatsAppMessage,
    getNotificationMessage,
    statusToNotificationType,
    type WhatsAppConfig,
    type DeliveryNotificationData
} from '@/lib/whatsapp-service'

interface Delivery {
    id: string
    tracking_code: string
    status: string
    recipient_name: string
    recipient_phone?: string
    current_location?: string
    estimated_delivery?: string
}

/**
 * Send WhatsApp notification for a delivery status change
 */
export async function sendDeliveryNotification(
    delivery: Delivery,
    newStatus: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Get WhatsApp config
        const supabase = await createServiceClient()

        const { data: configData } = await supabase
            .from('whatsapp_config')
            .select('*')
            .single()

        if (!configData || configData.provider === 'disabled') {
            return { success: false, error: 'WhatsApp desativado' }
        }

        // Check if we should notify for this status
        const statusNotifyMap: Record<string, string> = {
            'pending': 'notify_on_received',
            'collected': 'notify_on_collected',
            'in_transit': 'notify_on_in_transit',
            'out_for_delivery': 'notify_on_out_for_delivery',
            'delivered': 'notify_on_delivered',
        }

        const notifyField = statusNotifyMap[newStatus]
        if (notifyField && !configData[notifyField]) {
            return { success: false, error: 'Notificação desativada para este status' }
        }

        // Check if delivery has phone number
        if (!delivery.recipient_phone) {
            return { success: false, error: 'Destinatário sem telefone' }
        }

        // Get notification type
        const notificationType = statusToNotificationType(newStatus)
        if (!notificationType) {
            return { success: false, error: 'Status não tem notificação' }
        }

        // Build tracking URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cargoflash.com.br'
        const trackingUrl = `${appUrl}/rastrear/${delivery.tracking_code}`

        // Build notification data
        const notificationData: DeliveryNotificationData = {
            trackingCode: delivery.tracking_code,
            recipientName: delivery.recipient_name || 'Cliente',
            status: newStatus,
            currentLocation: delivery.current_location,
            estimatedDelivery: delivery.estimated_delivery,
            trackingUrl,
        }

        // Get message
        const message = getNotificationMessage(notificationType, notificationData)

        // Build config
        const config: WhatsAppConfig = {
            provider: configData.provider,
            zApiInstanceId: configData.z_api_instance_id,
            zApiToken: configData.z_api_token,
            zApiSecurityToken: configData.z_api_security_token,
            evolutionApiUrl: configData.evolution_api_url,
            evolutionApiKey: configData.evolution_api_key,
            evolutionInstance: configData.evolution_instance,
        }

        // Send message
        const result = await sendWhatsAppMessage(config, {
            phone: delivery.recipient_phone,
            message,
        })

        // Log notification (fire and forget)
        try {
            await supabase.from('notification_logs').insert({
                delivery_id: delivery.id,
                channel: 'whatsapp',
                recipient: delivery.recipient_phone,
                status: result.success ? 'sent' : 'failed',
                error: result.error,
                message_preview: message.substring(0, 200),
            })
        } catch {
            // Ignore log errors
        }

        return result
    } catch (error) {
        console.error('Error sending delivery notification:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro ao enviar notificação'
        }
    }
}
