import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Icon and Error Code */}
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <p className="text-base font-semibold text-primary">404 Error</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Page not found
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600 max-w-md mx-auto">
                    Sorry, we couldn’t find the page you’re looking for. It might have
                    been moved, deleted, or the URL was mistyped.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Home size={18} />
                        Back to homepage
                    </Link>

                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                    >
                        Browse Shop <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
