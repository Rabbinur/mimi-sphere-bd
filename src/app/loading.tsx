export default function Loading() {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-xs font-medium text-gray-400 animate-pulse">Loading ...</div>
            </div>
        </div>
    );
}
