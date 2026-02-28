"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    label?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    className?: string;
}

export function SectionHeading({
    label,
    title,
    description,
    align = "center",
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "mb-12",
                align === "center" && "text-center",
                className
            )}
        >
            {label && (
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                    {label}
                </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {title}
            </h2>
            {description && (
                <p className="mt-4 max-w-2xl text-foreground-muted leading-relaxed mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
}
