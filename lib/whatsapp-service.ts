// ============================================
// WHATSAPP NOTIFICATION SERVICE
// Supports Z-API and Evolution API providers
// ============================================

export type WhatsAppProvider = 'z-api' | 'evolution-api' | 'disabled'

export interface WhatsAppConfig {
    provider: WhatsAppProvider
    // Z-API
    zApiInstanceId?: string
    zApiToken?: string
    zApiSecurityToken?: string
    // Evolution API
    evolutionApiUrl?: string
    evolutionApiKey?: string
    evolutionInstance?: string
}

export interface WhatsAppMessage {
    phone: string
    message: string
}

/**
 * Format phone number to WhatsApp format (5511999999999)
 */
function formatPhone(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '')

    // Add Brazil country code if not present
    if (!cleaned.startsWith('55')) {
        cleaned = '55' + cleaned
    }

    // Ensure 11 digits after country code (DDD + number)
    if (cleaned.length === 12) {
        // Old format without 9 - add 9 after DDD
        cleaned = cleaned.slice(0, 4) + '9' + cleaned.slice(4)
    }

    return cleaned
}

/**
 * Send message via Z-API
 * https://developer.z-api.io/
 */
async function sendViaZApi(
    config: WhatsAppConfig,
    message: WhatsAppMessage
): Promise<{ success: boolean; error?: string }> {
    if (!config.zApiInstanceId || !config.zApiToken) {
        return { success: false, error: 'Z-API não configurado' }
    }

    const phone = formatPhone(message.phone)
    const url = `https://api.z-api.io/instances/${config.zApiInstanceId}/token/${config.zApiToken}/send-text`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(config.zApiSecurityToken && {
                    'Client-Token': config.zApiSecurityToken
                }),
            },
            body: JSON.stringify({
                phone: phone,
                message: message.message,
            }),
        })

        const data = await response.json()

        if (response.ok && data.zapiMessageId) {
            console.log(`[Z-API] Message sent to ${phone}: ${data.zapiMessageId}`)
            return { success: true }
        }

        return {
            success: false,
            error: data.error || data.message || 'Erro ao enviar mensagem'
        }
    } catch (error) {
        console.error('[Z-API] Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro de conexão'
        }
    }
}

/**
 * Send message via Evolution API
 * https://doc.evolution-api.com/
 */
async function sendViaEvolutionApi(
    config: WhatsAppConfig,
    message: WhatsAppMessage
): Promise<{ success: boolean; error?: string }> {
    if (!config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstance) {
        return { success: false, error: 'Evolution API não configurado' }
    }

    const phone = formatPhone(message.phone)
    const url = `${config.evolutionApiUrl}/message/sendText/${config.evolutionInstance}`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.evolutionApiKey,
            },
            body: JSON.stringify({
                number: phone,
                text: message.message,
            }),
        })

        const data = await response.json()

        if (response.ok && data.key) {
            console.log(`[Evolution API] Message sent to ${phone}: ${data.key.id}`)
            return { success: true }
        }

        return {
            success: false,
            error: data.error || data.message || 'Erro ao enviar mensagem'
        }
    } catch (error) {
        console.error('[Evolution API] Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro de conexão'
        }
    }
}

/**
 * Main function to send WhatsApp message
 * Automatically uses the configured provider
 */
export async function sendWhatsAppMessage(
    config: WhatsAppConfig,
    message: WhatsAppMessage
): Promise<{ success: boolean; error?: string }> {
    if (config.provider === 'disabled') {
        return { success: false, error: 'WhatsApp desativado' }
    }

    if (!message.phone) {
        return { success: false, error: 'Telefone não informado' }
    }

    switch (config.provider) {
        case 'z-api':
            return sendViaZApi(config, message)
        case 'evolution-api':
            return sendViaEvolutionApi(config, message)
        default:
            return { success: false, error: 'Provedor não configurado' }
    }
}

/**
 * Test WhatsApp connection
 */
