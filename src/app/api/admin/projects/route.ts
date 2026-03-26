import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { Project } from "@/lib/data";

export async function GET() {
    const projects = readData<Project[]>("projects.json");
    return NextResponse.json(projects);
}

export async function POST(req: Request) {
    const body = await req.json();
    const projects = readData<Project[]>("projects.json");
    projects.push(body);
    writeData("projects.json", projects);
    logActivity("Created", `project "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const projects = readData<Project[]>("projects.json");
    const idx = projects.findIndex((p) => p.slug === body.slug);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    projects[idx] = body;
    writeData("projects.json", projects);
    logActivity("Updated", `project "${body.title}"`);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    let projects = readData<Project[]>("projects.json");
    const target = projects.find((p) => p.slug === slug);
    projects = projects.filter((p) => p.slug !== slug);
    writeData("projects.json", projects);
    logActivity("Deleted", `project "${target?.title || slug}"`);
    return NextResponse.json({ ok: true });
}
