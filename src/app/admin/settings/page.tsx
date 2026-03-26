"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";

interface SiteConfig {
    name: string; brand: string; title: string; description: string; tagline: string;
    url: string; ogImage: string; email: string; fiverrUrl: string; githubUrl: string; linkedinUrl: string;
    nav: { label: string; href: string }[];
    stats: { label: string; value: number; suffix: string }[];
    footer: { copyright: string; links: { label: string; href: string }[] };
}

export default function SettingsAdmin() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { setConfig(await (await fetch("/api/admin/settings")).json()); setLoading(false); };

    const save = async () => {
        if (!config) return; setSaving(true);
        await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    if (loading || !config) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;

    const F = (field: keyof SiteConfig) => ({
        value: config[field] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setConfig({ ...config, [field]: e.target.value }),
        className: "w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white focus:border-blue-500 outline-none"
    });

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-white">Site Settings</h2></div>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? "Saved!" : "Save"}
                </button>
            </div>

            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Name</label><input {...F("name")} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Brand</label><input {...F("brand")} /></div>
                </div>
                <div><label className="block text-xs text-gray-400 mb-1">Title</label><input {...F("title")} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Description</label><textarea {...F("description")} rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Tagline</label><input {...F("tagline")} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Site URL</label><input {...F("url")} /></div>
                </div>
            </section>

            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Contact & Social</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Email</label><input {...F("email")} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Fiverr URL</label><input {...F("fiverrUrl")} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">GitHub URL</label><input {...F("githubUrl")} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">LinkedIn URL</label><input {...F("linkedinUrl")} /></div>
                </div>
            </section>

            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Stats</h3>
                {config.stats.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3">
                        <input value={s.label} onChange={(e) => { const st = [...config.stats]; st[i] = { ...st[i], label: e.target.value }; setConfig({ ...config, stats: st }); }} className="px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" />
                        <input type="number" value={s.value} onChange={(e) => { const st = [...config.stats]; st[i] = { ...st[i], value: parseInt(e.target.value) || 0 }; setConfig({ ...config, stats: st }); }} className="px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" />
                        <div className="flex gap-2">
                            <input value={s.suffix} onChange={(e) => { const st = [...config.stats]; st[i] = { ...st[i], suffix: e.target.value }; setConfig({ ...config, stats: st }); }} className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" />
                            <button onClick={() => setConfig({ ...config, stats: config.stats.filter((_, j) => j !== i) })} className="p-2 text-gray-500 hover:text-red-400"><X size={14} /></button>
                        </div>
                    </div>
                ))}
                <button onClick={() => setConfig({ ...config, stats: [...config.stats, { label: "", value: 0, suffix: "" }] })} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"><Plus size={12} /> Add Stat</button>
            </section>

            <section className="rounded-xl bg-[#131825] border border-gray-800 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Footer</h3>
                <input value={config.footer.copyright} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, copyright: e.target.value } })} className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-700 text-sm text-white outline-none" />
            </section>
        </div>
    );
}
