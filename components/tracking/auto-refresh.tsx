'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

interface AutoRefreshProps {
    intervalSeconds?: number
    showIndicator?: boolean
}

/**
 * Client component that auto-refreshes the page at specified intervals
 * Uses Next.js router.refresh() to re-fetch server components
 */
export function AutoRefresh({ intervalSeconds = 60, showIndicator = true }: AutoRefreshProps) {
    const router = useRouter()
    const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(intervalSeconds)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        // Countdown timer
        const countdownInterval = setInterval(() => {
            setSecondsUntilRefresh(prev => {
                if (prev <= 1) {
                    return intervalSeconds
                }
                return prev - 1
            })
        }, 1000)

        // Refresh interval
        const refreshInterval = setInterval(() => {
            setIsRefreshing(true)
            router.refresh()
            setLastUpdated(new Date())

            // Reset refreshing state after a short delay
            setTimeout(() => {
                setIsRefreshing(false)
            }, 1000)
        }, intervalSeconds * 1000)

        return () => {
            clearInterval(countdownInterval)
            clearInterval(refreshInterval)
        }
    }, [intervalSeconds, router])

    const handleManualRefresh = () => {
        setIsRefreshing(true)
        setSecondsUntilRefresh(intervalSeconds)
        router.refresh()
        setLastUpdated(new Date())

        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000)
    }

    if (!showIndicator) {
        return null
    }

    return (
        <div className="fixed bottom-20 left-4 sm:bottom-4 z-40">
            <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
                <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`}
                />
                <span className="hidden sm:inline">
                    {isRefreshing
                        ? 'Atualizando...'
                        : `Atualiza em ${secondsUntilRefresh}s`
                    }
                </span>
                <span className="sm:hidden">
                    {secondsUntilRefresh}s
                </span>
            </button>
        </div>
    )
}
