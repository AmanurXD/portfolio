import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCaller } from "@/lib/chat-auth";

export async function POST(req: Request) {
    const caller = await getCaller();
    if (!caller) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { conversationId } = await req.json();
    if (!conversationId) {
        return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: conv } = await supabase
        .from("conversations")
        .select("user_id")
        .eq("id", conversationId)
        .single();

    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Admin reads → reset admin_unread; User reads → reset user_unread
    if (caller.isAdmin) {
        await supabase.from("messages").update({ read: true })
            .eq("conversation_id", conversationId).eq("sender_type", "user").eq("read", false);
        await supabase.from("conversations").update({ admin_unread: 0 }).eq("id", conversationId);
    } else {
        await supabase.from("messages").update({ read: true })
            .eq("conversation_id", conversationId).eq("sender_type", "admin").eq("read", false);
        await supabase.from("conversations").update({ user_unread: 0 }).eq("id", conversationId);
    }

    return NextResponse.json({ ok: true });
}
