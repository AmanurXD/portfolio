import { Metadata } from "next";
import {
    Search, FileText, Code2, TestTube2, Send,
    CheckCircle, Sparkles, Shield, Heart,
} from "lucide-react";
import { readData } from "@/lib/data";
import type { AboutData } from "@/lib/data";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiverrCTA } from "@/components/shared/FiverrCTA";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About",
    description: "Learn about James Benett — full stack web developer. My story, process, values, and tech stack.",
};

const iconMap: Record<string, React.ReactNode> = {
    Search: <Search size={22} />, FileText: <FileText size={22} />,
    Code2: <Code2 size={22} />, TestTube2: <TestTube2 size={22} />,
    Send: <Send size={22} />, Shield: <Shield size={22} />,
    Sparkles: <Sparkles size={22} />, Heart: <Heart size={22} />,
    CheckCircle: <CheckCircle size={22} />,
};

export default function AboutPage() {
    const data = readData<AboutData>("about.json");

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <SectionHeading label="About Me" title={data.hero.greeting} align="left" />
                    <div className="space-y-4 text-foreground-muted leading-relaxed">
                        {data.hero.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </SectionReveal>

                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading label="Process" title="How I Work" description="A clear, repeatable process that keeps projects on track." align="left" />
                    </SectionReveal>
                    <div className="space-y-0">
                        {data.process.map((step, i) => (
                            <SectionReveal key={step.title} delay={i * 0.08}>
                                <div className="relative flex gap-5 pb-8 last:pb-0">
                                    {i < data.process.length - 1 && <div className="absolute left-5 top-12 w-px h-full bg-border" />}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0 z-10">
                                        {iconMap[step.icon] || <Code2 size={22} />}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                        <p className="mt-1 text-sm text-foreground-muted leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading label="Values" title="What I Stand For" align="left" />
                    </SectionReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {data.values.map((v, i) => (
                            <SectionReveal key={v.title} delay={i * 0.1}>
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent mb-3">
                                        {iconMap[v.icon] || <Sparkles size={22} />}
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground">{v.title}</h3>
                                    <p className="mt-1.5 text-sm text-foreground-muted leading-relaxed">{v.description}</p>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading label="Tech Stack" title="Tools I Work With" align="left" />
                    </SectionReveal>
                    <div className="space-y-6">
                        {data.tools.map((group, i) => (
                            <SectionReveal key={group.category} delay={i * 0.08}>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">{group.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((tool) => (
                                            <span key={tool} className="text-xs font-medium bg-surface px-3 py-1.5 rounded-lg text-foreground-muted border border-border">{tool}</span>
                                        ))}
                                    </div>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                <SectionReveal><FiverrCTA /></SectionReveal>
            </div>
        </div>
    );
}
