import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import { FIVERR_URL, EMAIL } from "@/lib/constants";

interface FiverrCTAProps {
    title?: string;
    subtitle?: string;
}

export function FiverrCTA({
    title = "Ready to work together?",
    subtitle = "Let's build something great — or fix what's broken.",
}: FiverrCTAProps) {
    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {title}
                </h2>
                <p className="mt-3 text-foreground-muted">{subtitle}</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={FIVERR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                    >
                        Hire me on Fiverr
                        <ExternalLink size={16} />
                    </a>
                    <a
                        href={`mailto:${EMAIL}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                    >
                        <Mail size={16} />
                        Email me
                    </a>
                </div>
            </div>
        </section>
    );
}
