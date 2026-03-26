import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createChatSession } from "@/lib/chat-auth";
import { checkRateLimit } from "@/lib/turnstile";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    if (!email?.trim() || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`login:${ip}`, 10)) {
        return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    const supabase = getSupabaseAdmin();

    const { data: user } = await supabase
        .from("chat_users")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .single();

    if (!user || !user.password_hash) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Find or create conversation
    let { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("last_activity", { ascending: false })
        .limit(1)
        .single();

    if (!conv) {
        const { data: newConv } = await supabase
            .from("conversations")
            .insert({ user_id: user.id, last_message: "", admin_unread: 0, user_unread: 0 })
            .select()
            .single();
        conv = newConv;
    }

    const cookie = await createChatSession({ userId: user.id, name: user.name, isGuest: false });

    const response = NextResponse.json({
        ok: true,
        user: { id: user.id, name: user.name, email: user.email, avatarColor: user.avatar_color },
        conversationId: conv?.id,
    });
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
}
