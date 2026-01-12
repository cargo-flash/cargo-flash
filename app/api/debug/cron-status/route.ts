import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Debug endpoint to check cron status - no auth required for debugging
export async function GET() {
    try {
        const supabase = await createServiceClient()
        const now = new Date().toISOString()

        // Check simulation_config
        const { data: config, error: configError } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        // Count scheduled_events
        const { count: totalEvents } = await supabase
            .from('scheduled_events')
            .select('*', { count: 'exact', head: true })

        const { count: pendingEvents } = await supabase
            .from('scheduled_events')
            .select('*', { count: 'exact', head: true })
            .eq('executed', false)

        const { count: overdueEvents } = await supabase
            .from('scheduled_events')
            .select('*', { count: 'exact', head: true })
            .eq('executed', false)
            .lte('scheduled_for', now)

        // Get sample of pending events
        const { data: sampleEvents } = await supabase
            .from('scheduled_events')
            .select('id, delivery_id, scheduled_for, event_type, new_status, executed')
            .eq('executed', false)
            .order('scheduled_for', { ascending: true })
            .limit(5)

        // Count deliveries
        const { count: totalDeliveries } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })

        const { count: pendingDeliveries } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        return NextResponse.json({
            status: 'debug',
            timestamp: now,
            simulation_config: {
                exists: !!config,
                origin_city: config?.origin_city || null,
                origin_state: config?.origin_state || null,
                error: configError?.message || null,
            },
            scheduled_events: {
                total: totalEvents || 0,
                pending: pendingEvents || 0,
                overdue: overdueEvents || 0,
                sample: sampleEvents || [],
            },
            deliveries: {
                total: totalDeliveries || 0,
                pending: pendingDeliveries || 0,
            },
            diagnosis: !config
                ? 'PROBLEM: simulation_config does not exist - events cannot be generated'
                : overdueEvents === 0
                    ? 'No overdue events to process - check scheduled_for dates'
                    : `${overdueEvents} events ready to be processed`,
        })
    } catch (error) {
        console.error('Debug error:', error)
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 })
    }
}
