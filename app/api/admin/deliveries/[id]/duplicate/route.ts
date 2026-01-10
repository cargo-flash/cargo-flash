import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { generateTrackingCode } from '@/lib/utils'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const supabase = await createServiceClient()

        // Get original delivery
        const { data: original, error: fetchError } = await supabase
            .from('deliveries')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !original) {
            return NextResponse.json({ success: false, error: 'Entrega não encontrada' }, { status: 404 })
        }

        // Generate new tracking code
        const trackingCode = generateTrackingCode()

        // Create duplicate with reset status
        const newDelivery = {
            tracking_code: trackingCode,
            status: 'pending',
            sender_name: original.sender_name,
            sender_email: original.sender_email,
            sender_phone: original.sender_phone,
            recipient_name: original.recipient_name,
            recipient_email: original.recipient_email,
            recipient_phone: original.recipient_phone,
            origin_address: original.origin_address,
            origin_city: original.origin_city,
            origin_state: original.origin_state,
            origin_zip: original.origin_zip,
            origin_lat: original.origin_lat,
            origin_lng: original.origin_lng,
            destination_address: original.destination_address,
            destination_city: original.destination_city,
            destination_state: original.destination_state,
            destination_zip: original.destination_zip,
            destination_lat: original.destination_lat,
            destination_lng: original.destination_lng,
            package_description: original.package_description,
            package_weight: original.package_weight,
            auto_simulate: original.auto_simulate,
        }

        const { data: created, error: createError } = await supabase
            .from('deliveries')
            .insert(newDelivery)
            .select()
            .single()

        if (createError) {
            console.error('Duplicate delivery error:', createError)
            return NextResponse.json({ success: false, error: 'Erro ao duplicar entrega' }, { status: 500 })
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session.id,
            admin_name: auth.session.full_name,
            action: 'duplicate_delivery',
            resource_type: 'delivery',
            resource_id: created.id,
            details: {
                original_id: id,
                original_tracking: original.tracking_code,
                new_tracking: trackingCode,
            },
        })

        return NextResponse.json({
            success: true,
            delivery: created,
        })
    } catch (error) {
        console.error('Duplicate delivery error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
