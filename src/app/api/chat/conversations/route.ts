import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCaller } from "@/lib/chat-auth";

export async function GET() {
    const caller = await getCaller();
    if (!caller) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data: conversations } = await supabase
        .from("conversations")
        .select("*, chat_users(name, avatar_color, is_guest, email)")
        .order("last_activity", { ascending: false });

    return NextResponse.json(conversations || []);
}
