import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCaller } from "@/lib/chat-auth";

export async function GET(req: Request) {
    const caller = await getCaller();
    if (!caller) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
        return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(200);

    return NextResponse.json(messages || []);
}
