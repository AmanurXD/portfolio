"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Zap,
  Bug,
  Rocket,
  Star,
  Clock,
  Server,
} from "lucide-react";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { FIVERR_URL } from "@/lib/constants";
import { ParticlesBackground } from "@/components/home/ParticlesBackground";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiverrCTA } from "@/components/shared/FiverrCTA";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const iconMap: Record<string, React.ReactNode> = {
  Bug: <Bug size={24} />,
  Rocket: <Rocket size={24} />,
  Layers: <Server size={24} />,
  Plug: <Zap size={24} />,
  Zap: <Zap size={24} />,
  Shield: <Star size={24} />,
};

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-bold text-foreground">
      {isInView || reducedMotion ? (
        <motion.span
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}{suffix}
        </motion.span>
      ) : (
        <span className="opacity-0">0</span>
      )}
    </span>
  );
}

function HealthGuard() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });

        if (!response.ok) {
          let message = `Health check failed (${response.status})`;
          try {
            const body = await response.json();
            if (body?.error) {
              message = body.error;
            }
          } catch {
            // ignore body parse issues
          }

          if (!cancelled) {
            setError(new Error(message));
          }
          return;
        }
      } catch (err) {
        if (!cancelled) {
          const fallbackMessage =
            err instanceof Error ? err.message : "Health check crashed";
          setError(new Error(fallbackMessage));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    throw error;
  }

  return null;
}

export default function HomePage() {
  const reducedMotion = useReducedMotion();

  const fadeUp = reducedMotion
    ? {}
    : {
      initial: { opacity: 0, y: 25 },
      animate: { opacity: 1, y: 0 },
    };

  return (
    <>
      <HealthGuard />
      {/* ===== Hero ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <ParticlesBackground />

        {/* Gradient orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-6">
              Available for freelance projects
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
          >
            Full Stack Web Developer
            <br />
            <span className="gradient-text">& Debugger</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed"
          >
            I build, fix, and deploy modern web apps.
            React, Node.js, PHP, APIs — from quick bug fixes to full features.
            Fast turnaround, clean code, production-ready.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent-hover hover:shadow-accent/40 transition-all"
            >
              Hire me on Fiverr
              <ExternalLink
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-surface hover:border-border-hover transition-all"
            >
              View Projects
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </motion.div>

          {/* Quick trust signals */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground-muted"
          >
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-accent" /> Fast response
            </span>
            <span className="flex items-center gap-2">
              <Bug size={14} className="text-accent" /> Production debugging
            </span>
            <span className="flex items-center gap-2">
              <Server size={14} className="text-accent" /> Vercel / Render /
              cPanel
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <SectionReveal>
        <section className="py-16 border-y border-border bg-surface/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {siteConfig.stats.map((stat) => (
                <div key={stat.label}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-1.5 text-sm text-foreground-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ===== Services Preview ===== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <SectionHeading
              label="What I Do"
              title="Services"
              description="From quick bug fixes to full features — I help teams ship faster."
            />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, i) => (
              <SectionReveal key={service.id} delay={i * 0.1}>
                <Link href="/services" className="block group">
                  <div className="h-full rounded-2xl border border-border bg-card p-6 hover:bg-card-hover hover:border-border-hover hover:shadow-lg transition-all">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
                      {iconMap[service.icon] || <Zap size={24} />}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal>
            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                View all services
                <ArrowRight size={16} />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-20 sm:py-24 bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <SectionHeading
              label="Testimonials"
              title="What Clients Say"
              description="Real feedback from real projects."
            />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-foreground-muted">{t.role}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <FiverrCTA />
        </SectionReveal>
      </div>
    </>
  );
}
