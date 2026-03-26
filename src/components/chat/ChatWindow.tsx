"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Shield, Loader2, MessageCircle, Smile } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Message {
    id: string;
    conversation_id: string;
    sender_type: "user" | "admin";
    sender_id: string;
    text: string;
    read: boolean;
    created_at: string;
}

interface ChatWindowProps {
    conversationId: string;
    userId: string;
    userName: string;
    isAdmin?: boolean;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "🙏", "🔥"];

export function ChatWindow({ conversationId, userId, userName, isAdmin = false }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [otherTyping, setOtherTyping] = useState(false);
    const [showReactions, setShowReactions] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageIdsRef = useRef(new Set<string>());
    const pendingTextsRef = useRef(new Set<string>());

    // Load messages
    useEffect(() => {
        async function load() {
            const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
            if (res.ok) {
                const msgs: Message[] = await res.json();
                messageIdsRef.current = new Set(msgs.map(m => m.id));
                pendingTextsRef.current.clear();
                setMessages(msgs);
            }
            setLoading(false);
        }
        load();
    }, [conversationId]);

    // Supabase Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`chat:${conversationId}:${isAdmin ? "admin" : "user"}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;

                    // Skip if we already have this message by ID
                    if (messageIdsRef.current.has(newMsg.id)) return;

                    // If this is our own message (from optimistic update), replace the temp
                    const mySenderType = isAdmin ? "admin" : "user";
                    if (newMsg.sender_type === mySenderType && pendingTextsRef.current.has(newMsg.text)) {
                        pendingTextsRef.current.delete(newMsg.text);
                        messageIdsRef.current.add(newMsg.id);
                        setMessages((prev) => {
                            // Remove the temp message and add real one
                            const tempIdx = prev.findIndex(
                                (m) => m.id.startsWith("temp-") && m.text === newMsg.text
                            );
                            if (tempIdx !== -1) {
                                const updated = [...prev];
                                updated[tempIdx] = newMsg;
                                return updated;
                            }
                            return prev;
                        });
                        return;
                    }

                    // It's a message from the other party
                    messageIdsRef.current.add(newMsg.id);
                    setMessages((prev) => [...prev, newMsg]);
                    setOtherTyping(false);

                    // Auto-mark as read
                    fetch("/api/chat/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ conversationId }),
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const updated = payload.new as Message;
                    setMessages((prev) =>
                        prev.map((m) => (m.id === updated.id ? { ...m, read: updated.read } : m))
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, isAdmin]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, otherTyping]);

    // Typing indicator polling
    useEffect(() => {
        const side = isAdmin ? "admin" : "user";
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/chat/typing?conversationId=${conversationId}&side=${side}`);
                const data = await res.json();
                setOtherTyping(data?.typing || false);
            } catch { }
        }, 1500);

        return () => clearInterval(interval);
    }, [conversationId, isAdmin]);

    // Send typing indicator on input change
    const notifyTyping = useCallback(() => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            fetch("/api/chat/typing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId }),
            });
        }, 300);
    }, [conversationId]);

    const sendMessage = async (text?: string) => {
        const msgText = (text || input).trim();
        if (!msgText || sending) return;
        setSending(true);
        if (!text) setInput("");

        // Optimistic update
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const tempMsg: Message = {
            id: tempId,
            conversation_id: conversationId,
            sender_type: isAdmin ? "admin" : "user",
            sender_id: userId,
            text: msgText,
            read: false,
            created_at: new Date().toISOString(),
        };
        pendingTextsRef.current.add(msgText);
        setMessages((prev) => [...prev, tempMsg]);

        try {
            const res = await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, text: msgText }),
            });

            if (!res.ok) {
                // Rollback
                pendingTextsRef.current.delete(msgText);
                setMessages((prev) => prev.filter((m) => m.id !== tempId));
                if (!text) setInput(msgText);
            }
        } catch {
            pendingTextsRef.current.delete(msgText);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            if (!text) setInput(msgText);
        }
        setSending(false);
        inputRef.current?.focus();
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDateSeparator = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        if (diff < 86400_000) return "Today";
        if (diff < 172800_000) return "Yesterday";
        return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    };

    // Group messages by date
    const groupedMessages: { date: string; msgs: Message[] }[] = [];
    messages.forEach((msg) => {
        const dateKey = new Date(msg.created_at).toDateString();
        const last = groupedMessages[groupedMessages.length - 1];
        if (last && last.date === dateKey) {
            last.msgs.push(msg);
        } else {
            groupedMessages.push({ date: dateKey, msgs: [msg] });
        }
    });

    const myType = isAdmin ? "admin" : "user";
    const otherName = isAdmin ? "User" : "James";

    return (
        <div className="flex flex-col h-[520px] rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            {!isAdmin && (
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface/50">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                        <Shield size={16} className="text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground">James Benett</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-foreground-muted">
                                {otherTyping ? "Typing..." : "Online • Replies within minutes"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-foreground-muted" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                            <MessageCircle size={20} className="text-accent" />
                        </div>
                        <p className="text-sm text-foreground-muted">No messages yet.</p>
                        <p className="text-xs text-foreground-muted/60 mt-1">
                            Say hi! {isAdmin ? "Reply to start the conversation." : "James typically responds within minutes."}
                        </p>
                    </div>
                ) : (
                    groupedMessages.map((group) => (
                        <div key={group.date}>
                            {/* Date separator */}
                            <div className="flex items-center justify-center my-3">
                                <span className="text-[10px] text-foreground-muted/50 bg-surface px-3 py-0.5 rounded-full">
                                    {formatDateSeparator(group.msgs[0].created_at)}
                                </span>
                            </div>
                            {group.msgs.map((msg, idx) => {
                                const isMine = msg.sender_type === myType;
                                const showAvatar = !isMine && (idx === 0 || group.msgs[idx - 1]?.sender_type !== msg.sender_type);
                                const isLast = idx === group.msgs.length - 1 || group.msgs[idx + 1]?.sender_type !== msg.sender_type;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"} ${isLast ? "mb-2" : "mb-0.5"} group relative`}
                                    >
                                        {/* Avatar for other party */}
                                        {!isMine && (
                                            <div className="w-7 mr-2 shrink-0">
                                                {showAvatar && (
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isAdmin ? "bg-blue-500" : "bg-accent"}`}>
                                                        {isAdmin ? "U" : "J"}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="max-w-[75%] relative">
                                            <div
                                                className={`px-3.5 py-2 text-sm leading-relaxed ${isMine
                                                        ? isAdmin
                                                            ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                                                            : "bg-accent text-accent-foreground rounded-2xl rounded-br-md"
                                                        : isAdmin
                                                            ? "bg-[#1a1f2e] text-gray-200 border border-gray-700 rounded-2xl rounded-bl-md"
                                                            : "bg-surface border border-border text-foreground rounded-2xl rounded-bl-md"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>

                                            {/* Time + Read receipt (only on last in group) */}
                                            {isLast && (
                                                <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"} ${!isMine ? "ml-0" : ""}`}>
                                                    <span className="text-[10px] text-foreground-muted/40">{formatTime(msg.created_at)}</span>
                                                    {isMine && (
                                                        <span className={`text-[10px] ${msg.read ? "text-blue-400" : "text-foreground-muted/30"}`}>
                                                            {msg.read ? "✓✓" : "✓"}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Quick reaction button */}
                                            <button
                                                onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                                                className={`absolute ${isMine ? "-left-8" : "-right-8"} top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-surface`}
                                            >
                                                <Smile size={14} className="text-foreground-muted/50" />
                                            </button>

                                            {/* Reaction picker */}
                                            {showReactions === msg.id && (
                                                <div className={`absolute ${isMine ? "right-0" : "left-0"} -top-10 flex gap-1 bg-card border border-border rounded-full px-2 py-1 shadow-lg z-10`}>
                                                    {QUICK_REACTIONS.map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                sendMessage(emoji);
                                                                setShowReactions(null);
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface transition-colors text-sm"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}

                {/* Typing indicator */}
                {otherTyping && (
                    <div className="flex items-center gap-2 pl-9">
                        <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-2.5">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-surface/30">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (e.target.value) notifyTyping();
                        }}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Type a message..."
                        maxLength={2000}
                        className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${isAdmin
                                ? "border-gray-700 bg-[#131825] text-white placeholder:text-gray-500 focus:border-blue-500"
                                : "border-border bg-card text-foreground placeholder:text-foreground-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                            }`}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || sending}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all ${isAdmin ? "bg-blue-600 hover:bg-blue-500" : "bg-accent hover:bg-accent-hover text-accent-foreground"
                            }`}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
