import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCaller } from "@/lib/chat-auth";
import { checkRateLimit } from "@/lib/turnstile";

function sanitize(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim();
}

export async function POST(req: Request) {
    const caller = await getCaller();
    if (!caller) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!checkRateLimit(`msg:${caller.id}`, 30)) {
        return NextResponse.json({ error: "Slow down! Too many messages." }, { status: 429 });
    }

    const body = await req.json();
    const { conversationId, text } = body;

    if (!conversationId || !text?.trim()) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const cleanText = sanitize(text.slice(0, 2000));
    if (!cleanText) {
        return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

    if (!conv) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const senderType = caller.isAdmin ? "admin" : "user";

    // Build insert data — sender_id is null for admin (no UUID), real user ID otherwise
    const insertData: Record<string, unknown> = {
        conversation_id: conversationId,
        sender_type: senderType,
        text: cleanText,
    };

    // Only set sender_id if it's a valid UUID (not "admin" string)
    if (!caller.isAdmin) {
        insertData.sender_id = caller.id;
    }

    const { data: message, error } = await supabase
        .from("messages")
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    // Update conversation
    const updateData: Record<string, unknown> = {
        last_message: cleanText.slice(0, 100),
        last_activity: new Date().toISOString(),
    };

    if (senderType === "user") {
        updateData.admin_unread = (conv.admin_unread || 0) + 1;
    } else {
        updateData.user_unread = (conv.user_unread || 0) + 1;
    }

    await supabase.from("conversations").update(updateData).eq("id", conversationId);

    return NextResponse.json({ ok: true, message });
}
