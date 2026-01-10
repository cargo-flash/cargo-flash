import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { generateDeliveryEvents } from '@/lib/simulation-engine'
import type { SimulationConfig, Delivery } from '@/lib/types'

/**
 * Regenerate movement history for deliveries
 * POST /api/admin/deliveries/regenerate-history
 * 
 * Body:
 * - ids?: string[] - Specific delivery IDs (if empty, regenerates all in_transit)
 * - all?: boolean - If true, regenerates for all in_transit deliveries
 */
export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const body = await request.json()
        const { ids, all } = body

        const supabase = await createServiceClient()

        // Get simulation config (or use defaults)
        const { data: dbConfig, error: configError } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        // Use defaults if no config found
        const config = dbConfig || {
            origin_company_name: 'Cargo Flash',
            origin_city: 'São Paulo',
            origin_state: 'SP',
            origin_lat: -23.5505,
            origin_lng: -46.6333,
            min_delivery_days: 15,
            max_delivery_days: 19,
            update_start_hour: 8,
            update_end_hour: 18
        }

        console.log('Using config:', {
            origin: `${config.origin_city}/${config.origin_state}`,
            days: `${config.min_delivery_days}-${config.max_delivery_days}`,
            fromDb: !!dbConfig
        })

        // Build query for deliveries
        let query = supabase
            .from('deliveries')
            .select('*')

        if (ids && ids.length > 0) {
            query = query.in('id', ids)
        } else if (all) {
            // Only regenerate for non-completed deliveries
            query = query.in('status', ['pending', 'collected', 'in_transit', 'out_for_delivery'])
        } else {
            return NextResponse.json(
                { success: false, error: 'Especifique IDs ou all=true' },
                { status: 400 }
            )
        }

        const { data: deliveries, error: fetchError } = await query

        if (fetchError) {
            console.error('Fetch deliveries error:', fetchError)
            return NextResponse.json(
                { success: false, error: 'Erro ao buscar entregas' },
                { status: 500 }
            )
        }

        if (!deliveries || deliveries.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Nenhuma entrega encontrada' },
                { status: 404 }
            )
        }

        let regeneratedCount = 0
        let eventsCount = 0
        const errors: string[] = []

        for (const delivery of deliveries) {
            try {
                // Log delivery info for debugging
                console.log(`Regenerating for ${delivery.tracking_code}:`, {
                    id: delivery.id,
                    destination_city: delivery.destination_city,
                    destination_state: delivery.destination_state,
                    status: delivery.status
                })

                // Delete existing scheduled events
                await supabase
                    .from('scheduled_events')
                    .delete()
                    .eq('delivery_id', delivery.id)
                    .eq('executed', false)

                // Generate new events
                const events = generateDeliveryEvents(
                    delivery as Delivery,
                    config as SimulationConfig
                )

                console.log(`Generated ${events.length} events for ${delivery.tracking_code}`)

                if (events.length > 0) {
                    // Insert new events - only include columns that exist in the table
                    const { error: insertError } = await supabase
                        .from('scheduled_events')
                        .insert(
                            events.map(e => ({
                                delivery_id: e.delivery_id,
                                scheduled_for: e.scheduled_for.toISOString(),
                                event_type: e.event_type,
                                new_status: e.new_status,
                                location: e.location,
                                city: e.city,
                                state: e.state,
                                lat: e.lat,
                                lng: e.lng,
                                description: e.description,
                                executed: false
                            }))
                        )

                    if (insertError) {
                        console.error(`Insert error for ${delivery.tracking_code}:`, insertError)
                        errors.push(`${delivery.tracking_code}: ${insertError.message}`)
                    } else {
                        regeneratedCount++
                        eventsCount += events.length
                    }
                } else {
                    errors.push(`${delivery.tracking_code}: Nenhum evento gerado`)
                }
            } catch (err) {
                console.error(`Error regenerating for ${delivery.tracking_code}:`, err)
                errors.push(`${delivery.tracking_code}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
            }
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session!.id,
            admin_name: auth.session!.full_name,
            action: 'regenerate_history',
            resource_type: 'delivery',
            details: {
                count: regeneratedCount,
                events_generated: eventsCount,
                ids: ids || 'all_active'
            }
        })

        return NextResponse.json({
            success: eventsCount > 0 || errors.length === 0,
            message: eventsCount > 0
                ? `Histórico regenerado para ${regeneratedCount} entrega(s). ${eventsCount} eventos criados.`
                : errors.length > 0
                    ? `Falha ao gerar eventos: ${errors[0]}`
                    : 'Nenhum evento gerado',
            regenerated: regeneratedCount,
            events: eventsCount,
            errors: errors.length > 0 ? errors : undefined
        })
    } catch (error) {
        console.error('Regenerate history error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
