import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { FAQ } from "@/lib/data";

export async function GET() {
    const items = readData<FAQ[]>("faqs.json");
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const items = readData<FAQ[]>("faqs.json");
    items.push(body);
    writeData("faqs.json", items);
    logActivity("Created", `FAQ "${body.question.substring(0, 50)}"`);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const idx = parseInt(searchParams.get("index") || "-1");
    const items = readData<FAQ[]>("faqs.json");
    if (idx < 0 || idx >= items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[idx] = body;
    writeData("faqs.json", items);
    logActivity("Updated", `FAQ "${body.question.substring(0, 50)}"`);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const idx = parseInt(searchParams.get("index") || "-1");
    const items = readData<FAQ[]>("faqs.json");
    if (idx < 0 || idx >= items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const removed = items.splice(idx, 1)[0];
    writeData("faqs.json", items);
    logActivity("Deleted", `FAQ "${removed.question.substring(0, 50)}"`);
    return NextResponse.json({ ok: true });
}
