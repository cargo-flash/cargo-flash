import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()

        const { data: keys, error } = await supabase
            .from('api_keys')
            .select('id, name, key_preview, is_active, last_used_at, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching API keys:', error)
            return NextResponse.json({ success: false, error: 'Erro ao buscar API Keys' }, { status: 500 })
        }

        return NextResponse.json({ success: true, keys })
    } catch (error) {
        console.error('API Keys GET error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { name, key } = body

        if (!name || !key) {
            return NextResponse.json({ success: false, error: 'Nome e key são obrigatórios' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        // Hash the key for storage
        const keyHash = await bcrypt.hash(key, 10)

        // Get last 4 chars for preview
        const keyPreview = '****' + key.slice(-4)

        const { data: apiKey, error } = await supabase
            .from('api_keys')
            .insert({
                name,
                key_hash: keyHash,
                key_preview: keyPreview,
                created_by: auth.session.id,
                is_active: true,
            })
            .select('id, name, key_preview, is_active, created_at')
            .single()

        if (error) {
            console.error('Error creating API key:', error)
            return NextResponse.json({ success: false, error: 'Erro ao criar API Key' }, { status: 500 })
        }

        return NextResponse.json({ success: true, key: apiKey })
    } catch (error) {
        console.error('API Keys POST error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
