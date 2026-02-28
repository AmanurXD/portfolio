"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Bug } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center px-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mx-auto mb-6">
                    <Bug size={32} />
                </div>
                <h1 className="text-6xl font-extrabold text-foreground mb-2">404</h1>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                    Page not found
                </h2>
                <p className="text-foreground-muted mb-8 max-w-md mx-auto">
                    Looks like this page has a bug — it doesn&apos;t exist.
                    Don&apos;t worry, I&apos;m great at fixing those.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors"
                    >
                        <Home size={16} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => typeof window !== "undefined" && window.history.back()}
                        className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
