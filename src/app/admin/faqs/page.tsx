"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Save, Loader2, ChevronDown, ChevronRight } from "lucide-react";

interface FAQ { question: string; answer: string; }

export default function FaqsAdmin() {
    const [items, setItems] = useState<FAQ[]>([]);
    const [editing, setEditing] = useState<{ item: FAQ; index: number } | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { const res = await fetch("/api/admin/faqs"); setItems(await res.json()); setLoading(false); };

    const openNew = () => { setEditing({ item: { question: "", answer: "" }, index: -1 }); setIsNew(true); };
    const openEdit = (f: FAQ, i: number) => { setEditing({ item: { ...f }, index: i }); setIsNew(false); };
    const close = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        if (isNew) await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing.item) });
        else await fetch(`/api/admin/faqs?index=${editing.index}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing.item) });
        await fetchData(); close(); setSaving(false);
    };

    const remove = async (i: number) => {
        if (!confirm("Delete this FAQ?")) return;
        await fetch(`/api/admin/faqs?index=${i}`, { method: "DELETE" });
        await fetchData();
    };

    const moveItem = async (from: number, to: number) => {
        const r = [...items]; const [item] = r.splice(from, 1); r.splice(to, 0, item); setItems(r);
        await fetch("/api/admin/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "faqs", items: r }) });
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-white">FAQs</h2><p className="text-sm text-gray-400 mt-1">{items.length} questions</p></div>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"><Plus size={16} /> Add FAQ</button>
            </div>

            <div className="space-y-3">
                {items.map((f, i) => (
                    <div key={i} className="rounded-xl bg-[#131825] border border-gray-800 group">
                        <div className="flex items-center gap-3 p-4">
                            <div className="flex flex-col gap-1">
                                <button disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button>
                                <GripVertical size={14} className="text-gray-600" />
                                <button disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button>
                            </div>
                            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                    {expanded === i ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                                    <h3 className="text-sm font-semibold text-white">{f.question}</h3>
                                </div>
                            </button>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(f, i)} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"><Pencil size={14} /></button>
                                <button onClick={() => remove(i)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        {expanded === i && <div className="px-4 pb-4 pl-14 text-sm text-gray-400 leading-relaxed">{f.answer}</div>}
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg bg-[#131825] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">{isNew ? "Add FAQ" : "Edit FAQ"}</h3>
                            <button onClick={close} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-medium text-gray-400 mb-1">Question</label><input value={editing.item.question} onChange={(e) => setEditing({ ...editing, item: { ...editing.item, question: e.target.value } })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" /></div>
                            <div><label className="block text-xs font-medium text-gray-400 mb-1">Answer</label><textarea value={editing.item.answer} onChange={(e) => setEditing({ ...editing, item: { ...editing.item, answer: e.target.value } })} rows={5} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none resize-y" /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800">Cancel</button>
                            <button onClick={save} disabled={saving || !editing.item.question} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isNew ? "Create" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
