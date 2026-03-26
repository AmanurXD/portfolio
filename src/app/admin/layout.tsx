"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Wrench,
    FolderOpen,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    ExternalLink,
    MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Services", href: "/admin/services", icon: Wrench },
    { label: "Projects", href: "/admin/projects", icon: FolderOpen },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Chat", href: "/admin/chat", icon: MessageCircle },
    { label: "About Page", href: "/admin/about", icon: User },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Don't render admin layout for login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch("/api/admin/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d1220] border-r border-gray-800 flex flex-col transition-transform lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
                    <div>
                        <h2 className="text-base font-bold text-white">Admin Panel</h2>
                        <p className="text-xs text-gray-500">jamesbenett</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-gray-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    active
                                        ? "bg-blue-600/10 text-blue-400"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-gray-800 space-y-1">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                        <ExternalLink size={18} />
                        View Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                        <LogOut size={18} />
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3 bg-[#0d1220]/80 backdrop-blur-md border-b border-gray-800">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-semibold text-gray-300 capitalize">
                        {sidebarItems.find((i) => isActive(i.href))?.label || "Admin"}
                    </h1>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
