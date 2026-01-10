import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createServiceClient()

        // Get delivery stats
        const { data: deliveries } = await supabase
            .from('deliveries')
            .select('status, created_at')

        if (!deliveries) {
            return NextResponse.json({
                success: true,
                stats: {
                    total_deliveries: 0,
                    delivered: 0,
                    in_transit: 0,
                    success_rate: 0,
                },
            })
        }

        const total = deliveries.length
        const delivered = deliveries.filter(d => d.status === 'delivered').length
        const inTransit = deliveries.filter(d =>
            ['in_transit', 'out_for_delivery', 'collected'].includes(d.status)
        ).length
        const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0

        // Cache for 5 minutes
        return NextResponse.json(
            {
                success: true,
                stats: {
                    total_deliveries: total,
                    delivered,
                    in_transit: inTransit,
                    success_rate: successRate,
                },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
                },
            }
        )
    } catch (error) {
        console.error('Public stats error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar estatísticas' },
            { status: 500 }
        )
    }
}
