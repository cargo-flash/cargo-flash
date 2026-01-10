import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        if (auth.session.role !== 'super_admin') {
            return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const supabase = await createServiceClient()

        const { error } = await supabase
            .from('tracking_admins')
            .update(body)
            .eq('id', id)

        if (error) {
            return NextResponse.json({ success: false, error: 'Erro ao atualizar' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('User PATCH error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        if (auth.session.role !== 'super_admin') {
            return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 })
        }

        const { id } = await params

        if (id === auth.session.id) {
            return NextResponse.json({ success: false, error: 'Não pode excluir a própria conta' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        const { error } = await supabase
            .from('tracking_admins')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ success: false, error: 'Erro ao excluir' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('User DELETE error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
