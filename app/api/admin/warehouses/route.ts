import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { z } from 'zod'

// Warehouse schema
const warehouseSchema = z.object({
    api_key_id: z.string().uuid().optional(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    code: z.string().optional(),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zip: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    is_default: z.boolean().optional(),
    is_active: z.boolean().optional(),
    contact_name: z.string().optional(),
    contact_phone: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
})

// GET - List all warehouses
export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()
        const url = new URL(request.url)
        const apiKeyId = url.searchParams.get('api_key_id')

        let query = supabase
            .from('warehouses')
            .select(`
                *,
                api_keys (
                    id,
                    name,
                    store_url
                )
            `)
            .order('created_at', { ascending: false })

        if (apiKeyId) {
            query = query.eq('api_key_id', apiKeyId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ success: true, warehouses: data })
    } catch (error) {
        console.error('Error fetching warehouses:', error)
        return NextResponse.json({ error: 'Erro ao buscar galpões' }, { status: 500 })
    }
}

// POST - Create new warehouse
export async function POST(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const validation = warehouseSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        const { data, error } = await supabase
            .from('warehouses')
            .insert(validation.data)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, warehouse: data })
    } catch (error) {
        console.error('Error creating warehouse:', error)
        return NextResponse.json({ error: 'Erro ao criar galpão' }, { status: 500 })
    }
}

// PUT - Update warehouse
export async function PUT(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        const { data, error } = await supabase
            .from('warehouses')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, warehouse: data })
    } catch (error) {
        console.error('Error updating warehouse:', error)
        return NextResponse.json({ error: 'Erro ao atualizar galpão' }, { status: 500 })
    }
}

// DELETE - Remove warehouse
export async function DELETE(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const url = new URL(request.url)
        const id = url.searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        const { error } = await supabase
            .from('warehouses')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting warehouse:', error)
        return NextResponse.json({ error: 'Erro ao excluir galpão' }, { status: 500 })
    }
}
