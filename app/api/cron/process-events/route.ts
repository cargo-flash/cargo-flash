import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
    try {
        // Verify CRON secret OR admin session
        const authHeader = request.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET

        // Check CRON secret first
        const isCronAuth = cronSecret && authHeader === `Bearer ${cronSecret}`

        // If no CRON auth, check admin session
        if (!isCronAuth) {
            const adminAuth = await validateAdminSession()
            if (!adminAuth.success) {
                return NextResponse.json(
                    { success: false, error: 'Não autorizado' },
                    { status: 401 }
                )
            }
        }

        const supabase = await createServiceClient()
        const now = new Date().toISOString()

        // Fetch pending events that should be executed
        const { data: events, error: fetchError } = await supabase
            .from('scheduled_events')
            .select('*')
            .eq('executed', false)
            .lte('scheduled_for', now)
            .order('scheduled_for', { ascending: true })
            .limit(50)

        if (fetchError) {
            console.error('Error fetching events:', fetchError)
            return NextResponse.json(
                { success: false, error: 'Erro ao buscar eventos' },
                { status: 500 }
            )
        }

        if (!events || events.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'Nenhum evento pendente',
                processed: 0,
            })
        }

        let processed = 0
        const errors: string[] = []

        for (const event of events) {
            try {
                // Update delivery status and current location
                const updateData: Record<string, unknown> = {
                    current_location: `${event.city}, ${event.state}`,
                    current_lat: event.lat,
                    current_lng: event.lng,
                }

                if (event.new_status) {
                    updateData.status = event.new_status

                    if (event.new_status === 'delivered') {
                        updateData.delivered_at = now
                    }
                }

                await supabase
                    .from('deliveries')
                    .update(updateData)
                    .eq('id', event.delivery_id)

                // Create history entry with progress_percent
                await supabase.from('delivery_history').insert({
                    delivery_id: event.delivery_id,
                    status: event.new_status || 'in_transit',
                    location: event.location,
                    city: event.city,
                    state: event.state,
                    lat: event.lat,
                    lng: event.lng,
                    description: event.description,
                    progress_percent: event.progress_percent,
                })

                // Mark event as executed
                await supabase
                    .from('scheduled_events')
                    .update({
                        executed: true,
                        executed_at: now,
                    })
                    .eq('id', event.id)

                processed++
            } catch (err) {
                console.error(`Error processing event ${event.id}:`, err)
                errors.push(event.id)
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processados ${processed} eventos`,
            processed,
            total: events.length,
            errors: errors.length > 0 ? errors : undefined,
        })
    } catch (error) {
        console.error('CRON error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno' },
            { status: 500 }
        )
    }
}

// Also allow GET for easy testing
export async function GET(request: Request) {
    return POST(request)
}
