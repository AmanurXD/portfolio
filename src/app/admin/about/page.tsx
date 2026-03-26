"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, X, GripVertical } from "lucide-react";

interface AboutData {
    hero: { greeting: string; paragraphs: string[] };
    process: { icon: string; title: string; description: string }[];
    values: { icon: string; title: string; description: string }[];
    tools: { category: string; items: string[] }[];
}

const ICONS = ["Search", "FileText", "Code2", "TestTube2", "Send", "Shield", "Sparkles", "Heart", "Bug", "Zap"];

export default function AboutAdmin() {
    const [data, setData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [toolInput, setToolInput] = useState("");

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { setData(await (await fetch("/api/admin/about")).json()); setLoading(false); };

    const save = async () => {
        if (!data) return; setSaving(true);
        await fetch("/api/admin/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    if (loading || !data) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">About Page</h2>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? "Saved!" : "Save"}
                </button>
            </div>

            {/* Hero */}
            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Hero Section</h3>
                <div><label className="block text-xs text-gray-400 mb-1">Greeting</label><input value={data.hero.greeting} onChange={(e) => setData({ ...data, hero: { ...data.hero, greeting: e.target.value } })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" /></div>
                {data.hero.paragraphs.map((p, i) => (
                    <div key={i} className="flex gap-2">
                        <textarea value={p} onChange={(e) => { const ps = [...data.hero.paragraphs]; ps[i] = e.target.value; setData({ ...data, hero: { ...data.hero, paragraphs: ps } }); }} rows={3} className="flex-1 px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none resize-y" />
                        <button onClick={() => setData({ ...data, hero: { ...data.hero, paragraphs: data.hero.paragraphs.filter((_, j) => j !== i) } })} className="p-2 text-gray-500 hover:text-red-400 self-start"><X size={14} /></button>
                    </div>
                ))}
                <button onClick={() => setData({ ...data, hero: { ...data.hero, paragraphs: [...data.hero.paragraphs, ""] } })} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"><Plus size={12} /> Add Paragraph</button>
            </section>

            {/* Process */}
            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Process Steps</h3>
                {data.process.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-[#0a0e1a]">
                        <select value={step.icon} onChange={(e) => { const p = [...data.process]; p[i] = { ...p[i], icon: e.target.value }; setData({ ...data, process: p }); }} className="px-2 py-1 rounded bg-[#131825] border border-gray-700 text-xs text-white outline-none w-24">
                            {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <div className="flex-1 space-y-2">
                            <input value={step.title} onChange={(e) => { const p = [...data.process]; p[i] = { ...p[i], title: e.target.value }; setData({ ...data, process: p }); }} placeholder="Title" className="w-full px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-sm text-white outline-none" />
                            <input value={step.description} onChange={(e) => { const p = [...data.process]; p[i] = { ...p[i], description: e.target.value }; setData({ ...data, process: p }); }} placeholder="Description" className="w-full px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-sm text-white outline-none" />
                        </div>
                        <button onClick={() => setData({ ...data, process: data.process.filter((_, j) => j !== i) })} className="p-1 text-gray-500 hover:text-red-400 self-start"><X size={14} /></button>
                    </div>
                ))}
                <button onClick={() => setData({ ...data, process: [...data.process, { icon: "Code2", title: "", description: "" }] })} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"><Plus size={12} /> Add Step</button>
            </section>

            {/* Values */}
            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Values</h3>
                {data.values.map((v, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-[#0a0e1a]">
                        <select value={v.icon} onChange={(e) => { const vs = [...data.values]; vs[i] = { ...vs[i], icon: e.target.value }; setData({ ...data, values: vs }); }} className="px-2 py-1 rounded bg-[#131825] border border-gray-700 text-xs text-white outline-none w-24">
                            {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <div className="flex-1 space-y-2">
                            <input value={v.title} onChange={(e) => { const vs = [...data.values]; vs[i] = { ...vs[i], title: e.target.value }; setData({ ...data, values: vs }); }} className="w-full px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-sm text-white outline-none" />
                            <input value={v.description} onChange={(e) => { const vs = [...data.values]; vs[i] = { ...vs[i], description: e.target.value }; setData({ ...data, values: vs }); }} className="w-full px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-sm text-white outline-none" />
                        </div>
                        <button onClick={() => setData({ ...data, values: data.values.filter((_, j) => j !== i) })} className="p-1 text-gray-500 hover:text-red-400 self-start"><X size={14} /></button>
                    </div>
                ))}
            </section>

            {/* Tools */}
            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Tools & Stack</h3>
                {data.tools.map((group, gi) => (
                    <div key={gi} className="p-3 rounded-lg bg-[#0a0e1a] space-y-2">
                        <div className="flex gap-2 items-center">
                            <input value={group.category} onChange={(e) => { const t = [...data.tools]; t[gi] = { ...t[gi], category: e.target.value }; setData({ ...data, tools: t }); }} className="px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-sm text-white outline-none font-semibold" />
                            <button onClick={() => setData({ ...data, tools: data.tools.filter((_, j) => j !== gi) })} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {group.items.map((tool, ti) => (
                                <span key={ti} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-800 text-gray-300">
                                    {tool} <button onClick={() => { const t = [...data.tools]; t[gi] = { ...t[gi], items: t[gi].items.filter((_, j) => j !== ti) }; setData({ ...data, tools: t }); }}><X size={10} /></button>
                                </span>
                            ))}
                        </div>
                        <input placeholder="Add tool + Enter" onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) { const t = [...data.tools]; t[gi] = { ...t[gi], items: [...t[gi].items, (e.target as HTMLInputElement).value.trim()] }; setData({ ...data, tools: t }); (e.target as HTMLInputElement).value = ""; } }} className="w-full px-2 py-1.5 rounded bg-[#131825] border border-gray-700 text-xs text-white outline-none" />
                    </div>
                ))}
                <button onClick={() => setData({ ...data, tools: [...data.tools, { category: "New", items: [] }] })} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"><Plus size={12} /> Add Category</button>
            </section>
        </div>
    );
}
