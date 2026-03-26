"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientCursor } from "@/components/shared/ClientCursor";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <a href="#main-content" className="skip-to-main">
                Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="pt-16">
                {children}
            </main>
            <Footer />
            <ClientCursor />
        </>
    );
}
