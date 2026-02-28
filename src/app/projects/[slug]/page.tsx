import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Target,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Trophy,
} from "lucide-react";
import { projects } from "@/content/projects";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { FiverrCTA } from "@/components/shared/FiverrCTA";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return { title: "Project Not Found" };

    return {
        title: project.title,
        description: project.summary,
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) notFound();

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Back link */}
                <SectionReveal>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft size={14} />
                        Back to projects
                    </Link>
                </SectionReveal>

                {/* Header */}
                <SectionReveal>
                    <div className="mb-10">
                        <span className="inline-block text-xs font-medium uppercase tracking-wider text-accent mb-3">
                            {project.category}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                            {project.title}
                        </h1>
                        <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
                            {project.summary}
                        </p>

                        {/* Tech stack */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                                >
                                    <ExternalLink size={14} />
                                    Live Demo
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                                >
                                    <Github size={14} />
                                    Source Code
                                </a>
                            )}
                        </div>
                    </div>
                </SectionReveal>

                {/* Screenshot placeholder */}
                <SectionReveal>
                    <div className="rounded-2xl bg-gradient-to-br from-accent/20 via-purple-500/10 to-surface h-64 sm:h-80 mb-12 flex items-center justify-center border border-border">
                        <span className="text-foreground-muted text-sm">
                            Screenshot placeholder
                        </span>
                    </div>
                </SectionReveal>

                {/* Content sections */}
                <div className="space-y-10">
                    <SectionReveal>
                        <DetailSection
                            icon={<Target size={20} />}
                            title="The Problem"
                            content={project.problem}
                        />
                    </SectionReveal>

                    <SectionReveal delay={0.1}>
                        <DetailSection
                            icon={<Lightbulb size={20} />}
                            title="The Solution"
                            content={project.solution}
                        />
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <DetailSection
                            icon={<TrendingUp size={20} />}
                            title="Impact"
                            content={project.impact}
                        />
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <DetailSection
                            icon={<AlertTriangle size={20} />}
                            title="Challenges"
                            content={project.challenges}
                        />
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <DetailSection
                            icon={<Trophy size={20} />}
                            title="Outcome"
                            content={project.outcome}
                        />
                    </SectionReveal>
                </div>

                <SectionReveal>
                    <FiverrCTA
                        title="Need similar results?"
                        subtitle="Let's discuss how I can help your project."
                    />
                </SectionReveal>
            </div>
        </div>
    );
}

function DetailSection({
    icon,
    title,
    content,
}: {
    icon: React.ReactNode;
    title: string;
    content: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0">
                {icon}
            </div>
            <div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-foreground-muted leading-relaxed">{content}</p>
            </div>
        </div>
    );
}
