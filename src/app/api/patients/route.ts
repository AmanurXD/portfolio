import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";

type PatientEntry = {
  id: string;
  patientName: string;
  age: number;
  notes: string;
  createdAt: string;
};

const entries: PatientEntry[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, age, notes, turnstileToken } = body ?? {};

    if (!patientName || !age || !notes) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing Turnstile token",
        },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const remoteip = forwardedFor?.split(",")[0]?.trim();

    const result = await verifyTurnstile({
      token: turnstileToken,
      remoteip,
      idempotencyKey: crypto.randomUUID(),
    });

    const hostnameOk =
      !result.hostname || result.hostname === "jamesbenett.zone.id";

    if (!result.success || !hostnameOk) {
      return NextResponse.json(
        {
          ok: false,
          message: "Turnstile verification failed",
          details: {
            success: result.success,
            hostname: result.hostname,
            challenge_ts: result.challenge_ts,
            errorCodes: hostnameOk
              ? result["error-codes"] ?? []
              : [...(result["error-codes"] ?? []), "hostname-mismatch"],
          },
        },
        { status: 400 }
      );
    }

    const entry: PatientEntry = {
      id: crypto.randomUUID(),
      patientName: String(patientName),
      age: Number(age),
      notes: String(notes),
      createdAt: new Date().toISOString(),
    };

    entries.unshift(entry);

    return NextResponse.json({
      ok: true,
      message: "Patient entry added successfully",
      entry,
    });
  } catch (error) {
    console.error("POST /api/patients failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    entries,
  });
}