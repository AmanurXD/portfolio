import { Metadata } from "next";
import {
    Bug,
    Rocket,
    Layers,
    Plug,
    Zap,
    Shield,
    CheckCircle,
    Wrench,
    Clock,
} from "lucide-react";
import { services } from "@/content/services";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiverrCTA } from "@/components/shared/FiverrCTA";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Full stack web development services — bug fixing, deployment, feature development, API integration, and performance optimization.",
};

const iconMap: Record<string, React.ReactNode> = {
    Bug: <Bug size={28} />,
    Rocket: <Rocket size={28} />,
    Layers: <Layers size={28} />,
    Plug: <Plug size={28} />,
    Zap: <Zap size={28} />,
    Shield: <Shield size={28} />,
};

export default function ServicesPage() {
    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <SectionHeading
                        label="Services"
                        title="How Can I Help?"
                        description="I offer focused services to help you build, fix, and ship web applications faster."
                    />
                </SectionReveal>

                <div className="space-y-8">
                    {services.map((service, i) => (
                        <SectionReveal key={service.id} delay={i * 0.08}>
                            <article className="group rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-border-hover transition-all overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent shrink-0">
                                            {iconMap[service.icon] || <Zap size={28} />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                                                {service.title}
                                            </h2>
                                            <p className="mt-2 text-foreground-muted leading-relaxed">
                                                {service.description}
                                            </p>

                                            {/* Features */}
                                            <div className="mt-5">
                                                <h3 className="text-sm font-semibold text-foreground mb-3">
                                                    What you get:
                                                </h3>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {service.features.map((feature) => (
                                                        <li
                                                            key={feature}
                                                            className="flex items-start gap-2 text-sm text-foreground-muted"
                                                        >
                                                            <CheckCircle
                                                                size={14}
                                                                className="mt-0.5 shrink-0 text-emerald-500"
                                                            />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Meta */}
                                            <div className="mt-5 flex flex-wrap gap-4 text-xs text-foreground-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <Wrench size={12} className="text-accent" />
                                                    {service.tools.join(", ")}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-accent" />
                                                    {service.turnaround}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </SectionReveal>
                    ))}
                </div>

                <SectionReveal>
                    <FiverrCTA
                        title="Need something else?"
                        subtitle="Message me and let's figure out the best way I can help."
                    />
                </SectionReveal>
            </div>
        </div>
    );
}
