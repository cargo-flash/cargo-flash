'use client'

import {
    MessageCircle,
    Phone,
    Bot,
    X,
    Send,
    Sparkles
} from 'lucide-react'
import { useState } from 'react'

interface ChatBubbleButtonProps {
    trackingCode: string
    status: string
}

const quickReplies = [
    'Onde está minha encomenda?',
    'Quando vai chegar?',
    'Preciso reagendar',
    'Falar com atendente'
]

export function ChatBubbleButton({ trackingCode, status }: ChatBubbleButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Array<{ id: number; text: string; isBot: boolean }>>([
        { id: 1, text: `Olá! 👋 Sou a assistente virtual da Cargo Flash. Como posso ajudar com o rastreamento ${trackingCode.toUpperCase()}?`, isBot: true }
    ])
    const [inputValue, setInputValue] = useState('')

    const sendMessage = (text: string) => {
        if (!text.trim()) return

        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), text, isBot: false }])
        setInputValue('')

        // Simulate bot response
        setTimeout(() => {
            let response = ''
            if (text.toLowerCase().includes('onde') || text.toLowerCase().includes('localização')) {
                response = '📍 Sua encomenda está em trânsito! Última atualização registrada há poucos instantes. Você pode acompanhar no mapa acima.'
            } else if (text.toLowerCase().includes('quando') || text.toLowerCase().includes('chegar')) {
                response = '🚚 Com base em nossos dados, sua encomenda está prevista para chegar dentro do prazo informado. Continue acompanhando!'
            } else if (text.toLowerCase().includes('reagendar')) {
                response = '📅 Para reagendar, você pode usar o card de reagendamento na página ou entrar em contato pelo WhatsApp: (11) 99999-9999'
            } else if (text.toLowerCase().includes('atendente') || text.toLowerCase().includes('humano')) {
                response = '👤 Claro! Você pode falar com nossa equipe pelo WhatsApp (11) 99999-9999 ou pelo telefone 4002-8922, de segunda a sexta, das 8h às 22h.'
            } else {
                response = '✨ Obrigada pela mensagem! Nossa equipe de suporte pode ajudar melhor pelo WhatsApp: (11) 99999-9999. Estamos à disposição!'
            }
            setMessages(prev => [...prev, { id: Date.now(), text: response, isBot: true }])
        }, 1000)
    }

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-36 right-4 sm:bottom-24 md:right-8 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Assistente Cargo Flash</h4>
                                    <p className="text-xs text-white/70 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        Online agora
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`
                                    max-w-[80%] px-4 py-3 rounded-2xl text-sm
                                    ${message.isBot
                                        ? 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                        : 'bg-indigo-600 text-white rounded-br-none'
                                    }
                                `}>
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Replies */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-white">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => sendMessage(reply)}
                                    className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 text-xs rounded-full transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => sendMessage(inputValue)}
                                disabled={!inputValue.trim()}
                                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed bottom-20 right-4 sm:bottom-8 md:right-8 z-50
                    w-16 h-16 rounded-full shadow-2xl
                    flex items-center justify-center
                    transition-all duration-300
                    ${isOpen
                        ? 'bg-slate-800 rotate-0'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110'
                    }
                `}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-7 h-7 text-white" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">1</span>
                        </span>
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-30" />
                    </>
                )}
            </button>
        </>
    )
}
