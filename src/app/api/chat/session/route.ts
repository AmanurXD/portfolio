import { NextResponse } from "next/server";
import { getChatUser } from "@/lib/chat-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
    const user = await getChatUser();
    if (!user) return NextResponse.json(null);

    const supabase = getSupabaseAdmin();

    // Get user's conversation
    const { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.userId)
        .order("last_activity", { ascending: false })
        .limit(1)
        .single();

    return NextResponse.json({
        userId: user.userId,
        name: user.name,
        isGuest: user.isGuest,
        conversationId: conv?.id || null,
    });
}
