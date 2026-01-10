import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, error: 'Senha atual e nova senha são obrigatórias' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: 'A nova senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Get current admin with password hash
        const { data: admin } = await supabase
            .from('tracking_admins')
            .select('id, password_hash, full_name')
            .eq('id', auth.session.id)
            .single()

        if (!admin || !admin.password_hash) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, admin.password_hash)
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Senha atual incorreta' },
                { status: 400 }
            )
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword)

        // Update password
        const { error: updateError } = await supabase
            .from('tracking_admins')
            .update({ password_hash: newPasswordHash })
            .eq('id', auth.session.id)

        if (updateError) {
            console.error('Password change error:', updateError)
            return NextResponse.json(
                { success: false, error: 'Erro ao alterar senha' },
                { status: 500 }
            )
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session.id,
            admin_name: admin.full_name,
            action: 'password_change',
            details: { method: 'settings' },
        })

        return NextResponse.json({
            success: true,
            message: 'Senha alterada com sucesso!',
        })
    } catch (error) {
        console.error('Change password error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno' },
            { status: 500 }
        )
    }
}
