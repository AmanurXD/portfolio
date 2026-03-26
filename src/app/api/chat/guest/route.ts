import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createChatSession } from "@/lib/chat-auth";
import { verifyTurnstile, checkRateLimit } from "@/lib/turnstile";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, turnstileToken } = body;

    if (!name?.trim() || !turnstileToken) {
        return NextResponse.json({ error: "Name and captcha required" }, { status: 400 });
    }

    // Rate limit by IP-ish identifier
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`guest:${ip}`, 10)) {
        return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    // Verify captcha
    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();

    // Pick a random avatar color
    const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create guest user
    const { data: user, error } = await supabase
        .from("chat_users")
        .insert({ name: name.trim().slice(0, 50), is_guest: true, avatar_color: color })
        .select()
        .single();

    if (error || !user) {
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    // Create conversation
    const { data: conv } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, last_message: "", admin_unread: 0, user_unread: 0 })
        .select()
        .single();

    const cookie = await createChatSession({ userId: user.id, name: user.name, isGuest: true });

    const response = NextResponse.json({
        ok: true,
        user: { id: user.id, name: user.name, avatarColor: user.avatar_color },
        conversationId: conv?.id,
    });
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
}
