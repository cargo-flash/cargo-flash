import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get('x-api-key')

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'x-api-key header not provided',
                debug: {
                    received_headers: Object.fromEntries(request.headers.entries()),
                }
            }, { status: 401 })
        }

        const supabase = await createServiceClient()

        // Fetch all active keys
        const { data: keys, error: keysError } = await supabase
            .from('api_keys')
            .select('id, name, key_hash, is_active, expires_at, created_at')
            .eq('is_active', true)

        if (keysError) {
            return NextResponse.json({
                success: false,
                error: 'Database error fetching keys',
                details: keysError.message,
            }, { status: 500 })
        }

        const results = []
        for (const key of keys || []) {
            try {
                const isMatch = await bcrypt.compare(apiKey, key.key_hash)
                results.push({
                    id: key.id,
                    name: key.name,
                    hash_prefix: key.key_hash?.substring(0, 30) + '...',
                    is_match: isMatch,
                    is_active: key.is_active,
                    expires_at: key.expires_at,
                })
            } catch (err) {
                results.push({
                    id: key.id,
                    name: key.name,
                    error: 'bcrypt comparison failed: ' + (err instanceof Error ? err.message : 'unknown'),
                })
            }
        }

        const matchedKey = results.find(r => r.is_match)

        return NextResponse.json({
            success: !!matchedKey,
            message: matchedKey ? 'API Key válida!' : 'Nenhuma API Key corresponde',
            api_key_received: {
                length: apiKey.length,
                prefix: apiKey.substring(0, 10) + '...',
                suffix: '...' + apiKey.substring(apiKey.length - 5),
            },
            total_active_keys: keys?.length || 0,
            validation_results: results,
            matched_key: matchedKey ? {
                id: matchedKey.id,
                name: matchedKey.name,
            } : null,
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Internal error',
            details: error instanceof Error ? error.message : 'unknown',
        }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({
        endpoint: 'Debug API Key Validation',
        usage: 'POST with x-api-key header to test validation',
        purpose: 'Test if your API key is correctly validated',
    })
}
