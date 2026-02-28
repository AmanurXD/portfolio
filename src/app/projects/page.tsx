"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiverrCTA } from "@/components/shared/FiverrCTA";
import { cn } from "@/lib/utils";

const categories = [
    { value: "all", label: "All" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "full-stack", label: "Full-Stack" },
    { value: "automation", label: "Automation" },
];

export default function ProjectsPage() {
    const [filter, setFilter] = useState("all");

    const filtered =
        filter === "all"
            ? projects
            : projects.filter((p) => p.category === filter);

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <SectionHeading
                        label="Portfolio"
                        title="Featured Projects"
                        description="Real-world projects I've built, fixed, and deployed for clients."
                    />
                </SectionReveal>

                {/* Filter bar */}
                <SectionReveal>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setFilter(cat.value)}
                                className={cn(
                                    "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                                    filter === cat.value
                                        ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                                        : "bg-surface text-foreground-muted hover:text-foreground hover:bg-card-hover"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </SectionReveal>

                {/* Project cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((project, i) => (
                        <SectionReveal key={project.slug} delay={i * 0.08}>
                            <ProjectCard project={project} />
                        </SectionReveal>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-foreground-muted py-12">
                        No projects in this category yet.
                    </p>
                )}

                <SectionReveal>
                    <FiverrCTA
                        title="Want results like these?"
                        subtitle="Let's discuss your project."
                    />
                </SectionReveal>
            </div>
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <Link href={`/projects/${project.slug}`} className="block group">
            <article className="h-full rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-border-hover hover:shadow-lg transition-all overflow-hidden">
                {/* Gradient placeholder for screenshot */}
                <div className="h-44 bg-gradient-to-br from-accent/20 via-purple-500/10 to-surface flex items-center justify-center">
                    <span className="text-foreground-muted text-sm font-medium">
                        {project.title}
                    </span>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-accent">
                            {project.category}
                        </span>
                        {project.featured && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                Featured
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                        {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
                        {project.summary}
                    </p>

                    {/* Tech stack tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="text-xs bg-surface px-2 py-0.5 rounded-md text-foreground-muted"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 4 && (
                            <span className="text-xs text-foreground-muted px-1">
                                +{project.techStack.length - 4}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
                        View details
                        <ArrowRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform"
                        />
                    </div>
                </div>
            </article>
        </Link>
    );
}
