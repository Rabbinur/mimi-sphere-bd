interface TitleBadgeProps {
    title: string;
    className?: string;
    badgeText?: string;
}

const TitleBadge = ({ title, className = "", badgeText }: TitleBadgeProps) => {
    return (
        <div className={`flex items-center gap-2 flex-wrap ${className}`}>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight">
                {title}
            </h2>
            {badgeText && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {badgeText}
                </span>
            )}
        </div>
    );
};

export default TitleBadge;