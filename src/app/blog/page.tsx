import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Tips and guides on debugging, deployment, React, Node.js, and full-stack development.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <SectionHeading
                        label="Blog"
                        title="Articles & Guides"
                        description="Practical tips from real projects — debugging, deployment, and full-stack development."
                    />
                </SectionReveal>

                {posts.length === 0 ? (
                    <p className="text-center text-foreground-muted py-12">
                        No posts yet. Check back soon!
                    </p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post, i) => (
                            <SectionReveal key={post.slug} delay={i * 0.08}>
                                <Link href={`/blog/${post.slug}`} className="block group">
                                    <article className="rounded-2xl border border-border bg-card p-6 hover:bg-card-hover hover:border-border-hover hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 text-xs text-foreground-muted mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(post.date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            {post.tags.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Tag size={12} />
                                                    {post.tags.slice(0, 2).join(", ")}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
                                            {post.summary}
                                        </p>
                                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
                                            Read more
                                            <ArrowRight
                                                size={14}
                                                className="group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </span>
                                    </article>
                                </Link>
                            </SectionReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
