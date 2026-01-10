'use client'

interface PremiumSkeletonProps {
    variant?: 'card' | 'hero' | 'timeline' | 'map'
}

export function PremiumSkeleton({ variant = 'card' }: PremiumSkeletonProps) {
    if (variant === 'hero') {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse">
                <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 lg:py-20">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-8 bg-slate-300 rounded-full" />
                    </div>
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-300 rounded-3xl" />
                        <div className="w-64 h-10 mx-auto mb-4 bg-slate-300 rounded-xl" />
                        <div className="w-48 h-6 mx-auto mb-8 bg-slate-300 rounded-lg" />
                        <div className="w-56 h-20 mx-auto mb-6 bg-slate-300 rounded-2xl" />
                        <div className="flex justify-center gap-4">
                            <div className="w-32 h-6 bg-slate-300 rounded-lg" />
                            <div className="w-32 h-6 bg-slate-300 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" />
            </div>
        )
    }

    if (variant === 'timeline') {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-200 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 p-4 bg-slate-100 rounded-2xl">
                            <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2" />
                            <div className="w-1/2 h-4 bg-slate-200 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (variant === 'map') {
        return (
            <div className="relative h-[400px] bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl animate-pulse overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-300 rounded-full" />
                        <div className="w-32 h-4 mx-auto bg-slate-300 rounded-lg" />
                    </div>
                </div>
                {/* Fake road path */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                    <path
                        d="M 10,50 Q 30,20 50,50 T 90,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        className="text-slate-400"
                    />
                </svg>
            </div>
        )
    }

    // Default card skeleton
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                    <div>
                        <div className="w-40 h-5 bg-slate-200 rounded-lg mb-2" />
                        <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="w-full h-4 bg-slate-100 rounded-lg" />
                <div className="w-3/4 h-4 bg-slate-100 rounded-lg" />
                <div className="w-1/2 h-4 bg-slate-100 rounded-lg" />
            </div>
        </div>
    )
}

// Shimmer Effect Skeleton
export function ShimmerSkeleton() {
    return (
        <div className="relative overflow-hidden bg-slate-100 rounded-2xl h-32">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    )
}
