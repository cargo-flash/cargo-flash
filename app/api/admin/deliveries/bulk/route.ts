import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { STATUS_LABELS, type DeliveryStatus } from '@/lib/types'

export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { ids, status, description } = body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, error: 'IDs das entregas são obrigatórios' },
                { status: 400 }
            )
        }

        if (!status) {
            return NextResponse.json(
                { success: false, error: 'Novo status é obrigatório' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()
        const results = { success: 0, failed: 0, errors: [] as string[] }

        // Process each delivery
        for (const id of ids) {
            try {
                // Update delivery status
                const { error: updateError } = await supabase
                    .from('deliveries')
                    .update({
                        status,
                        updated_at: new Date().toISOString(),
                        ...(status === 'delivered' && { delivered_at: new Date().toISOString() }),
                    })
                    .eq('id', id)

                if (updateError) {
                    results.failed++
                    results.errors.push(`${id}: ${updateError.message}`)
                    continue
                }

                // Add history entry
                await supabase.from('delivery_history').insert({
                    delivery_id: id,
                    status,
                    description: description || `Status atualizado em lote para ${STATUS_LABELS[status as DeliveryStatus]}`,
                    location: 'Sistema',
                })

                results.success++
            } catch (err) {
                results.failed++
                results.errors.push(`${id}: Erro interno`)
            }
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session.id,
            admin_name: auth.session.full_name,
            action: 'bulk_status_update',
            resource_type: 'delivery',
            details: {
                count: ids.length,
                new_status: status,
                success: results.success,
                failed: results.failed,
            },
        })

        return NextResponse.json({
            success: true,
            message: `${results.success} entregas atualizadas${results.failed > 0 ? `, ${results.failed} falharam` : ''}`,
            results,
        })
    } catch (error) {
        console.error('Bulk update error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao processar atualização em lote' },
            { status: 500 }
        )
    }
}
