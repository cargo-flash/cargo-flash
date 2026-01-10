'use client'

import { ReactNode } from 'react'

interface GlowingButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
}

const variantConfig = {
    primary: {
        bg: 'from-indigo-500 to-purple-600',
        glow: 'shadow-indigo-500/50',
        hover: 'hover:shadow-indigo-500/70'
    },
    secondary: {
        bg: 'from-slate-600 to-slate-700',
        glow: 'shadow-slate-500/50',
        hover: 'hover:shadow-slate-500/70'
    },
    success: {
        bg: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/50',
        hover: 'hover:shadow-emerald-500/70'
    },
    warning: {
        bg: 'from-amber-500 to-orange-600',
        glow: 'shadow-amber-500/50',
        hover: 'hover:shadow-amber-500/70'
    },
    danger: {
        bg: 'from-red-500 to-rose-600',
        glow: 'shadow-red-500/50',
        hover: 'hover:shadow-red-500/70'
    }
}

const sizeConfig = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
}

export function GlowingButton({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    className = ''
}: GlowingButtonProps) {
    const config = variantConfig[variant]

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative overflow-hidden
                bg-gradient-to-r ${config.bg}
                text-white font-bold rounded-2xl
                shadow-lg ${config.glow} ${config.hover}
                transition-all duration-300
                hover:scale-105 hover:shadow-xl
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${sizeConfig[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full">
                <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </span>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </button>
    )
}

// Icon Button Variant
interface IconButtonProps {
    icon: ReactNode
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
    tooltip?: string
}

const iconSizeConfig = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
}

export function GlowingIconButton({
    icon,
    variant = 'primary',
    size = 'md',
    onClick,
    tooltip
}: IconButtonProps) {
    const config = variantConfig[variant]

    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={`
                ${iconSizeConfig[size]}
                bg-gradient-to-r ${config.bg}
                text-white rounded-xl
                shadow-lg ${config.glow} ${config.hover}
                transition-all duration-300
                hover:scale-110 hover:shadow-xl
                active:scale-95
                flex items-center justify-center
            `}
        >
            {icon}
        </button>
    )
}

// Outline Button
interface OutlineButtonProps extends GlowingButtonProps {
    color?: string
}

export function OutlineButton({
    children,
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    color = 'indigo'
}: OutlineButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                border-2 border-${color}-500 text-${color}-600
                bg-transparent hover:bg-${color}-50
                font-bold rounded-2xl
                transition-all duration-300
                hover:scale-105
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeConfig[size]}
                ${fullWidth ? 'w-full' : ''}
            `}
        >
            <span className="flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    )
}
