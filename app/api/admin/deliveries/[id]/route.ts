import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { updateDeliverySchema } from '@/lib/validations'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Get delivery details
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const { id } = await params
        const supabase = await createServiceClient()

        const { data: delivery, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !delivery) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Get history
        const { data: history } = await supabase
            .from('delivery_history')
            .select('*')
            .eq('delivery_id', id)
            .order('created_at', { ascending: false })

        // Get scheduled events
        const { data: scheduledEvents } = await supabase
            .from('scheduled_events')
            .select('*')
            .eq('delivery_id', id)
            .eq('executed', false)
            .order('scheduled_for', { ascending: true })

        return NextResponse.json({
            success: true,
            delivery,
            history: history || [],
            scheduled_events: scheduledEvents || [],
        })
    } catch (error) {
        console.error('Get delivery error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// PUT - Update delivery
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success) return auth.response!

        const { id } = await params
        const body = await request.json()

        // Validate input
        const validation = updateDeliverySchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Check if delivery exists
        const { data: existing } = await supabase
            .from('deliveries')
            .select('id')
            .eq('id', id)
            .single()

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Update delivery
        const { data: delivery, error } = await supabase
            .from('deliveries')
            .update(validation.data)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update delivery error:', error)
            return NextResponse.json(
                { success: false, error: 'Erro ao atualizar entrega' },
                { status: 500 }
            )
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'update_delivery',
            resource_type: 'delivery',
            resource_id: id,
            details: { changes: Object.keys(validation.data) },
        })

        return NextResponse.json({
            success: true,
            delivery,
            message: 'Entrega atualizada com sucesso',
        })
    } catch (error) {
        console.error('Update delivery error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Delete delivery
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success) return auth.response!

        const { id } = await params
        const supabase = await createServiceClient()

        // Check if delivery exists
        const { data: existing } = await supabase
            .from('deliveries')
            .select('tracking_code')
            .eq('id', id)
            .single()

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Entrega não encontrada' },
                { status: 404 }
            )
        }

        // Delete delivery (cascade will delete history and events)
        const { error } = await supabase
            .from('deliveries')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete delivery error:', error)
            return NextResponse.json(
                { success: false, error: 'Erro ao excluir entrega' },
                { status: 500 }
            )
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'delete_delivery',
            resource_type: 'delivery',
            resource_id: id,
            details: { tracking_code: existing.tracking_code },
        })

        return NextResponse.json({
            success: true,
            message: 'Entrega excluída com sucesso',
        })
    } catch (error) {
        console.error('Delete delivery error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
