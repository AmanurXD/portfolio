"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Save, Loader2 } from "lucide-react";

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    tools: string[];
    turnaround: string;
}

const ICONS = ["Bug", "Rocket", "Layers", "Plug", "Zap", "Shield", "Code", "Database", "Globe", "Lock"];

const emptyService: Service = {
    id: "", title: "", description: "", icon: "Bug", features: [], tools: [], turnaround: "",
};

export default function ServicesAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [editing, setEditing] = useState<Service | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [featureInput, setFeatureInput] = useState("");
    const [toolInput, setToolInput] = useState("");

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        const res = await fetch("/api/admin/services");
        setServices(await res.json());
        setLoading(false);
    };

    const openNew = () => { setEditing({ ...emptyService }); setIsNew(true); };
    const openEdit = (s: Service) => { setEditing({ ...s }); setIsNew(false); };
    const close = () => { setEditing(null); setIsNew(false); setFeatureInput(""); setToolInput(""); };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        const method = isNew ? "POST" : "PUT";
        if (isNew && !editing.id) editing.id = editing.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        await fetch("/api/admin/services", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
        await fetchServices();
        close();
        setSaving(false);
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this service?")) return;
        await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
        await fetchServices();
    };

    const addTag = (field: "features" | "tools", value: string) => {
        if (!editing || !value.trim()) return;
        setEditing({ ...editing, [field]: [...editing[field], value.trim()] });
        if (field === "features") setFeatureInput(""); else setToolInput("");
    };

    const removeTag = (field: "features" | "tools", idx: number) => {
        if (!editing) return;
        setEditing({ ...editing, [field]: editing[field].filter((_, i) => i !== idx) });
    };

    const moveItem = async (from: number, to: number) => {
        const reordered = [...services];
        const [item] = reordered.splice(from, 1);
        reordered.splice(to, 0, item);
        setServices(reordered);
        await fetch("/api/admin/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: "services", items: reordered }) });
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Services</h2>
                    <p className="text-sm text-gray-400 mt-1">{services.length} services</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                    <Plus size={16} /> Add Service
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {services.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-xl bg-[#131825] border border-gray-800 p-4 group">
                        <div className="flex flex-col gap-1">
                            <button disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button>
                            <GripVertical size={14} className="text-gray-600" />
                            <button disabled={i === services.length - 1} onClick={() => moveItem(i, i + 1)} className="text-gray-600 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{s.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {s.tools.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">{t}</span>)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"><Pencil size={14} /></button>
                            <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg bg-[#131825] border border-gray-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">{isNew ? "Add Service" : "Edit Service"}</h3>
                            <button onClick={close} className="p-1 text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none resize-y" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                                    <select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none">
                                        {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Turnaround</label>
                                    <input value={editing.turnaround} onChange={(e) => setEditing({ ...editing, turnaround: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("features", featureInput))} placeholder="Add feature..." className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                                    <button onClick={() => addTag("features", featureInput)} className="px-3 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {editing.features.map((f, i) => (
                                        <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300">
                                            {f} <button onClick={() => removeTag("features", i)} className="hover:text-white"><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Tools</label>
                                <div className="flex gap-2 mb-2">
                                    <input value={toolInput} onChange={(e) => setToolInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("tools", toolInput))} placeholder="Add tool..." className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none" />
                                    <button onClick={() => addTag("tools", toolInput)} className="px-3 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {editing.tools.map((t, i) => (
                                        <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300">
                                            {t} <button onClick={() => removeTag("tools", i)} className="hover:text-white"><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                            <button onClick={save} disabled={saving || !editing.title} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {isNew ? "Create" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
