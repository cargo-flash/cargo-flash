import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession(['super_admin', 'admin'])
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('per_page') || '50')
        const action = searchParams.get('action')

        const supabase = await createServiceClient()

        let query = supabase
            .from('admin_activity_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (action) {
            query = query.eq('action', action)
        }

        const from = (page - 1) * perPage
        const to = from + perPage - 1
        query = query.range(from, to)

        const { data: logs, count, error } = await query

        if (error) {
            console.error('Error fetching logs:', error)
            return NextResponse.json({ success: false, error: 'Erro ao buscar logs' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            logs: logs || [],
            total: count || 0,
            page,
            per_page: perPage,
            total_pages: Math.ceil((count || 0) / perPage),
        })
    } catch (error) {
        console.error('Logs GET error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
