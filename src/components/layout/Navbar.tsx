"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === "dark") setTheme("light");
        else if (theme === "light") setTheme("system");
        else setTheme("dark");
    };

    const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

    return (
        <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
            <nav
                className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
                    aria-label="debugwithjames home"
                >
                    debug<span className="text-accent">with</span>james
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {siteConfig.nav.map((item) => {
                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "text-accent"
                                            : "text-foreground-muted hover:text-foreground"
                                    )}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={cycleTheme}
                        className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
                        aria-label={`Switch theme, current: ${theme}`}
                    >
                        <ThemeIcon size={18} />
                    </button>

                    <Link
                        href="/contact"
                        className="hidden md:inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors"
                    >
                        Let&apos;s Talk
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-border glass"
                    >
                        <ul className="flex flex-col px-4 py-4 gap-1">
                            {siteConfig.nav.map((item) => {
                                const isActive =
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "text-accent bg-accent/10"
                                                    : "text-foreground-muted hover:text-foreground hover:bg-surface"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="mt-2">
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors"
                                >
                                    Let&apos;s Talk
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
