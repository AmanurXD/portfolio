import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/content/site";
import { FIVERR_URL, GITHUB_URL, LINKEDIN_URL, EMAIL } from "@/lib/constants";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-surface/50">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="text-lg font-bold tracking-tight text-foreground"
                        >
                            debug<span className="text-accent">with</span>james
                        </Link>
                        <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
                            {siteConfig.description.slice(0, 120)}...
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Navigate
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {siteConfig.nav.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Connect
                        </h3>
                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href={FIVERR_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1dbf73] text-white hover:bg-[#19a463] transition-colors"
                                aria-label="Fiverr profile"
                            >
                                <ExternalLink size={16} />
                            </a>
                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface hover:bg-card-hover text-foreground-muted hover:text-foreground transition-colors"
                                aria-label="GitHub profile"
                            >
                                <Github size={16} />
                            </a>
                            <a
                                href={LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface hover:bg-card-hover text-foreground-muted hover:text-foreground transition-colors"
                                aria-label="LinkedIn profile"
                            >
                                <Linkedin size={16} />
                            </a>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface hover:bg-card-hover text-foreground-muted hover:text-foreground transition-colors"
                                aria-label="Send email"
                            >
                                <Mail size={16} />
                            </a>
                        </div>
                        <a
                            href={FIVERR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors"
                        >
                            Hire me on Fiverr
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-foreground-muted">
                        &copy; {currentYear} {siteConfig.brand}. All rights reserved.
                    </p>
                    <p className="text-xs text-foreground-muted">
                        Built with Next.js &bull; Deployed on Vercel
                    </p>
                </div>
            </div>
        </footer>
    );
}
