import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) return auth.response!

        const supabase = await createServiceClient()

        // Total deliveries
        const { count: totalDeliveries } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })

        // Today's deliveries
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const { count: todayDeliveries } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())

        // By status counts
        const { data: statusCounts } = await supabase
            .from('deliveries')
            .select('status')

        const countByStatus = statusCounts?.reduce((acc, d) => {
            acc[d.status] = (acc[d.status] || 0) + 1
            return acc
        }, {} as Record<string, number>) || {}

        // Recent deliveries
        const { data: recentDeliveries } = await supabase
            .from('deliveries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        // Deliveries by day (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { data: weekDeliveries } = await supabase
            .from('deliveries')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString())

        const deliveriesByDay = weekDeliveries?.reduce((acc, d) => {
            const date = new Date(d.created_at).toLocaleDateString('pt-BR')
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {} as Record<string, number>) || {}

        // Calculate delivery rate
        const delivered = countByStatus['delivered'] || 0
        const total = totalDeliveries || 0
        const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0

        return NextResponse.json({
            success: true,
            stats: {
                total_deliveries: totalDeliveries || 0,
                today_deliveries: todayDeliveries || 0,
                in_transit: countByStatus['in_transit'] || 0,
                delivered: delivered,
                pending: countByStatus['pending'] || 0,
                failed: countByStatus['failed'] || 0,
                out_for_delivery: countByStatus['out_for_delivery'] || 0,
                delivery_rate: deliveryRate,
                deliveries_by_status: Object.entries(countByStatus).map(([status, count]) => ({
                    status,
                    count,
                })),
                deliveries_by_day: Object.entries(deliveriesByDay).map(([date, count]) => ({
                    date,
                    count,
                })),
                recent_deliveries: recentDeliveries || [],
            },
        })
    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao carregar estatísticas' },
            { status: 500 }
        )
    }
}
