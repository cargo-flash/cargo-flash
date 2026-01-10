'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type DeliveryStatus } from '@/lib/types'

interface SearchResult {
    type: string
    id: string
    title: string
    subtitle: string
    status: string
    url: string
}

export function QuickSearch() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Keyboard shortcut: Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(true)
                setTimeout(() => inputRef.current?.focus(), 100)
            }
            if (e.key === 'Escape') {
                setOpen(false)
                setQuery('')
                setResults([])
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Search when query changes
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
                const data = await response.json()
                if (data.success) {
                    setResults(data.results)
                    setSelectedIndex(0)
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            router.push(results[selectedIndex].url)
            setOpen(false)
            setQuery('')
            setResults([])
        }
    }

    const handleSelect = (result: SearchResult) => {
        router.push(result.url)
        setOpen(false)
        setQuery('')
        setResults([])
    }

    if (!open) {
        return (
            <button
                onClick={() => {
                    setOpen(true)
                    setTimeout(() => inputRef.current?.focus(), 100)
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00ff41]/5 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 transition-colors w-full"
            >
                <Search className="h-4 w-4 text-[#00ff41]/60" />
                <span className="font-mono text-sm text-[#00ff41]/60 flex-1 text-left">Buscar...</span>
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-[#00ff41]/10 rounded text-[#00ff41]/60 border border-[#00ff41]/20">
                    ⌘K
                </kbd>
            </button>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => {
                    setOpen(false)
                    setQuery('')
                    setResults([])
                }}
            />

            {/* Search Dialog */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 p-4">
                <div className="bg-[#0d1117] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-[#00ff41]/20">
                        <Search className="h-5 w-5 text-[#00ff41]/60" />
                        <Input
                            ref={inputRef}
                            variant="matrix"
                            placeholder="Buscar entregas por código, nome ou cidade..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="border-0 bg-transparent focus-visible:ring-0 px-0"
                        />
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-[#00ff41]" />}
                        <button
                            onClick={() => {
                                setOpen(false)
                                setQuery('')
                                setResults([])
                            }}
                            className="text-[#00ff41]/60 hover:text-[#00ff41]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="max-h-80 overflow-y-auto">
                            {results.map((result, index) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${index === selectedIndex
                                            ? 'bg-[#00ff41]/10'
                                            : 'hover:bg-[#00ff41]/5'
                                        }`}
                                >
                                    <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                                        <Package className="h-4 w-4 text-[#00ff41]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-[#00ff41]">{result.title}</p>
                                        <p className="font-mono text-xs text-[#00ff41]/60 truncate">
                                            {result.subtitle}
                                        </p>
                                    </div>
                                    <Badge variant="matrix" className="text-[10px]">
                                        {STATUS_LABELS[result.status as DeliveryStatus] || result.status}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {query.length >= 2 && results.length === 0 && !loading && (
                        <div className="p-8 text-center">
                            <Package className="h-12 w-12 text-[#00ff41]/20 mx-auto mb-3" />
                            <p className="font-mono text-sm text-[#00ff41]/60">
                                Nenhum resultado para &quot;{query}&quot;
                            </p>
                        </div>
                    )}

                    {/* Hints */}
                    {query.length < 2 && (
                        <div className="p-4 text-center">
                            <p className="font-mono text-xs text-[#00ff41]/40">
                                Digite pelo menos 2 caracteres para buscar
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between p-3 bg-[#00ff41]/5 border-t border-[#00ff41]/10">
                        <div className="flex items-center gap-4 font-mono text-[10px] text-[#00ff41]/40">
                            <span>↑↓ navegar</span>
                            <span>↵ selecionar</span>
                            <span>esc fechar</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
