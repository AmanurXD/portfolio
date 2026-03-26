import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { Service } from "@/lib/data";

export async function GET() {
    const services = readData<Service[]>("services.json");
    return NextResponse.json(services);
}

export async function POST(req: Request) {
    const body = await req.json();
    const services = readData<Service[]>("services.json");
    services.push(body);
    writeData("services.json", services);
    logActivity("Created", `service "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const services = readData<Service[]>("services.json");
    const idx = services.findIndex((s) => s.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    services[idx] = body;
    writeData("services.json", services);
    logActivity("Updated", `service "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    let services = readData<Service[]>("services.json");
    const target = services.find((s) => s.id === id);
    services = services.filter((s) => s.id !== id);
    writeData("services.json", services);
    logActivity("Deleted", `service "${target?.title || id}"`);
    return NextResponse.json({ ok: true });
}
