import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

/**
 * Advance delivery to next scheduled status update
 * POST /api/admin/deliveries/[id]/advance-status
 * 
 * Executes the next pending scheduled event for this delivery,
 * adding a new entry to the movement history
 */
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const { id } = await params
        const supabase = await createServiceClient()

        // Get delivery info
        const { data: delivery, error: deliveryError } = await supabase
            .from('deliveries')
            .select('*')
            .eq('id', id)
            .single()

        if (deliveryError || !delivery) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Get next pending scheduled event
        const { data: nextEvent, error: eventError } = await supabase
            .from('scheduled_events')
            .select('*')
            .eq('delivery_id', id)
            .eq('executed', false)
            .order('scheduled_for', { ascending: true })
            .limit(1)
            .single()

        if (eventError || !nextEvent) {
            return NextResponse.json(
                { success: false, error: 'Nenhuma atualização pendente para esta entrega' },
                { status: 404 }
            )
        }

        // Execute the event - update delivery status if needed
        const updateData: Record<string, unknown> = {
            current_location: nextEvent.location,
        }

        if (nextEvent.new_status) {
            updateData.status = nextEvent.new_status

            if (nextEvent.new_status === 'delivered') {
                updateData.delivered_at = new Date().toISOString()
            }
        }

        const { error: updateError } = await supabase
            .from('deliveries')
            .update(updateData)
            .eq('id', id)

        if (updateError) {
            console.error('Update delivery error:', updateError)
            return NextResponse.json(
                { success: false, error: 'Erro ao atualizar entrega' },
                { status: 500 }
            )
        }

        // Create history entry
        const { error: historyError } = await supabase
            .from('delivery_history')
            .insert({
                delivery_id: id,
                status: nextEvent.new_status || delivery.status,
                location: nextEvent.location,
                city: nextEvent.city,
                state: nextEvent.state,
                lat: nextEvent.lat,
                lng: nextEvent.lng,
                description: nextEvent.description,
            })

        if (historyError) {
            console.error('History entry error:', historyError)
        }

        // Mark event as executed
        await supabase
            .from('scheduled_events')
            .update({ executed: true })
            .eq('id', nextEvent.id)

        // Count remaining events
        const { count: remainingCount } = await supabase
            .from('scheduled_events')
            .select('*', { count: 'exact', head: true })
            .eq('delivery_id', id)
            .eq('executed', false)

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'advance_status',
            resource_type: 'delivery',
            resource_id: id,
            details: {
                tracking_code: delivery.tracking_code,
                event_type: nextEvent.event_type,
                new_status: nextEvent.new_status,
                location: nextEvent.location,
                progress_percent: nextEvent.progress_percent,
            }
        })

        return NextResponse.json({
            success: true,
            message: `Atualização aplicada: ${nextEvent.description}`,
            event: {
                type: nextEvent.event_type,
                status: nextEvent.new_status,
                location: nextEvent.location,
                description: nextEvent.description,
                progress: nextEvent.progress_percent
            },
            remaining_updates: remainingCount || 0
        })
    } catch (error) {
        console.error('Advance status error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
