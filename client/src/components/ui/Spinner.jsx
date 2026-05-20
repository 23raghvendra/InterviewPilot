export default function Spinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-10 w-10 border-[3px]' };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizes[size]} animate-spin rounded-full border-white/10 border-t-white`} />
        </div>
    );
}

export function FullPageSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/10 border-t-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white text-sm font-bold uppercase tracking-widest">Initializing System</p>
                    <p className="text-text-muted text-[11px] font-mono tracking-wider">Establishing secure connection...</p>
                </div>
            </div>
        </div>
    );
}
