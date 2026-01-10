'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, Terminal } from 'lucide-react'

interface CommandTerminalProps {
    isOpen: boolean
    onClose: () => void
}

interface CommandResult {
    type: 'input' | 'output' | 'error' | 'success' | 'system'
    text: string
}

const COMMANDS = {
    help: {
        description: 'Exibir lista de comandos',
        action: () => [
            'COMANDOS DISPONÍVEIS:',
            '',
            '  help          - Exibir esta mensagem',
            '  clear         - Limpar terminal',
            '  status        - Status do sistema',
            '  dashboard     - Ir para dashboard',
            '  entregas      - Ir para entregas',
            '  analytics     - Ir para analytics',
            '  logs          - Ir para logs',
            '  config        - Ir para configurações',
            '  usuarios      - Ir para usuários',
            '  nova          - Criar nova entrega',
            '  search <term> - Buscar entregas',
            '  whoami        - Informações do usuário',
            '  uptime        - Tempo ativo do sistema',
            '  scan          - Executar scan de segurança',
            '  matrix        - Modo Matrix',
            '  hack          - ???',
            '  exit          - Fechar terminal',
            '',
        ]
    },
    status: {
        description: 'Status do sistema',
        action: () => [
            '╔══════════════════════════════════════╗',
            '║     CARGO FLASH SYSTEM STATUS        ║',
            '╠══════════════════════════════════════╣',
            '║  CORE SYSTEMS:     [■■■■■] ONLINE    ║',
            '║  DATABASE:         [■■■■■] CONNECTED ║',
            '║  ENCRYPTION:       [■■■■■] AES-256   ║',
            '║  FIREWALL:         [■■■■■] ACTIVE    ║',
            '║  API GATEWAY:      [■■■■■] RUNNING   ║',
            '║  THREAT LEVEL:     [▪▪▪▪▪] LOW       ║',
            '╠══════════════════════════════════════╣',
            '║  UPTIME: 99.97%  |  LATENCY: 12ms    ║',
            '╚══════════════════════════════════════╝',
        ]
    },
    whoami: {
        description: 'Info do usuário',
        action: () => [
            '┌─────────────────────────────────┐',
            '│ USER: ADMIN                     │',
            '│ ROLE: SYSTEM_ADMINISTRATOR      │',
            '│ ACCESS: LEVEL_5 (MAXIMUM)       │',
            '│ SESSION: ACTIVE                 │',
            '│ IP: ***.***.***.**              │',
            '│ LAST_LOGIN: ' + new Date().toLocaleDateString('pt-BR') + '              │',
            '└─────────────────────────────────┘',
        ]
    },
    uptime: {
        description: 'Tempo ativo',
        action: () => {
            const hours = Math.floor(Math.random() * 24) + 100
            const mins = Math.floor(Math.random() * 60)
            return [`SYSTEM UPTIME: ${hours}h ${mins}m`, 'AVAILABILITY: 99.97%', 'LAST RESTART: 2024-01-01 00:00:00']
        }
    },
    scan: {
        description: 'Scan de segurança',
        action: async () => {
            return [
                '[SCAN] Iniciando varredura de segurança...',
                '[SCAN] Verificando portas abertas...',
                '[SCAN] Analisando conexões ativas...',
                '[SCAN] Checando integridade do sistema...',
                '[SCAN] Validando certificados SSL...',
                '[OK] VARREDURA COMPLETA',
                '[OK] NENHUMA AMEAÇA DETECTADA',
                '[OK] SISTEMA SEGURO',
            ]
        }
    },
    matrix: {
        description: 'Modo Matrix',
        action: () => [
            '',
            '   ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗',
            '   ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝',
            '   ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ ',
            '   ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ ',
            '   ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗',
            '   ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
            '',
            '   "The Matrix has you..."',
            '',
            '   Wake up, Neo...',
            '',
        ]
    },
    hack: {
        description: '???',
        action: async () => {
            return [
                '',
                '   ██╗  ██╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗ ██████╗ ',
                '   ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██║████╗  ██║██╔════╝ ',
                '   ███████║███████║██║     █████╔╝ ██║██╔██╗ ██║██║  ███╗',
                '   ██╔══██║██╔══██║██║     ██╔═██╗ ██║██║╚██╗██║██║   ██║',
                '   ██║  ██║██║  ██║╚██████╗██║  ██╗██║██║ ╚████║╚██████╔╝',
                '   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ',
                '',
                '   [!] INITIATING HACK SEQUENCE...',
                '   [■□□□□□□□□□] 10%',
                '   [■■□□□□□□□□] 20%',
                '   [■■■□□□□□□□] 30%',
                '   [■■■■□□□□□□] 40%',
                '   [■■■■■□□□□□] 50%',
                '   [■■■■■■□□□□] 60%',
                '   [■■■■■■■□□□] 70%',
                '   [■■■■■■■■□□] 80%',
                '   [■■■■■■■■■□] 90%',
                '   [■■■■■■■■■■] 100%',
                '',
                '   [✓] ACCESS GRANTED',
                '   [✓] WELCOME TO THE SYSTEM, HACKER',
                '',
            ]
        }
    },
}

