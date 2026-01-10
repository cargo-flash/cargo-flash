import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()

        // Get counts by status
        const { data: deliveries, error } = await supabase
            .from('deliveries')
            .select('status')

        if (error) {
            console.error('Notifications error:', error)
            return NextResponse.json({ success: false, error: 'Erro ao buscar notificações' }, { status: 500 })
        }

        const counts = {
            pending: 0,
            in_transit: 0,
            out_for_delivery: 0,
            failed: 0,
            total_active: 0,
        }

        deliveries?.forEach((d) => {
            if (d.status === 'pending') counts.pending++
            if (d.status === 'in_transit') counts.in_transit++
            if (d.status === 'out_for_delivery') counts.out_for_delivery++
            if (d.status === 'failed') counts.failed++
            if (['pending', 'collected', 'in_transit', 'out_for_delivery'].includes(d.status)) {
                counts.total_active++
            }
        })

        return NextResponse.json({
            success: true,
            counts,
        })
    } catch (error) {
        console.error('Notifications error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