export async function testWhatsAppConnection(
    config: WhatsAppConfig
): Promise<{ success: boolean; error?: string }> {
    if (config.provider === 'z-api') {
        if (!config.zApiInstanceId || !config.zApiToken) {
            return { success: false, error: 'Credenciais Z-API não configuradas' }
        }

        const url = `https://api.z-api.io/instances/${config.zApiInstanceId}/token/${config.zApiToken}/status`

        try {
            const response = await fetch(url, {
                headers: config.zApiSecurityToken
                    ? { 'Client-Token': config.zApiSecurityToken }
                    : {},
            })
            const data = await response.json()

            if (data.connected) {
                return { success: true }
            }
            return { success: false, error: data.error || 'Instância não conectada' }
        } catch (error) {
            return { success: false, error: 'Erro de conexão com Z-API' }
        }
    }

    if (config.provider === 'evolution-api') {
        if (!config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstance) {
            return { success: false, error: 'Credenciais Evolution API não configuradas' }
        }

        const url = `${config.evolutionApiUrl}/instance/connectionState/${config.evolutionInstance}`

        try {
            const response = await fetch(url, {
                headers: { 'apikey': config.evolutionApiKey },
            })
            const data = await response.json()

            if (data.instance?.state === 'open') {
                return { success: true }
            }
            return { success: false, error: data.error || 'Instância não conectada' }
        } catch (error) {
            return { success: false, error: 'Erro de conexão com Evolution API' }
        }
    }

    return { success: false, error: 'Provedor não selecionado' }
}

// ============================================
// NOTIFICATION TEMPLATES
// ============================================

export interface DeliveryNotificationData {
    trackingCode: string
    recipientName: string
    status: string
    currentLocation?: string
    estimatedDelivery?: string
    trackingUrl: string
}

export function getNotificationMessage(
    type: 'received' | 'collected' | 'in_transit' | 'out_for_delivery' | 'delivered',
    data: DeliveryNotificationData
): string {
    const templates: Record<string, string> = {
        received: `🎉 *Olá, ${data.recipientName}!*

Seu pedido foi recebido e está sendo preparado para envio.

📦 *Código de Rastreio:* ${data.trackingCode}
📍 *Status:* Pedido Recebido

🔗 Acompanhe seu pedido:
${data.trackingUrl}

_Cargo Flash - Rastreamento em Tempo Real_`,

        collected: `📦 *${data.recipientName}, boa notícia!*

Seu pedido foi coletado e está a caminho.

📦 *Código:* ${data.trackingCode}
📍 *Status:* Coletado
📍 *Localização:* ${data.currentLocation || 'Centro de Distribuição'}

🔗 Acompanhe: ${data.trackingUrl}

_Cargo Flash_`,

        in_transit: `🚚 *${data.recipientName}, seu pedido está em trânsito!*

📦 *Código:* ${data.trackingCode}
📍 *Localização atual:* ${data.currentLocation || 'Em trânsito'}
📅 *Previsão:* ${data.estimatedDelivery || 'Em breve'}

🔗 Acompanhe: ${data.trackingUrl}

_Cargo Flash_`,

        out_for_delivery: `🎯 *${data.recipientName}, seu pedido está saindo para entrega!*

📦 *Código:* ${data.trackingCode}
📍 *Status:* Saiu para Entrega
🏠 *Aguarde em seu endereço*

🔗 Acompanhe: ${data.trackingUrl}

_Cargo Flash_`,

        delivered: `✅ *${data.recipientName}, seu pedido foi entregue!*

📦 *Código:* ${data.trackingCode}
📍 *Status:* Entregue com sucesso!

Obrigado por utilizar nossos serviços! 🙏

_Cargo Flash_`,
    }

    return templates[type] || templates.in_transit
}

/**
 * Map delivery status to notification type
 */
export function statusToNotificationType(
    status: string
): 'received' | 'collected' | 'in_transit' | 'out_for_delivery' | 'delivered' | null {
    const mapping: Record<string, 'received' | 'collected' | 'in_transit' | 'out_for_delivery' | 'delivered'> = {
        'pending': 'received',
        'collected': 'collected',
        'in_transit': 'in_transit',
        'out_for_delivery': 'out_for_delivery',
        'delivered': 'delivered',
    }
    return mapping[status] || null
}
