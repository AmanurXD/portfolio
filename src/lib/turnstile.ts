export type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
  metadata?: {
    ephemeral_id?: string;
  };
};

type VerifyTurnstileParams = {
  token: string;
  remoteip?: string;
  idempotencyKey?: string;
};

export async function verifyTurnstile({
  token,
  remoteip,
  idempotencyKey,
}: VerifyTurnstileParams): Promise<TurnstileVerifyResponse> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not set");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  if (idempotencyKey) {
    body.set("idempotency_key", idempotencyKey);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Turnstile siteverify failed: ${res.status}`);
  }

  return (await res.json()) as TurnstileVerifyResponse;
}

// Rate limiter: in-memory store (fine for local dev / single-instance only)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxPerMinute: number = 30
): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= maxPerMinute) return false;

  entry.count += 1;
  return true;
}