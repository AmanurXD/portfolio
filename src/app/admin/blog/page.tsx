"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Eye } from "lucide-react";

interface BlogPost { slug: string; title: string; date: string; excerpt: string; tags: string[]; content: string; }

export default function BlogAdmin() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { setPosts(await (await fetch("/api/admin/blog")).json()); setLoading(false); };

    const openNew = () => { setEditing({ slug: "", title: "", date: new Date().toISOString().split("T")[0], excerpt: "", tags: [], content: "" }); setIsNew(true); };
    const openEdit = (p: BlogPost) => { setEditing({ ...p }); setIsNew(false); };
    const close = () => { setEditing(null); setIsNew(false); setTagInput(""); };

    const save = async () => {
        if (!editing) return; setSaving(true);
        if (isNew && !editing.slug) editing.slug = editing.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        await fetch("/api/admin/blog", { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
        await fetchData(); close(); setSaving(false);
    };

    const remove = async (slug: string) => {
        if (!confirm("Delete this blog post?")) return;
        await fetch(`/api/admin/blog?slug=${slug}`, { method: "DELETE" });
        await fetchData();
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-white">Blog</h2><p className="text-sm text-gray-400 mt-1">{posts.length} posts</p></div>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"><Plus size={16} /> New Post</button>
            </div>

            <div className="space-y-3">
                {posts.map((p) => (
                    <div key={p.slug} className="flex items-center gap-3 rounded-xl bg-[#131825] border border-gray-800 p-4 group">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{p.date} • {p.tags.join(", ")}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{p.excerpt}</p>
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
                    <div className="w-full max-w-3xl bg-[#131825] border border-gray-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">{isNew ? "New Post" : "Edit Post"}</h3>
                            <button onClick={close} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-gray-400 mb-1">Title</label><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" /></div>
                                <div><label className="block text-xs text-gray-400 mb-1">Date</label><input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" /></div>
                            </div>
                            <div><label className="block text-xs text-gray-400 mb-1">Excerpt</label><input value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" /></div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] }); setTagInput(""); } }} placeholder="Add tag..." className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" />
                                </div>
                                <div className="flex flex-wrap gap-1.5">{editing.tags.map((t, i) => (
                                    <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300">{t} <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, j) => j !== i) })}><X size={10} /></button></span>
                                ))}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Content (MDX)</label>
                                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={15} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white font-mono outline-none resize-y" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800">Cancel</button>
                            <button onClick={save} disabled={saving || !editing.title} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isNew ? "Publish" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
