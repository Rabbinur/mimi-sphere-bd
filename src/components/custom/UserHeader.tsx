"use client";

import { Input } from "@/components/ui/input";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

interface UserHeaderProps {
    title: string;
    isFilterOpen?: boolean;
    setIsFilterOpen?: (value: boolean) => void;
    showSearch?: boolean;
    backUrl?: string; // Optional custom back URL
}

const UserHeader: React.FC<UserHeaderProps> = ({
    title,
    isFilterOpen,
    setIsFilterOpen,
    showSearch = false,
    backUrl,
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    return (
        <>
            {/* MOBILE HEADER (Matches your Screenshot)
         Fixed sticky positioning and refined text sizes
      */}
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white px-4 border-b border-gray-100 md:hidden">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="h-9 w-9 p-0 hover:bg-gray-50 active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Button>
                    <h1 className="text-[16px] font-bold text-gray-800 tracking-tight">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-1">
                    {/* Show Filter only if the state setter is provided */}
                    {setIsFilterOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-9 w-9 ${isFilterOpen ? "text-pink-600 bg-pink-50" : "text-gray-500"}`}
                        >
                            <Filter className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </header>

            {/* DESKTOP HEADER 
         Modern, clean border-bottom style 
      */}
            <div className="hidden border-b bg-white md:block">
                <div className="container mx-auto flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-800">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {showSearch && (
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder={`Search ${title.toLowerCase()}...`}
                                    className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-pink-500 rounded-full h-10 text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserHeader;