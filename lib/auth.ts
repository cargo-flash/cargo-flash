import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { AdminSession, Admin } from './types'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'cargo_flash_secret_key_2024'
)

const COOKIE_NAME = 'cargo_flash_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 dias em segundos

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

// Verifica senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// Cria token JWT
export async function createSessionToken(admin: Admin): Promise<string> {
    const session: AdminSession = {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    }

    return new SignJWT(session as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(JWT_SECRET)
}

// Verifica token JWT
export async function verifySessionToken(token: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as unknown as AdminSession
    } catch {
        return null
    }
}

// Define cookie de sessão
export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION,
        path: '/',
    })
}

// Remove cookie de sessão
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

// Obtém sessão do cookie
export async function getSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    return verifySessionToken(token)
}

// Gera token de reset de senha
export function generateResetToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

// Verifica se o token de reset expirou
export function isResetTokenExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return true
    return new Date(expiresAt) < new Date()
}
