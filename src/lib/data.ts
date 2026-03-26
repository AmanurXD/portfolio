import "server-only";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function readData<T>(filename: string): T {
    const filePath = path.join(DATA_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

export function writeData<T>(filename: string, data: T): void {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
}

export function logActivity(action: string, details: string) {
    const filePath = path.join(DATA_DIR, "activity.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const log = JSON.parse(raw) as Array<{ action: string; details: string; timestamp: string }>;

    log.unshift({
        action,
        details,
        timestamp: new Date().toISOString(),
    });

    // Keep only last 50 entries
    if (log.length > 50) log.length = 50;

    fs.writeFileSync(filePath, JSON.stringify(log, null, 4), "utf-8");
}

// Type definitions for data
export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    tools: string[];
    turnaround: string;
}

export interface Project {
    slug: string;
    title: string;
    summary: string;
    category: "frontend" | "backend" | "full-stack" | "automation";
    techStack: string[];
    problem: string;
    solution: string;
    impact: string;
    challenges: string;
    outcome: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
}

export interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface Stat {
    label: string;
    value: number;
    suffix: string;
}

export interface SiteConfig {
    name: string;
    brand: string;
    title: string;
    description: string;
    tagline: string;
    url: string;
    ogImage: string;
    email: string;
    fiverrUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    nav: NavItem[];
    stats: Stat[];
    footer: {
        copyright: string;
        links: { label: string; href: string }[];
    };
}

export interface AboutData {
    hero: {
        greeting: string;
        paragraphs: string[];
    };
    process: { icon: string; title: string; description: string }[];
    values: { icon: string; title: string; description: string }[];
    tools: { category: string; items: string[] }[];
}

export interface ActivityEntry {
    action: string;
    details: string;
    timestamp: string;
}
