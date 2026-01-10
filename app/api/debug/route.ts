import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    try {
        // Direct fetch test to Supabase
        let directTest = 'not tested'
        try {
            const testUrl = `${supabaseUrl}/rest/v1/tracking_admins?select=email&limit=1`
            const res = await fetch(testUrl, {
                headers: {
                    'apikey': serviceKey || '',
                    'Authorization': `Bearer ${serviceKey}`,
                }
            })
            directTest = `Status: ${res.status}, OK: ${res.ok}`
            if (res.ok) {
                const data = await res.json()
                directTest += `, Data: ${JSON.stringify(data)}`
            } else {
                const text = await res.text()
                directTest += `, Error: ${text.substring(0, 200)}`
            }
        } catch (fetchErr) {
            directTest = `Fetch error: ${String(fetchErr)}`
        }

        const supabase = await createServiceClient()

        // Test 1: Check tracking_admins table
        const { data: admins, error: adminError } = await supabase
            .from('tracking_admins')
            .select('id, email, full_name, role, is_active')
            .limit(5)

        // Test 2: Check deliveries table
        const { data: deliveries, error: deliveryError } = await supabase
            .from('deliveries')
            .select('id, tracking_code, status')
            .limit(5)

        return NextResponse.json({
            success: true,
            directTest,
            env: {
                url: supabaseUrl,
                serviceKeySet: !!serviceKey,
            },
            tracking_admins: {
                count: admins?.length || 0,
                data: admins,
                error: adminError?.message
            },
            deliveries: {
                count: deliveries?.length || 0,
                data: deliveries,
                error: deliveryError?.message
            }
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}

