import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { sendNotification, formatPhoneForWhatsApp } from '@/lib/notifications'

// POST - Send test notification
export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success) return auth.response!

        const body = await request.json()
        const { phone, channel = 'whatsapp' } = body

        if (!phone) {
            return NextResponse.json(
                { success: false, error: 'Telefone é obrigatório' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Get notification config
        const { data: config } = await supabase
            .from('notification_config')
            .select('*')
            .single()

        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Configurações de notificação não encontradas' },
                { status: 404 }
            )
        }

        // Build test message
        const testMessage =
            `🧪 *Cargo Flash - Teste*\n\n` +
            `Esta é uma mensagem de teste do sistema de notificações.\n\n` +
            `✅ Configuração funcionando!\n` +
            `📱 Canal: ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}\n` +
            `🔧 Provedor: ${config.provider}\n\n` +
            `Se você recebeu esta mensagem, suas notificações estão configuradas corretamente.`

        // Send test notification
        const result = await sendNotification(
            {
                provider: config.provider,
                enabled: true, // Force enabled for test
                twilio_account_sid: config.twilio_account_sid,
                twilio_auth_token: config.twilio_auth_token,
                twilio_phone_number: config.twilio_phone_number,
                twilio_whatsapp_number: config.twilio_whatsapp_number,
            },
            phone,
            testMessage,
            channel as 'whatsapp' | 'sms'
        )

        // Log the test
        await supabase.from('notification_logs').insert({
            phone: formatPhoneForWhatsApp(phone),
            channel,
            provider: result.provider,
            message_id: result.messageId,
            status: result.success ? 'sent' : 'failed',
            error_message: result.error,
        })

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Falha ao enviar mensagem de teste',
                    provider: result.provider,
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Mensagem de teste enviada com sucesso!',
            messageId: result.messageId,
            provider: result.provider,
        })
    } catch (error) {
        console.error('Test notification error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao enviar mensagem de teste' },
            { status: 500 }
        )
    }
}
