import { motion } from 'framer-motion';

export function Skeleton({ className = '' }) {
    return (
        <div className={`shimmer rounded bg-white/5 border border-white/5 ${className}`} />
    );
}

export function SkeletonCircle({ size = 'w-12 h-12', className = '' }) {
    return (
        <Skeleton className={`rounded-full ${size} ${className}`} />
    );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
    return (
        <Skeleton className={`${width} ${height} ${className}`} />
    );
}

export function SkeletonCard({ className = '', children }) {
    return (
        <div className={`bg-panel border border-white/5 p-6 rounded-2xl relative overflow-hidden ${className}`}>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <SkeletonLine width="w-24" height="h-3" />
                    <SkeletonCircle size="w-10 h-10" />
                </div>
                <SkeletonLine width="w-1/2" height="h-6" />
                {children}
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse-slow">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <SkeletonLine width="w-48" height="h-8" />
                    <SkeletonLine width="w-72" height="h-4" />
                </div>
                <Skeleton className="w-40 h-11 rounded-full" />
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-panel border border-white/5 p-6 rounded-2xl h-[340px] flex flex-col justify-between">
                    <div className="space-y-2">
                        <SkeletonLine width="w-32" height="h-5" />
                        <SkeletonLine width="w-48" height="h-3" />
                    </div>
                    <SkeletonLine width="w-full" height="h-[200px]" className="rounded-xl" />
                </div>
                <div className="bg-panel border border-white/5 p-6 rounded-2xl h-[340px] flex flex-col justify-between">
                    <div className="space-y-2">
                        <SkeletonLine width="w-32" height="h-5" />
                        <SkeletonLine width="w-48" height="h-3" />
                    </div>
                    <SkeletonLine width="w-full" height="h-[200px]" className="rounded-xl" />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-panel border border-white/5 p-6 rounded-2xl h-[300px] flex flex-col justify-between">
                    <SkeletonLine width="w-24" height="h-5" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="space-y-1.5">
                                <div className="flex justify-between">
                                    <SkeletonLine width="w-16" height="h-3.5" />
                                    <SkeletonLine width="w-8" height="h-3.5" />
                                </div>
                                <SkeletonLine width="w-full" height="h-1.5" className="rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-panel border border-white/5 p-6 rounded-2xl h-[300px] flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <SkeletonLine width="w-36" height="h-5" />
                        <SkeletonLine width="w-24" height="h-3.5" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((k) => (
                            <div key={k} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                                <div className="flex items-center gap-4">
                                    <SkeletonCircle size="w-12 h-12" />
                                    <div className="space-y-2">
                                        <SkeletonLine width="w-28" height="h-4" />
                                        <SkeletonLine width="w-20" height="h-3" />
                                    </div>
                                </div>
                                <SkeletonLine width="w-16" height="h-6" className="rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HistorySkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <SkeletonCircle size="w-10 h-10" />
                <div className="space-y-2">
                    <SkeletonLine width="w-40" height="h-7" />
                    <SkeletonLine width="w-24" height="h-4" />
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-panel border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-5 flex-1">
                            <SkeletonCircle size="w-14 h-14" />
                            <div className="flex-1 space-y-2">
                                <SkeletonLine width="w-1/3" height="h-5" />
                                <div className="flex gap-2">
                                    <SkeletonLine width="w-16" height="h-3" />
                                    <SkeletonLine width="w-12" height="h-3" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <SkeletonLine width="w-16" height="h-6" className="rounded-full" />
                            <SkeletonLine width="w-20" height="h-6" className="rounded-full" />
                            <SkeletonLine width="w-24" height="h-8" className="rounded-lg" />
                            <SkeletonCircle size="w-8 h-8" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReportSkeleton() {
    return (
        <div className="space-y-8 animate-pulse-slow">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <SkeletonLine width="w-44" height="h-7" />
                    <SkeletonLine width="w-24" height="h-4" />
                </div>
                <div className="flex gap-3">
                    <SkeletonLine width="w-32" height="h-10" className="rounded-full" />
                    <SkeletonLine width="w-28" height="h-10" className="rounded-full" />
                </div>
            </div>

            {/* Score Hero */}
            <div className="p-8 rounded-3xl bg-panel border border-white/5 flex flex-col items-center">
                <SkeletonCircle size="w-40 h-40" className="mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-t border-white/5 pt-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-2xl bg-panel border border-white/5 flex flex-col items-center gap-2">
                            <SkeletonLine width="w-12" height="h-3" />
                            <SkeletonLine width="w-16" height="h-6" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendation */}
            <div className="p-6 rounded-2xl bg-panel border border-white/5 flex gap-4">
                <SkeletonCircle size="w-12 h-12" className="rounded-xl" />
                <div className="flex-1 space-y-2">
                    <SkeletonLine width="w-36" height="h-4" />
                    <SkeletonLine width="w-full" height="h-16" />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-panel border border-white/5 h-[320px] flex flex-col justify-between">
                    <SkeletonLine width="w-32" height="h-5" />
                    <SkeletonLine width="w-full" height="h-[220px]" className="rounded-xl" />
                </div>
                <div className="p-6 rounded-2xl bg-panel border border-white/5 h-[320px] flex flex-col justify-between">
                    <SkeletonLine width="w-32" height="h-5" />
                    <SkeletonLine width="w-full" height="h-[220px]" className="rounded-xl" />
                </div>
            </div>
        </div>
    );
}
