"use client";

import { Search, X } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface MobileSearchProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const MobileSearch = ({ isOpen, setIsOpen }: MobileSearchProps) => {
    return (
        <>
            {/* Mobile Search Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close search" : "Open search"}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-all border border-slate-200/80 bg-white"
            >
                {isOpen ? (
                    <X className="w-4 h-4 text-slate-700 stroke-[2]" />
                ) : (
                    <Search className="w-4 h-4 text-slate-700 stroke-[2]" />
                )}
            </button>

            {/* Mobile Search Expandable Bar */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full bg-white/98 backdrop-blur-md px-3 py-2.5 border-b border-slate-200/80 md:hidden animate-in slide-in-from-top-2 duration-200 shadow-lg z-50">
                    <SearchBar onResultClick={() => setIsOpen(false)} />
                </div>
            )}
        </>
    );
};