export function CommandTerminal({ isOpen, onClose }: CommandTerminalProps) {
    const router = useRouter()
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<CommandResult[]>([
        { type: 'system', text: '╔══════════════════════════════════════════════════════════╗' },
        { type: 'system', text: '║       CARGO FLASH COMMAND TERMINAL v2.0                  ║' },
        { type: 'system', text: '║       Type "help" for available commands                 ║' },
        { type: 'system', text: '╚══════════════════════════════════════════════════════════╝' },
        { type: 'system', text: '' },
    ])
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [isProcessing, setIsProcessing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [history])

    const executeCommand = useCallback(async (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase()
        const parts = trimmed.split(' ')
        const command = parts[0]
        const args = parts.slice(1).join(' ')

        setHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }])
        setIsProcessing(true)

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))

        let output: CommandResult[] = []

        switch (command) {
            case 'help':
                output = COMMANDS.help.action().map(text => ({ type: 'output' as const, text }))
                break

            case 'clear':
                setHistory([])
                setIsProcessing(false)
                return

            case 'exit':
                onClose()
                setIsProcessing(false)
                return

            case 'status':
                output = COMMANDS.status.action().map(text => ({ type: 'success' as const, text }))
                break

            case 'whoami':
                output = COMMANDS.whoami.action().map(text => ({ type: 'output' as const, text }))
                break

            case 'uptime':
                output = COMMANDS.uptime.action().map(text => ({ type: 'output' as const, text }))
                break

            case 'scan':
                const scanResult = await COMMANDS.scan.action()
                for (let i = 0; i < scanResult.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 300))
                    setHistory(prev => [...prev, { type: scanResult[i].startsWith('[OK]') ? 'success' : 'output', text: scanResult[i] }])
                }
                setIsProcessing(false)
                return

            case 'matrix':
                output = COMMANDS.matrix.action().map(text => ({ type: 'success' as const, text }))
                break

            case 'hack':
                const hackResult = await COMMANDS.hack.action()
                for (let i = 0; i < hackResult.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 150))
                    const type = hackResult[i].includes('[✓]') ? 'success' : hackResult[i].includes('[!]') ? 'error' : 'output'
                    setHistory(prev => [...prev, { type: type as 'success' | 'error' | 'output', text: hackResult[i] }])
                }
                setIsProcessing(false)
                return

            case 'dashboard':
                router.push('/admin/dashboard')
                output = [{ type: 'success', text: '[NAV] Redirecionando para DASHBOARD...' }]
                setTimeout(onClose, 500)
                break

            case 'entregas':
                router.push('/admin/entregas')
                output = [{ type: 'success', text: '[NAV] Redirecionando para ENTREGAS...' }]
                setTimeout(onClose, 500)
                break

            case 'analytics':
                router.push('/admin/analytics')
                output = [{ type: 'success', text: '[NAV] Redirecionando para ANALYTICS...' }]
                setTimeout(onClose, 500)
                break

            case 'logs':
                router.push('/admin/logs')
                output = [{ type: 'success', text: '[NAV] Redirecionando para LOGS...' }]
                setTimeout(onClose, 500)
                break

            case 'config':
            case 'configuracoes':
                router.push('/admin/configuracoes')
                output = [{ type: 'success', text: '[NAV] Redirecionando para CONFIGURAÇÕES...' }]
                setTimeout(onClose, 500)
                break

            case 'usuarios':
                router.push('/admin/usuarios')
                output = [{ type: 'success', text: '[NAV] Redirecionando para USUÁRIOS...' }]
                setTimeout(onClose, 500)
                break

            case 'nova':
                router.push('/admin/entregas/nova')
                output = [{ type: 'success', text: '[NAV] Abrindo formulário de NOVA ENTREGA...' }]
                setTimeout(onClose, 500)
                break

            case 'search':
                if (args) {
                    router.push(`/admin/entregas?search=${encodeURIComponent(args)}`)
                    output = [{ type: 'success', text: `[SEARCH] Buscando "${args}"...` }]
                    setTimeout(onClose, 500)
                } else {
                    output = [{ type: 'error', text: '[ERROR] Uso: search <termo>' }]
                }
                break

            case '':
                setIsProcessing(false)
                return

            default:
                output = [
                    { type: 'error', text: `[ERROR] Comando não reconhecido: "${command}"` },
                    { type: 'output', text: 'Digite "help" para ver os comandos disponíveis.' },
                ]
        }

        setHistory(prev => [...prev, ...output])
        setIsProcessing(false)
    }, [router, onClose])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isProcessing) {
            setCommandHistory(prev => [input, ...prev])
            setHistoryIndex(-1)
            executeCommand(input)
            setInput('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[newIndex])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[newIndex])
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setInput('')
            }
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Terminal Window */}
            <div className="relative w-full max-w-4xl h-[600px] bg-[#0a0a0a] border-2 border-[#00ff41]/50 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.3)]">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-[#00ff41]/30">
                    <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-[#00ff41]" />
                        <span className="font-mono text-sm text-[#00ff41]">CARGO_FLASH_TERMINAL</span>
                        <span className="font-mono text-xs text-[#00ff41]/50">— bash</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-[#00ff41]/10 rounded transition-colors">
                        <X className="h-4 w-4 text-[#00ff41]/60 hover:text-[#ff0040]" />
                    </button>
                </div>

                {/* Terminal Content */}
                <div
                    ref={terminalRef}
                    className="h-[calc(100%-80px)] overflow-y-auto p-4 font-mono text-sm"
                    onClick={() => inputRef.current?.focus()}
                >
                    {history.map((item, i) => (
                        <div
                            key={i}
                            className={`whitespace-pre-wrap ${item.type === 'input' ? 'text-[#00fff7]' :
                                    item.type === 'error' ? 'text-[#ff0040]' :
                                        item.type === 'success' ? 'text-[#00ff41]' :
                                            item.type === 'system' ? 'text-[#ff00ff]' :
                                                'text-[#00ff41]/70'
                                }`}
                            style={{
                                textShadow: item.type === 'success' ? '0 0 10px #00ff41' :
                                    item.type === 'error' ? '0 0 10px #ff0040' : undefined
                            }}
                        >
                            {item.text}
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="text-[#ffb000] animate-pulse">Processing...</div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 border-t border-[#00ff41]/30 bg-[#0d1117]">
                    <div className="flex items-center px-4 py-3">
                        <span className="text-[#00ff41] mr-2 font-mono">root@cargoflash:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isProcessing}
                            className="flex-1 bg-transparent text-[#00ff41] font-mono text-sm focus:outline-none"
                            placeholder={isProcessing ? '' : 'Digite um comando...'}
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <span className="text-[#00ff41] animate-pulse">▌</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Hook for terminal shortcut
export function useTerminalShortcut() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+` or Ctrl+Shift+T to open terminal
            if ((e.ctrlKey && e.key === '`') || (e.ctrlKey && e.shiftKey && e.key === 'T')) {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return { isOpen, setIsOpen }
}
