export default function Spinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizes[size]} animate-spin rounded-full border-2 border-panel-border border-t-brand-500`} />
        </div>
    );
}

export function FullPageSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-panel-border border-t-brand-500" />
                <p className="text-text-muted text-sm">Loading...</p>
            </div>
        </div>
    );
}
