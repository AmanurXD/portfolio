import { readData } from "@/lib/data";
import type { Service, Project, Testimonial, FAQ, ActivityEntry } from "@/lib/data";
import Link from "next/link";
import {
    Wrench,
    FolderOpen,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    ArrowRight,
    Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
    const services = readData<Service[]>("services.json");
    const projects = readData<Project[]>("projects.json");
    const testimonials = readData<Testimonial[]>("testimonials.json");
    const faqs = readData<FAQ[]>("faqs.json");
    const activity = readData<ActivityEntry[]>("activity.json");

    let blogCount = 0;
    try {
        const fs = require("fs");
        const path = require("path");
        const blogDir = path.join(process.cwd(), "src/content/blog");
        blogCount = fs.readdirSync(blogDir).filter((f: string) => f.endsWith(".mdx")).length;
    } catch {
        blogCount = 0;
    }

    const stats = [
        { label: "Services", value: services.length, icon: Wrench, href: "/admin/services", color: "bg-blue-500/10 text-blue-400" },
        { label: "Projects", value: projects.length, icon: FolderOpen, href: "/admin/projects", color: "bg-emerald-500/10 text-emerald-400" },
        { label: "Testimonials", value: testimonials.length, icon: MessageSquareQuote, href: "/admin/testimonials", color: "bg-purple-500/10 text-purple-400" },
        { label: "FAQs", value: faqs.length, icon: HelpCircle, href: "/admin/faqs", color: "bg-amber-500/10 text-amber-400" },
        { label: "Blog Posts", value: blogCount, icon: FileText, href: "/admin/blog", color: "bg-rose-500/10 text-rose-400" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <p className="text-sm text-gray-400 mt-1">Overview of your portfolio content</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group rounded-xl bg-[#131825] border border-gray-800 p-5 hover:border-gray-700 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent activity */}
                <div className="rounded-xl bg-[#131825] border border-gray-800 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        Recent Activity
                    </h3>
                    {activity.length === 0 ? (
                        <p className="text-sm text-gray-500">No activity yet. Start managing your content!</p>
                    ) : (
                        <div className="space-y-3">
                            {activity.slice(0, 8).map((entry, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-gray-300 truncate">
                                            <span className="font-medium text-white">{entry.action}</span>{" "}
                                            {entry.details}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="rounded-xl bg-[#131825] border border-gray-800 p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Add Service", href: "/admin/services" },
                            { label: "Add Project", href: "/admin/projects" },
                            { label: "Add Testimonial", href: "/admin/testimonials" },
                            { label: "Add FAQ", href: "/admin/faqs" },
                            { label: "Write Blog Post", href: "/admin/blog" },
                            { label: "Site Settings", href: "/admin/settings" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
