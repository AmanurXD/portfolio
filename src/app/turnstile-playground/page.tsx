"use client";

import { FormEvent, useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible";
          appearance?: "always" | "interaction-only" | "execute";
        }
      ) => string;
      reset?: (widgetId?: string) => void;
    };
  }
}

type ApiResponse = {
  ok: boolean;
  message?: string;
  entry?: {
    id: string;
    patientName: string;
    age: number;
    notes: string;
    createdAt: string;
  };
  details?: unknown;
};

export default function TurnstilePlaygroundPage() {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [widgetKey, setWidgetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!turnstileReady || !window.turnstile) return;

    const container = document.getElementById("turnstile-playground-container");
    if (!container) return;

    setTurnstileToken("");
    container.innerHTML = "";

    window.turnstile.render(container, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      appearance: "always",
      theme: "auto",
      size: "flexible",
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": () => {
        setTurnstileToken("");
        setWidgetKey((prev) => prev + 1);
      },
      "error-callback": () => {
        setTurnstileToken("");
        setWidgetKey((prev) => prev + 1);
      },
    });
  }, [turnstileReady, widgetKey]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName,
          age,
          notes,
          turnstileToken,
        }),
      });

      const data = (await res.json()) as ApiResponse;
      setResponse(data);

      if (res.ok) {
        setPatientName("");
        setAge("");
        setNotes("");
        setTurnstileToken("");
        setWidgetKey((prev) => prev + 1);
      }
    } catch {
      setResponse({
        ok: false,
        message: "Request failed",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setTurnstileReady(true)}
      />

      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            Turnstile Playground
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Test a protected form submission flow with Cloudflare Turnstile.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Patient name</label>
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Age</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                min="0"
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="32"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                rows={4}
                placeholder="Patient intake notes..."
                required
              />
            </div>

            <div
              key={widgetKey}
              id="turnstile-playground-container"
              className="min-h-[70px]"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || !turnstileToken}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Add patient entry"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTurnstileToken("");
                  setWidgetKey((prev) => prev + 1);
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
              >
                Reload verification
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-background p-4">
            <h2 className="text-sm font-semibold">Debug</h2>
            <p className="mt-2 text-xs text-foreground/70">
              Token present: {turnstileToken ? "yes" : "no"}
            </p>
            {response && (
              <pre className="mt-3 overflow-auto rounded-lg bg-black p-4 text-xs text-white">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}