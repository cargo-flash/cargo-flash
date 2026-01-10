// WhatsApp/SMS notification templates and service
// Supports Twilio (SMS + WhatsApp)

import type { SupabaseClient } from '@supabase/supabase-js'

export interface NotificationConfig {
    provider: 'twilio' | 'zapi' | 'log' // 'log' for development
    enabled: boolean
    // Z-API config
    zapi_instance_id?: string
    zapi_token?: string
    // Twilio config
    twilio_account_sid?: string
    twilio_auth_token?: string
    twilio_phone_number?: string
    twilio_whatsapp_number?: string
    // Notification preferences
    notify_on_create?: boolean
    notify_on_status_change?: boolean
    notify_on_delivery?: boolean
    preferred_channel?: 'whatsapp' | 'sms'
}

export interface NotificationData {
    phone: string
    tracking_code: string
    recipient_name: string
    status: string
    status_label: string
    current_location?: string
    estimated_delivery?: string
    delivered_at?: string
    tracking_url: string
}

// Message templates
export const notificationTemplates = {
    orderCreated: (data: NotificationData) =>
        `🚚 *Cargo Flash*\n\n` +
        `Olá ${data.recipient_name}!\n\n` +
        `Seu pedido foi recebido e está sendo preparado.\n\n` +
        `📦 *Código:* ${data.tracking_code}\n` +
        (data.estimated_delivery ? `📅 *Previsão:* ${data.estimated_delivery}\n\n` : '\n') +
        `Rastreie em:\n${data.tracking_url}`,

    statusUpdate: (data: NotificationData) =>
        `🚚 *Cargo Flash*\n\n` +
        `Atualização do pedido *${data.tracking_code}*\n\n` +
        `📍 *Status:* ${data.status_label}\n` +
        (data.current_location ? `📌 *Local:* ${data.current_location}\n\n` : '\n') +
        `Acompanhe em:\n${data.tracking_url}`,

    outForDelivery: (data: NotificationData) =>
        `🚚 *Cargo Flash*\n\n` +
        `${data.recipient_name}, seu pedido *${data.tracking_code}* saiu para entrega!\n\n` +
        `🏃 Aguarde, nosso entregador está a caminho.\n\n` +
        `Rastreie em:\n${data.tracking_url}`,

    delivered: (data: NotificationData) =>
        `🎉 *Cargo Flash*\n\n` +
        `Entrega confirmada!\n\n` +
        `📦 *Código:* ${data.tracking_code}\n` +
        (data.delivered_at ? `🕐 *Entregue em:* ${data.delivered_at}\n\n` : '\n') +
        `Obrigado por usar a Cargo Flash! 💚`,

    failed: (data: NotificationData) =>
        `⚠️ *Cargo Flash*\n\n` +
        `Não conseguimos entregar seu pedido *${data.tracking_code}*.\n\n` +
        `📍 Motivo: Tentativa de entrega falhou\n\n` +
        `Entraremos em contato para reagendar.\n\n` +
        `Acompanhe em:\n${data.tracking_url}`,
}

// Get appropriate template based on status
export function getNotificationMessage(status: string, data: NotificationData): string {
    switch (status) {
        case 'pending':
            return notificationTemplates.orderCreated(data)
        case 'out_for_delivery':
            return notificationTemplates.outForDelivery(data)
        case 'delivered':
            return notificationTemplates.delivered(data)
        case 'failed':
            return notificationTemplates.failed(data)
        default:
            return notificationTemplates.statusUpdate(data)
    }
}

// Format phone number for WhatsApp (Brazil format)
export function formatPhoneForWhatsApp(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '')

    // Add Brazil country code if not present
    if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = '55' + cleaned
    }

    return cleaned
}

// Get notification config from database
export async function getNotificationConfig(supabase: SupabaseClient): Promise<NotificationConfig> {
    const { data } = await supabase
        .from('notification_config')
        .select('*')
        .single()

    if (!data) {
        return { provider: 'log', enabled: false }
    }

    return {
        provider: data.provider || 'log',
        enabled: data.enabled || false,
        twilio_account_sid: data.twilio_account_sid,
        twilio_auth_token: data.twilio_auth_token,
        twilio_phone_number: data.twilio_phone_number,
        twilio_whatsapp_number: data.twilio_whatsapp_number,
        notify_on_create: data.notify_on_create ?? true,
        notify_on_status_change: data.notify_on_status_change ?? true,
        notify_on_delivery: data.notify_on_delivery ?? true,
        preferred_channel: data.preferred_channel || 'whatsapp',
    }
}

// Send notification via Twilio (SMS or WhatsApp)
async function sendViaTwilio(
    config: NotificationConfig,
    phone: string,
    message: string,
    channel: 'sms' | 'whatsapp' = 'whatsapp'
): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (!config.twilio_account_sid || !config.twilio_auth_token) {
        return { success: false, error: 'Twilio não configurado' }
    }

    try {
        const formattedPhone = formatPhoneForWhatsApp(phone)
        const fromNumber = channel === 'whatsapp'
            ? `whatsapp:${config.twilio_whatsapp_number}`
            : config.twilio_phone_number

        const toNumber = channel === 'whatsapp'
            ? `whatsapp:+${formattedPhone}`
            : `+${formattedPhone}`

        const auth = Buffer.from(`${config.twilio_account_sid}:${config.twilio_auth_token}`).toString('base64')

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${config.twilio_account_sid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    From: fromNumber || '',
                    To: toNumber,
                    Body: message,
                }),
            }
        )

        const data = await response.json()

        if (response.ok && data.sid) {
            return { success: true, messageId: data.sid }
        }

        return { success: false, error: data.message || 'Erro ao enviar' }
    } catch (error) {
        console.error('Twilio error:', error)
        return { success: false, error: 'Erro de conexão com Twilio' }
    }
}

// Main send function
export async function sendNotification(
    config: NotificationConfig,
    phone: string,
    message: string,
    channel: 'whatsapp' | 'sms' = 'whatsapp'
): Promise<{ success: boolean; error?: string; messageId?: string; provider: string }> {
    if (!config.enabled) {
        return { success: false, error: 'Notificações desabilitadas', provider: 'none' }
    }

    if (!phone) {
        return { success: false, error: 'Telefone não informado', provider: 'none' }
    }

    switch (config.provider) {
        case 'twilio':
            const twilioResult = await sendViaTwilio(config, phone, message, channel)
            return { ...twilioResult, provider: 'twilio' }

        case 'log':
        default:
            // Development mode - just log
            console.log('📱 [NOTIFICATION LOG]')
            console.log(`To: ${phone}`)
            console.log(`Channel: ${channel}`)
            console.log(`Message: ${message}`)
            return { success: true, messageId: `log_${Date.now()}`, provider: 'log' }
    }
}

// Send delivery notification
export async function sendDeliveryNotification(
    config: NotificationConfig,
    data: NotificationData
): Promise<{ success: boolean; error?: string; messageId?: string; provider: string }> {
    const message = getNotificationMessage(data.status, data)
    return sendNotification(config, data.phone, message, 'whatsapp')
}
