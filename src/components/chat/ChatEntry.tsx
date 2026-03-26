"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Mail, Lock, MessageCircle, Loader2, ArrowRight, UserPlus, LogIn } from "lucide-react";

type Mode = "choose" | "guest" | "register" | "login";

interface ChatEntryProps {
    onAuthenticated: (data: { userId: string; userName: string; conversationId: string }) => void;
}

function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
        if (!siteKey) return;

        // Load Turnstile script
        if (!document.getElementById("cf-turnstile-script")) {
            const script = document.createElement("script");
            script.id = "cf-turnstile-script";
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.onload = () => setLoaded(true);
            document.head.appendChild(script);
        } else {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
        if (!siteKey || !(window as any).turnstile) return;

        const container = document.getElementById("turnstile-container");
        if (!container || container.children.length > 0) return;

        (window as any).turnstile.render("#turnstile-container", {
            sitekey: siteKey,
            theme: "dark",
            callback: (token: string) => onToken(token),
        });
    }, [loaded, onToken]);

    return <div id="turnstile-container" className="flex justify-center my-3" />;
}

export function ChatEntry({ onAuthenticated }: ChatEntryProps) {
    const [mode, setMode] = useState<Mode>("choose");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleToken = useCallback((token: string) => {
        setTurnstileToken(token);
    }, []);

    const handleGuest = async () => {
        if (!name.trim() || !turnstileToken) return;
        setLoading(true);
        setError("");
        const res = await fetch("/api/chat/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), turnstileToken }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
        onAuthenticated({ userId: data.user.id, userName: data.user.name, conversationId: data.conversationId });
    };

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password || !turnstileToken) return;
        setLoading(true);
        setError("");
        const res = await fetch("/api/chat/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), email: email.trim(), password, turnstileToken }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
        onAuthenticated({ userId: data.user.id, userName: data.user.name, conversationId: data.conversationId });
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) return;
        setLoading(true);
        setError("");
        const res = await fetch("/api/chat/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
        onAuthenticated({ userId: data.user.id, userName: data.user.name, conversationId: data.conversationId });
    };

    if (mode === "choose") {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-3">
                        <MessageCircle size={24} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Live Chat</h3>
                    <p className="text-sm text-foreground-muted mt-1">Chat with James in real-time. Get answers in minutes.</p>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => setMode("guest")}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left hover:border-accent/40 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <MessageCircle size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">Quick Chat</p>
                            <p className="text-xs text-foreground-muted">Start chatting instantly as a guest</p>
                        </div>
                        <ArrowRight size={14} className="text-foreground-muted group-hover:text-accent transition-colors" />
                    </button>

                    <button
                        onClick={() => setMode("register")}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left hover:border-accent/40 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <UserPlus size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">Create Account</p>
                            <p className="text-xs text-foreground-muted">Save chat history & get notifications</p>
                        </div>
                        <ArrowRight size={14} className="text-foreground-muted group-hover:text-accent transition-colors" />
                    </button>

                    <button
                        onClick={() => setMode("login")}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left hover:border-accent/40 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <LogIn size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">Sign In</p>
                            <p className="text-xs text-foreground-muted">Continue a previous conversation</p>
                        </div>
                        <ArrowRight size={14} className="text-foreground-muted group-hover:text-accent transition-colors" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <button onClick={() => { setMode("choose"); setError(""); }} className="flex items-center gap-1 text-xs text-foreground-muted hover:text-accent mb-4 transition-colors">
                ← Back
            </button>

            <h3 className="text-base font-bold text-foreground mb-1">
                {mode === "guest" ? "Quick Chat" : mode === "register" ? "Create Account" : "Sign In"}
            </h3>
            <p className="text-xs text-foreground-muted mb-4">
                {mode === "guest" ? "Enter your name to start chatting." : mode === "register" ? "Create an account to save your chats." : "Sign in to continue your conversation."}
            </p>

            {error && <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-3">{error}</div>}

            <div className="space-y-3">
                {(mode === "guest" || mode === "register") && (
                    <div>
                        <label className="block text-xs text-foreground-muted mb-1">Name</label>
                        <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/50" />
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={50}
                                className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/40 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                    </div>
                )}

                {(mode === "register" || mode === "login") && (
                    <div>
                        <label className="block text-xs text-foreground-muted mb-1">Email</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/50" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                                className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/40 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                    </div>
                )}

                {(mode === "register" || mode === "login") && (
                    <div>
                        <label className="block text-xs text-foreground-muted mb-1">Password</label>
                        <div className="relative">
                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/50" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "register" ? "6+ characters" : "Your password"}
                                className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/40 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                        </div>
                    </div>
                )}

                {mode !== "login" && <TurnstileWidget onToken={handleToken} />}

                <button
                    onClick={mode === "guest" ? handleGuest : mode === "register" ? handleRegister : handleLogin}
                    disabled={loading || (mode === "guest" ? !name.trim() || !turnstileToken : mode === "login" ? !email.trim() || !password : !name.trim() || !email.trim() || !password || !turnstileToken)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                    {loading ? "Connecting..." : "Start Chatting"}
                </button>
            </div>
        </div>
    );
}
