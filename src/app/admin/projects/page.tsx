"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Save, Loader2, Star } from "lucide-react";

interface Project {
    slug: string; title: string; summary: string;
    category: string; techStack: string[];
    problem: string; solution: string; impact: string; challenges: string; outcome: string;
    liveUrl?: string; githubUrl?: string; featured: boolean;
}

const CATEGORIES = ["frontend", "backend", "full-stack", "automation"];

const emptyProject: Project = {
    slug: "", title: "", summary: "", category: "full-stack", techStack: [],
    problem: "", solution: "", impact: "", challenges: "", outcome: "",
    liveUrl: "", githubUrl: "", featured: false,
};

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [techInput, setTechInput] = useState("");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const res = await fetch("/api/admin/projects");
        setProjects(await res.json());
        setLoading(false);
    };

    const openNew = () => { setEditing({ ...emptyProject }); setIsNew(true); };
    const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); };
    const close = () => { setEditing(null); setIsNew(false); setTechInput(""); };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        if (isNew && !editing.slug) editing.slug = editing.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        await fetch("/api/admin/projects", { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
        await fetchData(); close(); setSaving(false);
    };

    const remove = async (slug: string) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/admin/projects?slug=${slug}`, { method: "DELETE" });
        await fetchData();
    };

    const moveItem = async (from: number, to: number) => {
        const r = [...projects]; const [item] = r.splice(from, 1); r.splice(to, 0, item);
        setProjects(r);
        await fetch("/api/admin/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "projects", items: r }) });
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Projects</h2>
                    <p className="text-sm text-gray-400 mt-1">{projects.length} projects</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                    <Plus size={16} /> Add Project
                </button>
            </div>

            <div className="space-y-3">
                {projects.map((p, i) => (
                    <div key={p.slug} className="flex items-center gap-3 rounded-xl bg-[#131825] border border-gray-800 p-4 group">
                        <div className="flex flex-col gap-1">
                            <button disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button>
                            <GripVertical size={14} className="text-gray-600" />
                            <button disabled={i === projects.length - 1} onClick={() => moveItem(i, i + 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                                {p.featured && <Star size={12} className="fill-amber-400 text-amber-400" />}
                                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">{p.category}</span>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{p.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"><Pencil size={14} /></button>
                            <button onClick={() => remove(p.slug)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-2xl bg-[#131825] border border-gray-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">{isNew ? "Add Project" : "Edit Project"}</h3>
                            <button onClick={close} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none">
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Summary</label>
                                <textarea value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none resize-y" />
                            </div>
                            {(["problem", "solution", "impact", "challenges", "outcome"] as const).map((field) => (
                                <div key={field}>
                                    <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">{field}</label>
                                    <textarea value={editing[field]} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none resize-y" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Tech Stack</label>
                                <div className="flex gap-2 mb-2">
                                    <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (techInput.trim()) { setEditing({ ...editing, techStack: [...editing.techStack, techInput.trim()] }); setTechInput(""); } } }} placeholder="Add tech..." className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                                </div>
                                <div className="flex flex-wrap gap-1.5">{editing.techStack.map((t, i) => (
                                    <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300">{t} <button onClick={() => setEditing({ ...editing, techStack: editing.techStack.filter((_, j) => j !== i) })}><X size={10} /></button></span>
                                ))}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-400 mb-1">Live URL</label><input value={editing.liveUrl || ""} onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" /></div>
                                <div><label className="block text-xs font-medium text-gray-400 mb-1">GitHub URL</label><input value={editing.githubUrl || ""} onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" /></div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
                                <span className="text-sm text-gray-300">Featured project</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800">Cancel</button>
                            <button onClick={save} disabled={saving || !editing.title} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isNew ? "Create" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
