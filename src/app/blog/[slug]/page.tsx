import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { FiverrCTA } from "@/components/shared/FiverrCTA";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
        description: post.summary,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) notFound();

    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft size={14} />
                        Back to blog
                    </Link>
                </SectionReveal>

                <SectionReveal>
                    <header className="mb-10">
                        <div className="flex items-center gap-3 text-sm text-foreground-muted mb-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                            {post.title}
                        </h1>
                        <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
                            {post.summary}
                        </p>
                        {post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>
                </SectionReveal>

                <SectionReveal>
                    <article className="prose text-foreground">
                        <MDXRemote source={post.content} />
                    </article>
                </SectionReveal>

                <SectionReveal>
                    <FiverrCTA
                        title="Need help with something similar?"
                        subtitle="Let's chat about your project."
                    />
                </SectionReveal>
            </div>
        </div>
    );
}
