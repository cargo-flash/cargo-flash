import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function GET() {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const supabase = await createServiceClient()

        const { data: config, error } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching config:', error)
            return NextResponse.json({ success: false, error: 'Erro ao buscar configuração' }, { status: 500 })
        }

        return NextResponse.json({ success: true, config })
    } catch (error) {
        console.error('Config GET error:', error)
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
        const supabase = await createServiceClient()

        // Check if config exists
        const { data: existing } = await supabase
            .from('simulation_config')
            .select('id')
            .single()

        let result
        if (existing) {
            // Update
            result = await supabase
                .from('simulation_config')
                .update({
                    origin_company_name: body.origin_company_name,
                    origin_address: body.origin_address,
                    origin_city: body.origin_city,
                    origin_state: body.origin_state,
                    origin_zip: body.origin_zip,
                    origin_lat: body.origin_lat,
                    origin_lng: body.origin_lng,
                    min_delivery_days: body.min_delivery_days,
                    max_delivery_days: body.max_delivery_days,
                    update_start_hour: body.update_start_hour,
                    update_end_hour: body.update_end_hour,
                })
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            // Insert
            result = await supabase
                .from('simulation_config')
                .insert({
                    origin_company_name: body.origin_company_name,
                    origin_address: body.origin_address,
                    origin_city: body.origin_city,
                    origin_state: body.origin_state,
                    origin_zip: body.origin_zip,
                    origin_lat: body.origin_lat,
                    origin_lng: body.origin_lng,
                    min_delivery_days: body.min_delivery_days,
                    max_delivery_days: body.max_delivery_days,
                    update_start_hour: body.update_start_hour,
                    update_end_hour: body.update_end_hour,
                })
                .select()
                .single()
        }

        if (result.error) {
            return NextResponse.json({ success: false, error: 'Erro ao salvar' }, { status: 500 })
        }

        return NextResponse.json({ success: true, config: result.data })
    } catch (error) {
        console.error('Config POST error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
