'use client'

import { ReactNode } from 'react'

interface GlassCardProps {
    children: ReactNode
    className?: string
    animate?: boolean
    glow?: boolean
    holographic?: boolean
    variant?: 'default' | 'dark' | 'gradient' | 'neon'
}

export function GlassCard({
    children,
    className = ''
}: GlassCardProps) {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    )
}

interface GlassCardHeaderProps {
    icon?: ReactNode
    title: string
    subtitle?: string
    gradient?: string
    badge?: string
    action?: ReactNode
}

export function GlassCardHeader({
    icon,
    title,
    subtitle,
    action
}: GlassCardHeaderProps) {
    return (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-slate-800">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

interface GlassCardContentProps {
    children: ReactNode
    className?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
}

export function GlassCardContent({ children, className = '', padding = 'md' }: GlassCardContentProps) {
    return (
        <div className={`${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    )
}

interface GlassCardFooterProps {
    children: ReactNode
    className?: string
    variant?: 'default' | 'gradient'
}

export function GlassCardFooter({ children, className = '' }: GlassCardFooterProps) {
    return (
        <div className={`border-t border-slate-100 px-5 py-4 ${className}`}>
            {children}
        </div>
    )
}

export function FloatingGlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    )
}

export function TiltGlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    )
}
