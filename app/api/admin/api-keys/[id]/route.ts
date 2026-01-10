import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const supabase = await createServiceClient()

        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting API key:', error)
            return NextResponse.json({ success: false, error: 'Erro ao excluir API Key' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('API Key DELETE error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
