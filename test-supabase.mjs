import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('=== Supabase Connection Test ===')
console.log('URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET')
console.log('Service Key:', serviceRoleKey ? 'SET (' + serviceRoleKey.length + ' chars)' : 'NOT SET')

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function testConnection() {
    try {
        // Test 1: Check tracking_admins table
        console.log('\n--- Testing tracking_admins table ---')
        const { data: admins, error: adminError } = await supabase
            .from('tracking_admins')
            .select('id, email, full_name, role, is_active')
            .limit(5)

        if (adminError) {
            console.error('❌ Error querying tracking_admins:', adminError.message)
        } else {
            console.log('✅ tracking_admins found:', admins?.length || 0, 'records')
            if (admins && admins.length > 0) {
                admins.forEach(a => console.log('   -', a.email, '|', a.role, '| active:', a.is_active))
            }
        }

        // Test 2: Check deliveries table
        console.log('\n--- Testing deliveries table ---')
        const { data: deliveries, error: deliveryError } = await supabase
            .from('deliveries')
            .select('id, tracking_code, status, recipient_name')
            .limit(5)

        if (deliveryError) {
            console.error('❌ Error querying deliveries:', deliveryError.message)
        } else {
            console.log('✅ deliveries found:', deliveries?.length || 0, 'records')
            if (deliveries && deliveries.length > 0) {
                deliveries.forEach(d => console.log('   -', d.tracking_code, '|', d.status, '|', d.recipient_name))
            }
        }

        // Test 3: Check simulation_config table
        console.log('\n--- Testing simulation_config table ---')
        const { data: config, error: configError } = await supabase
            .from('simulation_config')
            .select('*')
            .single()

        if (configError) {
            console.error('❌ Error querying simulation_config:', configError.message)
        } else {
            console.log('✅ simulation_config found')
            console.log('   Origin:', config?.origin_city, ',', config?.origin_state)
        }

        console.log('\n=== Test Complete ===')
    } catch (err) {
        console.error('❌ Unexpected error:', err)
    }
}

testConnection()
