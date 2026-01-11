import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import {
    sendWhatsAppMessage,
    testWhatsAppConnection,
    type WhatsAppConfig
} from '@/lib/whatsapp-service'

// GET - Fetch WhatsApp configuration
export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()

        const { data, error } = await supabase
            .from('whatsapp_config')
            .select('*')
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        return NextResponse.json({
            success: true,
            config: data || {
                provider: 'disabled',
                z_api_instance_id: '',
                z_api_token: '',
                z_api_security_token: '',
                evolution_api_url: '',
                evolution_api_key: '',
                evolution_instance: '',
                notify_on_received: true,
                notify_on_collected: true,
                notify_on_in_transit: false,
                notify_on_out_for_delivery: true,
                notify_on_delivered: true,
            }
        })
    } catch (error) {
        console.error('Error fetching WhatsApp config:', error)
        return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 })
    }
}

// POST - Update WhatsApp configuration
export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const supabase = await createServiceClient()

        // Check if config exists
        const { data: existing } = await supabase
            .from('whatsapp_config')
            .select('id')
            .single()

        const configData = {
            provider: body.provider || 'disabled',
            z_api_instance_id: body.z_api_instance_id || '',
            z_api_token: body.z_api_token || '',
            z_api_security_token: body.z_api_security_token || '',
            evolution_api_url: body.evolution_api_url || '',
            evolution_api_key: body.evolution_api_key || '',
            evolution_instance: body.evolution_instance || '',
            notify_on_received: body.notify_on_received ?? true,
            notify_on_collected: body.notify_on_collected ?? true,
            notify_on_in_transit: body.notify_on_in_transit ?? false,
            notify_on_out_for_delivery: body.notify_on_out_for_delivery ?? true,
            notify_on_delivered: body.notify_on_delivered ?? true,
            updated_at: new Date().toISOString(),
        }

        let result
        if (existing) {
            result = await supabase
                .from('whatsapp_config')
                .update(configData)
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            result = await supabase
                .from('whatsapp_config')
                .insert(configData)
                .select()
                .single()
        }

        if (result.error) {
            throw result.error
        }

        return NextResponse.json({ success: true, config: result.data })
    } catch (error) {
        console.error('Error updating WhatsApp config:', error)
        return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
    }
}

// PUT - Test WhatsApp connection
export async function PUT(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()

        const config: WhatsAppConfig = {
            provider: body.provider,
            zApiInstanceId: body.z_api_instance_id,
            zApiToken: body.z_api_token,
            zApiSecurityToken: body.z_api_security_token,
            evolutionApiUrl: body.evolution_api_url,
            evolutionApiKey: body.evolution_api_key,
            evolutionInstance: body.evolution_instance,
        }

        const result = await testWhatsAppConnection(config)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error testing WhatsApp:', error)
        return NextResponse.json({ success: false, error: 'Erro ao testar conexão' }, { status: 500 })
    }
}

// PATCH - Send test message
export async function PATCH(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { phone, message } = body

        if (!phone || !message) {
            return NextResponse.json({ error: 'Telefone e mensagem são obrigatórios' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        const { data: configData } = await supabase
            .from('whatsapp_config')
            .select('*')
            .single()

        if (!configData || configData.provider === 'disabled') {
            return NextResponse.json({ success: false, error: 'WhatsApp não configurado' }, { status: 400 })
        }

        const config: WhatsAppConfig = {
            provider: configData.provider,
            zApiInstanceId: configData.z_api_instance_id,
            zApiToken: configData.z_api_token,
            zApiSecurityToken: configData.z_api_security_token,
            evolutionApiUrl: configData.evolution_api_url,
            evolutionApiKey: configData.evolution_api_key,
            evolutionInstance: configData.evolution_instance,
        }

        const result = await sendWhatsAppMessage(config, { phone, message })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error sending test message:', error)
        return NextResponse.json({ success: false, error: 'Erro ao enviar mensagem' }, { status: 500 })
    }
}
