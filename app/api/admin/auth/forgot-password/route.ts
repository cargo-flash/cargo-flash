import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateResetToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email é obrigatório' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Find admin by email
        const { data: admin } = await supabase
            .from('tracking_admins')
            .select('id, email, full_name')
            .eq('email', email.toLowerCase())
            .single()

        // Always return success to prevent email enumeration
        if (!admin) {
            return NextResponse.json({
                success: true,
                message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
            })
        }

        // Generate reset token
        const resetToken = generateResetToken()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        // Save token
        await supabase
            .from('tracking_admins')
            .update({
                reset_token: resetToken,
                reset_token_expires: expiresAt.toISOString(),
            })
            .eq('id', admin.id)

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: admin.id,
            admin_name: admin.full_name,
            action: 'password_reset_request',
            details: { email: admin.email },
        })

        // In production, send email here
        // For now, just log the token
        console.log('Reset token for', admin.email, ':', resetToken)
        console.log('Reset URL:', `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`)

        return NextResponse.json({
            success: true,
            message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
            // Only in development - remove in production
            ...(process.env.NODE_ENV === 'development' && { debug_token: resetToken }),
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao processar solicitação' },
            { status: 500 }
        )
    }
}
