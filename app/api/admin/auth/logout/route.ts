import { NextResponse } from 'next/server'
import { clearSessionCookie, getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const session = await getSession()

        if (session) {
            // Log logout
            const supabase = await createServiceClient()
            await supabase.from('admin_activity_logs').insert({
                admin_id: session.id,
                admin_name: session.full_name,
                action: 'logout',
                ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown',
            })
        }

        await clearSessionCookie()

        return NextResponse.json({ success: true, message: 'Sessão encerrada' })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao encerrar sessão' },
            { status: 500 }
        )
    }
}
