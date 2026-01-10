import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { email, password } = validation.data

        // Debug: Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceKey) {
            console.error('Missing Supabase config:', { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey })
            return NextResponse.json(
                { success: false, error: 'Configuração do servidor incompleta. Verifique as variáveis de ambiente.' },
                { status: 500 }
            )
        }

        const supabase = await createServiceClient()

        // Find admin by email
        const { data: admin, error } = await supabase
            .from('tracking_admins')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()

        // Debug: Log the query result
        console.log('Login attempt:', {
            email: email.toLowerCase(),
            adminFound: !!admin,
            error: error?.message,
            adminData: admin ? { id: admin.id, email: admin.email, hasHash: !!admin.password_hash } : null
        })

        if (error || !admin) {
            console.error('Admin not found:', error)
            return NextResponse.json(
                { success: false, error: 'Credenciais inválidas', debug: 'Usuário não encontrado' },
                { status: 401 }
            )
        }

        // Check if account is active
        if (!admin.is_active) {
            return NextResponse.json(
                { success: false, error: 'Conta desativada. Contate o administrador.' },
                { status: 403 }
            )
        }

        // Verify password
        if (!admin.password_hash) {
            return NextResponse.json(
                { success: false, error: 'Conta não configurada. Redefina sua senha.' },
                { status: 401 }
            )
        }

        const isValidPassword = await verifyPassword(password, admin.password_hash)
        console.log('Password verification:', { isValid: isValidPassword, hashLength: admin.password_hash?.length })

        if (!isValidPassword) {
            // Log failed attempt
            await supabase.from('admin_activity_logs').insert({
                admin_id: admin.id,
                admin_name: admin.full_name,
                action: 'login_failed',
                details: { reason: 'invalid_password' },
                ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown',
            })

            return NextResponse.json(
                { success: false, error: 'Credenciais inválidas', debug: 'Senha incorreta' },
                { status: 401 }
            )
        }

        // Create session token
        const token = await createSessionToken(admin)
        await setSessionCookie(token)

        // Log successful login
        await supabase.from('admin_activity_logs').insert({
            admin_id: admin.id,
            admin_name: admin.full_name,
            action: 'login',
            details: { success: true },
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown',
        })

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                full_name: admin.full_name,
                role: admin.role,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor', debug: String(error) },
            { status: 500 }
        )
    }
}
