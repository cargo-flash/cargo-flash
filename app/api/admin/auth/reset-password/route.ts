import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { hashPassword, isResetTokenExpired } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token, password } = body

        if (!token || !password) {
            return NextResponse.json(
                { success: false, error: 'Token e senha são obrigatórios' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'A senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Find admin by reset token
        const { data: admin } = await supabase
            .from('tracking_admins')
            .select('id, email, full_name, reset_token_expires')
            .eq('reset_token', token)
            .single()

        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Token inválido ou expirado' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (isResetTokenExpired(admin.reset_token_expires)) {
            return NextResponse.json(
                { success: false, error: 'Token expirado. Solicite um novo.' },
                { status: 400 }
            )
        }

        // Hash new password
        const passwordHash = await hashPassword(password)

        // Update password and clear token
        const { error: updateError } = await supabase
            .from('tracking_admins')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expires: null,
            })
            .eq('id', admin.id)

        if (updateError) {
            console.error('Password update error:', updateError)
            return NextResponse.json(
                { success: false, error: 'Erro ao atualizar senha' },
                { status: 500 }
            )
        }

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: admin.id,
            admin_name: admin.full_name,
            action: 'password_reset',
            details: { email: admin.email },
        })

        return NextResponse.json({
            success: true,
            message: 'Senha redefinida com sucesso!',
        })
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao processar solicitação' },
            { status: 500 }
        )
    }
}
