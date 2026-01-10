'use client'

import { useState, ReactNode } from 'react'

interface Tab {
    id: string
    label: string
    icon?: ReactNode
    badge?: string | number
}

interface PremiumTabsProps {
    tabs: Tab[]
    children: (activeTab: string) => ReactNode
    defaultTab?: string
}

export function PremiumTabs({ tabs, children, defaultTab }: PremiumTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="relative mb-6">
                {/* Background */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200" />

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-6 py-4 font-medium text-sm whitespace-nowrap
                                transition-all duration-300 rounded-t-xl
                                ${activeTab === tab.id
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                                {tab.badge !== undefined && (
                                    <span className={`
                                        px-2 py-0.5 text-xs rounded-full
                                        ${activeTab === tab.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-200 text-slate-600'
                                        }
                                    `}>
                                        {tab.badge}
                                    </span>
                                )}
                            </span>

                            {/* Active Indicator */}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {children(activeTab)}
            </div>
        </div>
    )
}

// Pill Tabs Variant
interface PillTabsProps {
    tabs: Tab[]
    activeTab: string
    onChange: (tabId: string) => void
    size?: 'sm' | 'md' | 'lg'
}

export function PillTabs({ tabs, activeTab, onChange, size = 'md' }: PillTabsProps) {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <div className="inline-flex bg-slate-100 rounded-full p-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        relative rounded-full font-medium transition-all duration-300
                        ${sizeClasses[size]}
                        ${activeTab === tab.id
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }
                    `}
                >
                    <span className="flex items-center gap-1.5">
                        {tab.icon}
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    )
}

// Segmented Control Variant
export function SegmentedControl({ tabs, activeTab, onChange }: PillTabsProps) {
    return (
        <div className="inline-flex border border-slate-200 rounded-xl overflow-hidden">
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        relative px-5 py-3 text-sm font-medium transition-all duration-300
                        ${index > 0 ? 'border-l border-slate-200' : ''}
                        ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }
                    `}
                >
                    <span className="flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
