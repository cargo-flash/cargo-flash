import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

// Webhook logs management for debugging integrations

export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('per_page') || '20')
        const source = searchParams.get('source')

        const supabase = await createServiceClient()

        let query = supabase
            .from('webhook_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range((page - 1) * perPage, page * perPage - 1)

        if (source) {
            query = query.eq('source', source)
        }

        const { data: logs, count, error } = await query

        if (error) {
            // Table might not exist yet
            return NextResponse.json({
                success: true,
                logs: [],
                total: 0,
                page,
                total_pages: 0,
            })
        }

        return NextResponse.json({
            success: true,
            logs: logs || [],
            total: count || 0,
            page,
            total_pages: Math.ceil((count || 0) / perPage),
        })
    } catch (error) {
        console.error('Webhook logs error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
