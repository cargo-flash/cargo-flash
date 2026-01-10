import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

// GET - Get notification configuration
export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const supabase = await createServiceClient()

        const { data, error } = await supabase
            .from('notification_config')
            .select('*')
            .single()

        if (error) {
            // If table doesn't exist or no config, return defaults
            return NextResponse.json({
                success: true,
                config: {
                    provider: 'log',
                    enabled: false,
                    twilio_account_sid: '',
                    twilio_auth_token: '',
                    twilio_phone_number: '',
                    twilio_whatsapp_number: '',
                    notify_on_create: true,
                    notify_on_status_change: true,
                    notify_on_delivery: true,
                    preferred_channel: 'whatsapp',
                },
            })
        }

        // Mask sensitive tokens for security
        return NextResponse.json({
            success: true,
            config: {
                ...data,
                twilio_auth_token: data.twilio_auth_token ? '••••••••' : '',
            },
        })
    } catch (error) {
        console.error('Get notification config error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar configurações' },
            { status: 500 }
        )
    }
}

// PUT - Update notification configuration
export async function PUT(request: Request) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success) return auth.response!

        const body = await request.json()
        const supabase = await createServiceClient()

        // Check if config exists
        const { data: existing } = await supabase
            .from('notification_config')
            .select('id, twilio_auth_token')
            .single()

        // Prepare update data
        const updateData: Record<string, unknown> = {
            provider: body.provider || 'log',
            enabled: body.enabled ?? false,
            twilio_account_sid: body.twilio_account_sid || null,
            twilio_phone_number: body.twilio_phone_number || null,
            twilio_whatsapp_number: body.twilio_whatsapp_number || null,
            notify_on_create: body.notify_on_create ?? true,
            notify_on_status_change: body.notify_on_status_change ?? true,
            notify_on_delivery: body.notify_on_delivery ?? true,
            preferred_channel: body.preferred_channel || 'whatsapp',
        }

        // Only update auth token if not masked
        if (body.twilio_auth_token && !body.twilio_auth_token.includes('••')) {
            updateData.twilio_auth_token = body.twilio_auth_token
        } else if (existing?.twilio_auth_token) {
            updateData.twilio_auth_token = existing.twilio_auth_token
        }

        let result
        if (existing) {
            // Update existing
            result = await supabase
                .from('notification_config')
                .update(updateData)
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await supabase
                .from('notification_config')
                .insert(updateData)
                .select()
                .single()
        }

        if (result.error) {
            console.error('Update notification config error:', result.error)
            return NextResponse.json(
                { success: false, error: 'Erro ao salvar configurações' },
                { status: 500 }
            )
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'update_notification_config',
            resource_type: 'notification_config',
            details: { enabled: updateData.enabled, provider: updateData.provider },
        })

        return NextResponse.json({
            success: true,
            message: 'Configurações salvas com sucesso',
        })
    } catch (error) {
        console.error('Update notification config error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao salvar configurações' },
            { status: 500 }
        )
    }
}
