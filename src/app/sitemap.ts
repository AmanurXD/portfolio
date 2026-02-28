import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        "",
        "/services",
        "/projects",
        "/about",
        "/contact",
        "/blog",
        "/privacy",
        "/terms",
    ];

    const projectRoutes = projects.map((p) => `/projects/${p.slug}`);

    let blogRoutes: string[] = [];
    try {
        const posts = getAllPosts();
        blogRoutes = posts.map((p) => `/blog/${p.slug}`);
    } catch {
        // Blog posts may not be available during build
    }

    const allRoutes = [...staticRoutes, ...projectRoutes, ...blogRoutes];

    return allRoutes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route.includes("/projects/") || route.includes("/blog/") ? 0.7 : 0.8,
    }));
}
