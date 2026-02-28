import { Metadata } from "next";
import {
    Search,
    FileText,
    Code2,
    TestTube2,
    Send,
    CheckCircle,
    Sparkles,
    Shield,
    Heart,
} from "lucide-react";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiverrCTA } from "@/components/shared/FiverrCTA";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about James Benett — full stack web developer and debugger. My story, process, values, and tech stack.",
};

const process_steps = [
    {
        icon: <Search size={22} />,
        title: "Discovery",
        description:
            "I start by understanding your problem, codebase, and goals. Clear scope means fewer surprises.",
    },
    {
        icon: <FileText size={22} />,
        title: "Plan",
        description:
            "I outline the approach, estimate time, and communicate what I'll do before writing any code.",
    },
    {
        icon: <Code2 size={22} />,
        title: "Build / Fix",
        description:
            "I write clean, well-structured code. For debugging, I use systematic methods to isolate and fix issues.",
    },
    {
        icon: <TestTube2 size={22} />,
        title: "Test",
        description:
            "Every change is tested — manually and/or with automated tests. I verify edge cases.",
    },
    {
        icon: <Send size={22} />,
        title: "Deliver",
        description:
            "I deliver with clear documentation of what was done, why, and how to maintain it going forward.",
    },
];

const values = [
    {
        icon: <Shield size={22} />,
        title: "Reliability",
        description:
            "I show up, communicate clearly, and deliver on time. Every time.",
    },
    {
        icon: <Sparkles size={22} />,
        title: "Clarity",
        description:
            "No jargon, no mysteries. I explain what I did and why, so you're never in the dark.",
    },
    {
        icon: <Heart size={22} />,
        title: "Maintainability",
        description:
            "I write code that your future self (or next developer) will thank you for.",
    },
];

const tools = [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Express", "PHP", "Python", "REST APIs", "GraphQL"] },
    { category: "Database", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma"] },
    { category: "DevOps", items: ["Docker", "GitHub Actions", "Vercel", "AWS", "Nginx"] },
    { category: "Tools", items: ["Git", "VS Code", "Postman", "Figma", "Chrome DevTools"] },
];

export default function AboutPage() {
    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Story */}
                <SectionReveal>
                    <SectionHeading
                        label="About Me"
                        title="Hey, I'm James 👋"
                        align="left"
                    />
                    <div className="space-y-4 text-foreground-muted leading-relaxed">
                        <p>
                            I&apos;m a full-stack web developer who loves solving hard problems.
                            Whether it&apos;s a production bug that&apos;s costing you revenue, a
                            deployment that won&apos;t cooperate, or a feature that needs to ship
                            yesterday — I&apos;m the person you call.
                        </p>
                        <p>
                            I&apos;ve worked with startups, agencies, and solo founders across
                            industries. My approach is simple: understand the problem deeply,
                            communicate clearly, write clean code, and ship fast. No fluff, no
                            overcomplicated solutions.
                        </p>
                        <p>
                            When I&apos;m not coding, I&apos;m writing about debugging techniques and
                            deployment tips on my blog. I believe every developer should be able
                            to debug efficiently — it&apos;s the skill that separates good from great.
                        </p>
                    </div>
                </SectionReveal>

                {/* How I Work */}
                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading
                            label="Process"
                            title="How I Work"
                            description="A clear, repeatable process that keeps projects on track."
                            align="left"
                        />
                    </SectionReveal>

                    <div className="space-y-0">
                        {process_steps.map((step, i) => (
                            <SectionReveal key={step.title} delay={i * 0.08}>
                                <div className="relative flex gap-5 pb-8 last:pb-0">
                                    {/* Vertical line */}
                                    {i < process_steps.length - 1 && (
                                        <div className="absolute left-5 top-12 w-px h-full bg-border" />
                                    )}

                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0 z-10">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-foreground-muted leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                {/* Values */}
                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading
                            label="Values"
                            title="What I Stand For"
                            align="left"
                        />
                    </SectionReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <SectionReveal key={v.title} delay={i * 0.1}>
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent mb-3">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground">
                                        {v.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm text-foreground-muted leading-relaxed">
                                        {v.description}
                                    </p>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                {/* Tools & Stack */}
                <section className="mt-20">
                    <SectionReveal>
                        <SectionHeading
                            label="Tech Stack"
                            title="Tools I Work With"
                            align="left"
                        />
                    </SectionReveal>

                    <div className="space-y-6">
                        {tools.map((group, i) => (
                            <SectionReveal key={group.category} delay={i * 0.08}>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">
                                        {group.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((tool) => (
                                            <span
                                                key={tool}
                                                className="text-xs font-medium bg-surface px-3 py-1.5 rounded-lg text-foreground-muted border border-border"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </section>

                <SectionReveal>
                    <FiverrCTA />
                </SectionReveal>
            </div>
        </div>
    );
}
