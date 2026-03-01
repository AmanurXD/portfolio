"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExternalLink, Mail, Send, Loader2, Calendar } from "lucide-react";
import { FIVERR_URL, EMAIL } from "@/lib/constants";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { showToast } from "@/components/shared/Toast";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be under 2000 characters"),
    honeypot: z.string().max(0),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lastSubmit = useRef<number>(0);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", message: "", honeypot: "" },
    });

    const onSubmit = async (data: ContactForm) => {
        // Rate limiting
        const now = Date.now();
        if (now - lastSubmit.current < 30000) {
            showToast("error", "Please wait before sending another message.");
            return;
        }

        // Honeypot check
        if (data.honeypot) return;

        setIsSubmitting(true);
        lastSubmit.current = now;

        // Simulate submission (replace with actual API call)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showToast("success", "Message sent! I'll get back to you soon.");
        reset();
        setIsSubmitting(false);
    };

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <SectionHeading
                        label="Contact"
                        title="Let's Work Together"
                        description="Have a project in mind, or need help fixing something? Reach out and I'll respond within minutes."
                    />
                </SectionReveal>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <SectionReveal className="lg:col-span-3">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                            noValidate
                        >
                            {/* Honeypot (hidden) */}
                            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    {...register("honeypot")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-destructive">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Tell me about your project or issue..."
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none resize-y"
                                    {...register("message")}
                                />
                                {errors.message && (
                                    <p className="mt-1.5 text-xs text-destructive">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-accent/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </SectionReveal>

                    {/* Sidebar */}
                    <SectionReveal delay={0.1} className="lg:col-span-2">
                        <div className="space-y-5">
                            {/* Fiverr */}
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                    Fastest response
                                </h3>
                                <p className="text-sm text-foreground-muted mb-4">
                                    For project inquiries, message me on Fiverr — I typically respond within minutes.
                                </p>
                                <a
                                    href={FIVERR_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#1dbf73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19a463] transition-colors w-full justify-center"
                                >
                                    Message on Fiverr
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            {/* Email */}
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                    Email
                                </h3>
                                <a
                                    href={`mailto:${EMAIL}`}
                                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                                >
                                    <Mail size={14} />
                                    {EMAIL}
                                </a>
                            </div>

                            {/* Calendly placeholder */}
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                    Schedule a call
                                </h3>
                                <p className="text-sm text-foreground-muted mb-3">
                                    Prefer a quick video call? Book a time that works for you.
                                </p>
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors w-full justify-center"
                                    disabled
                                >
                                    <Calendar size={14} />
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </SectionReveal>
                </div>
            </div>
        </div>
    );
}
