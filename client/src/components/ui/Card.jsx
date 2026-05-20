export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
    return (
        <div
            className={`
        glass rounded-3xl relative overflow-hidden
        ${hover ? 'hover:bg-panel-light/30 hover:-translate-y-1 hover:border-brand-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.05)] hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:glow-brand' : ''}
        ${glow ? 'glow-brand border-brand-500/40' : ''}
        ${className}
      `}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent pointer-events-none opacity-50" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`px-8 py-5 border-b border-panel-border/50 bg-panel-light/20 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return (
        <div className={`px-8 py-6 ${className}`}>
            {children}
        </div>
    );
}
