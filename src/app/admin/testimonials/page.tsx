"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Save, Loader2, Star } from "lucide-react";

interface Testimonial { name: string; role: string; text: string; rating: number; }

const empty: Testimonial = { name: "", role: "", text: "", rating: 5 };

export default function TestimonialsAdmin() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [editing, setEditing] = useState<{ item: Testimonial; index: number } | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { const res = await fetch("/api/admin/testimonials"); setItems(await res.json()); setLoading(false); };

    const openNew = () => { setEditing({ item: { ...empty }, index: -1 }); setIsNew(true); };
    const openEdit = (t: Testimonial, i: number) => { setEditing({ item: { ...t }, index: i }); setIsNew(false); };
    const close = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        if (isNew) await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing.item) });
        else await fetch(`/api/admin/testimonials?index=${editing.index}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing.item) });
        await fetchData(); close(); setSaving(false);
    };

    const remove = async (i: number) => {
        if (!confirm("Delete this testimonial?")) return;
        await fetch(`/api/admin/testimonials?index=${i}`, { method: "DELETE" });
        await fetchData();
    };

    const moveItem = async (from: number, to: number) => {
        const r = [...items]; const [item] = r.splice(from, 1); r.splice(to, 0, item); setItems(r);
        await fetch("/api/admin/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "testimonials", items: r }) });
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-white">Testimonials</h2><p className="text-sm text-gray-400 mt-1">{items.length} testimonials</p></div>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"><Plus size={16} /> Add Testimonial</button>
            </div>

            <div className="space-y-3">
                {items.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-[#131825] border border-gray-800 p-4 group">
                        <div className="flex flex-col gap-1">
                            <button disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button>
                            <GripVertical size={14} className="text-gray-600" />
                            <button disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                                <span className="text-xs text-gray-500">{t.role}</span>
                                <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={10} className="fill-amber-400 text-amber-400" />)}</div>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-1">&ldquo;{t.text}&rdquo;</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(t, i)} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"><Pencil size={14} /></button>
                            <button onClick={() => remove(i)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg bg-[#131825] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">{isNew ? "Add Testimonial" : "Edit Testimonial"}</h3>
                            <button onClick={close} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-400 mb-1">Name</label><input value={editing.item.name} onChange={(e) => setEditing({ ...editing, item: { ...editing.item, name: e.target.value } })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" /></div>
                                <div><label className="block text-xs font-medium text-gray-400 mb-1">Role</label><input value={editing.item.role} onChange={(e) => setEditing({ ...editing, item: { ...editing.item, role: e.target.value } })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" /></div>
                            </div>
                            <div><label className="block text-xs font-medium text-gray-400 mb-1">Testimonial Text</label><textarea value={editing.item.text} onChange={(e) => setEditing({ ...editing, item: { ...editing.item, text: e.target.value } })} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none resize-y" /></div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Rating</label>
                                <div className="flex gap-1">{[1, 2, 3, 4, 5].map((r) => (
                                    <button key={r} onClick={() => setEditing({ ...editing, item: { ...editing.item, rating: r } })} className="p-1">
                                        <Star size={20} className={r <= editing.item.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"} />
                                    </button>
                                ))}</div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800">Cancel</button>
                            <button onClick={save} disabled={saving || !editing.item.name} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isNew ? "Create" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
