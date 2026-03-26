"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Loader2, Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { ChatWindow } from "@/components/chat/ChatWindow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Conversation {
    id: string;
    user_id: string;
    status: string;
    last_message: string;
    last_activity: string;
    admin_unread: number;
    user_unread: number;
    created_at: string;
    chat_users: { name: string; avatar_color: string; is_guest: boolean; email: string | null };
}

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [search, setSearch] = useState("");

    const fetchConversations = async () => {
        const res = await fetch("/api/chat/conversations");
        if (res.ok) setConversations(await res.json());
        setLoadingConvs(false);
    };

    useEffect(() => { fetchConversations(); }, []);

    // Realtime: conversation updates
    useEffect(() => {
        const channel = supabase
            .channel("admin-conv-list")
            .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        if (diff < 60_000) return "Now";
        if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m`;
        if (diff < 86400_000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    const filtered = conversations.filter((c) =>
        !search || c.chat_users?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, c) => sum + (c.admin_unread || 0), 0);
    const activeConv = conversations.find((c) => c.id === activeConvId) || null;

    return (
        <div className="flex h-[calc(100vh-80px)] -m-6 lg:-m-8">
            {/* Conversations List */}
            <div className={`${activeConvId ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-80 border-r border-gray-800 bg-[#0a0e1a]`}>
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white">
                            Messages
                            {totalUnread > 0 && (
                                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{totalUnread}</span>
                            )}
                        </h2>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#131825] border border-gray-700 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-gray-500" size={20} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageCircle size={32} className="text-gray-700 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No conversations yet</p>
                            <p className="text-xs text-gray-600 mt-1">Chats from visitors will appear here</p>
                        </div>
                    ) : (
                        filtered.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setActiveConvId(conv.id);
                                    // Mark as read when opening
                                    fetch("/api/chat/read", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ conversationId: conv.id }),
                                    }).then(() => fetchConversations());
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-800/50 hover:bg-[#131825] transition-colors ${activeConvId === conv.id ? "bg-[#131825] border-l-2 border-l-blue-500" : ""
                                    }`}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                    style={{ background: conv.chat_users?.avatar_color || "#3B82F6" }}
                                >
                                    {conv.chat_users?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-white truncate">
                                            {conv.chat_users?.name || "Unknown"}
                                        </span>
                                        <span className="text-[10px] text-gray-500 ml-2 shrink-0">{formatTime(conv.last_activity)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        {conv.chat_users?.is_guest && (
                                            <span className="text-[9px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Guest</span>
                                        )}
                                        <p className="text-xs text-gray-400 truncate">{conv.last_message || "New conversation"}</p>
                                    </div>
                                </div>
                                {(conv.admin_unread || 0) > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                                        {conv.admin_unread}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#0d1117]">
                {!activeConv ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageCircle size={48} className="text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm font-medium">Select a conversation</p>
                            <p className="text-gray-600 text-xs mt-1">Choose from the list to start replying</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800 bg-[#0a0e1a]">
                            <button
                                onClick={() => setActiveConvId(null)}
                                className="lg:hidden p-1 text-gray-400 hover:text-white mr-1 text-lg"
                            >
                                ←
                            </button>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: activeConv.chat_users?.avatar_color || "#3B82F6" }}
                            >
                                {activeConv.chat_users?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-white">{activeConv.chat_users?.name}</h3>
                                <p className="text-[10px] text-gray-500">
                                    {activeConv.chat_users?.is_guest ? "Guest" : activeConv.chat_users?.email}
                                    {" • Started "}
                                    {new Date(activeConv.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Reuse ChatWindow with isAdmin=true */}
                        <div className="flex-1 min-h-0">
                            <ChatWindow
                                key={activeConv.id}
                                conversationId={activeConv.id}
                                userId="admin"
                                userName="James Benett"
                                isAdmin={true}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
