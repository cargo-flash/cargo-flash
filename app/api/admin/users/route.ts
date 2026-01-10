import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { hashPassword } from '@/lib/auth'

export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()

        const { data: users, error } = await supabase
            .from('tracking_admins')
            .select('id, email, full_name, role, is_active, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ success: false, error: 'Erro ao buscar usuários' }, { status: 500 })
        }

        return NextResponse.json({ success: true, users })
    } catch (error) {
        console.error('Users GET error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        if (auth.session.role !== 'super_admin') {
            return NextResponse.json({ success: false, error: 'Permissão negada' }, { status: 403 })
        }

        const body = await request.json()
        const { email, full_name, password, role } = body

        if (!email || !full_name || !password) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        // Check if email exists
        const { data: existing } = await supabase
            .from('tracking_admins')
            .select('id')
            .eq('email', email.toLowerCase())
            .single()

        if (existing) {
            return NextResponse.json({ success: false, error: 'Email já cadastrado' }, { status: 400 })
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        const { data: user, error } = await supabase
            .from('tracking_admins')
            .insert({
                email: email.toLowerCase(),
                full_name,
                password_hash: passwordHash,
                role: role || 'admin',
                created_by: auth.session.id,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ success: false, error: 'Erro ao criar usuário' }, { status: 500 })
        }

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error('Users POST error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
