import { NextResponse } from "next/server";
import { getCaller } from "@/lib/chat-auth";

// In-memory typing state (per conversation)
const typingState = new Map<string, { name: string; isAdmin: boolean; until: number }>();

export async function POST(req: Request) {
    const caller = await getCaller();
    if (!caller) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { conversationId } = await req.json();
    if (!conversationId) return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });

    // Set typing for 3 seconds
    typingState.set(conversationId + ":" + (caller.isAdmin ? "admin" : "user"), {
        name: caller.name,
        isAdmin: caller.isAdmin,
        until: Date.now() + 3000,
    });

    return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const side = searchParams.get("side"); // "admin" or "user" - who is asking
    if (!conversationId) return NextResponse.json(null);

    const now = Date.now();
    // Return the OTHER party's typing state
    const otherSide = side === "admin" ? "user" : "admin";
    const key = conversationId + ":" + otherSide;
    const state = typingState.get(key);

    if (state && state.until > now) {
        return NextResponse.json({ typing: true, name: state.name });
    }

    // Clean up expired
    if (state) typingState.delete(key);

    return NextResponse.json({ typing: false });
}
