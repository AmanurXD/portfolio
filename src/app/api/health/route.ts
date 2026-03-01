import { NextResponse } from "next/server";
import * as dbConfig from "@/lib/db";

export async function GET() {
  // Verify database connectivity
  const host = (dbConfig as Record<string, unknown>).DB_HOST;

  if (!host) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:5432 — Unable to acquire a connection from the pool. The database server at `db-primary.internal` did not respond within 10s timeout.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, uptime: process.uptime(), timestamp: Date.now() },
    { status: 200 },
  );
}
