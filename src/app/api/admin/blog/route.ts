import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logActivity } from "@/lib/data";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function ensureDir() {
    if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
}

export async function GET() {
    ensureDir();
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
    const posts = files.map((file) => {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
        const { data, content } = matter(raw);
        return {
            slug: file.replace(".mdx", ""),
            title: data.title || "",
            date: data.date || "",
            excerpt: data.excerpt || "",
            tags: data.tags || [],
            content,
        };
    });
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(posts);
}

export async function POST(req: Request) {
    const body = await req.json();
    ensureDir();
    const frontmatter = `---\ntitle: "${body.title}"\ndate: "${body.date}"\nexcerpt: "${body.excerpt}"\ntags: [${body.tags.map((t: string) => `"${t}"`).join(", ")}]\n---\n\n`;
    fs.writeFileSync(path.join(BLOG_DIR, `${body.slug}.mdx`), frontmatter + body.content, "utf-8");
    logActivity("Created", `blog post "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const filePath = path.join(BLOG_DIR, `${body.slug}.mdx`);
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const frontmatter = `---\ntitle: "${body.title}"\ndate: "${body.date}"\nexcerpt: "${body.excerpt}"\ntags: [${body.tags.map((t: string) => `"${t}"`).join(", ")}]\n---\n\n`;
    fs.writeFileSync(filePath, frontmatter + body.content, "utf-8");
    logActivity("Updated", `blog post "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logActivity("Deleted", `blog post "${slug}"`);
    }
    return NextResponse.json({ ok: true });
}
