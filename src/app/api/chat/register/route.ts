import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createChatSession } from "@/lib/chat-auth";
import { verifyTurnstile, checkRateLimit } from "@/lib/turnstile";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, email, password, turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !password || !turnstileToken) {
        return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 6) {
        return NextResponse.json({ error: "Password must be 6+ characters" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`register:${ip}`, 5)) {
        return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();

    // Check if email already exists
    const { data: existing } = await supabase
        .from("chat_users")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .single();

    if (existing) {
        return NextResponse.json({ error: "Email already registered. Please sign in." }, { status: 409 });
    }

    const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const hash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
        .from("chat_users")
        .insert({
            name: name.trim().slice(0, 50),
            email: email.trim().toLowerCase(),
            password_hash: hash,
            is_guest: false,
            avatar_color: color,
        })
        .select()
        .single();

    if (error || !user) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }

    // Create or find conversation
    const { data: conv } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, last_message: "", admin_unread: 0, user_unread: 0 })
        .select()
        .single();

    const cookie = await createChatSession({ userId: user.id, name: user.name, isGuest: false });

    const response = NextResponse.json({
        ok: true,
        user: { id: user.id, name: user.name, email: user.email, avatarColor: user.avatar_color },
        conversationId: conv?.id,
    });
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
}
