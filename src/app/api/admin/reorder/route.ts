import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

export async function PATCH(req: Request) {
    const { resource, items } = await req.json();

    const validResources = ["services", "projects", "testimonials", "faqs"];
    if (!validResources.includes(resource)) {
        return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
    }

    writeData(`${resource}.json`, items);
    return NextResponse.json({ ok: true });
}
