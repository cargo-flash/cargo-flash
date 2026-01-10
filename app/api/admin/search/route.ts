import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.length < 2) {
            return NextResponse.json({ success: true, results: [] })
        }

        const supabase = await createServiceClient()

        // Search deliveries
        const { data: deliveries } = await supabase
            .from('deliveries')
            .select('id, tracking_code, recipient_name, destination_city, status')
            .or(`tracking_code.ilike.%${query}%,recipient_name.ilike.%${query}%,destination_city.ilike.%${query}%`)
            .limit(10)

        const results = (deliveries || []).map(d => ({
            type: 'delivery',
            id: d.id,
            title: d.tracking_code,
            subtitle: `${d.recipient_name} • ${d.destination_city}`,
            status: d.status,
            url: `/admin/entregas/${d.id}`,
        }))

        return NextResponse.json({
            success: true,
            results,
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ success: false, error: 'Erro na busca' }, { status: 500 })
    }
}
