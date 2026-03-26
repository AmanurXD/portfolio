"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { ExternalLink, Mail, ChevronDown, Calendar } from "lucide-react";
import { FIVERR_URL, EMAIL } from "@/lib/constants";
import { faqs } from "@/content/faqs";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ChatEntry } from "@/components/chat/ChatEntry";
import { ChatWindow } from "@/components/chat/ChatWindow";

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
        }
      ) => string;
    };
  }
}

export default function ContactPage() {
  const [chatSession, setChatSession] = useState<{
    userId: string;
    userName: string;
    conversationId: string;
  } | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/chat/session");
        const data = await res.json();
        if (data?.userId && data?.conversationId) {
          setChatSession({
            userId: data.userId,
            userName: data.name,
            conversationId: data.conversationId,
          });
        }
      } catch {}
      setCheckingSession(false);
    }
    check();
  }, []);

  useEffect(() => {
    if (!turnstileReady || !window.turnstile) return;
    if (chatSession) return;

    const container = document.getElementById("turnstile-container");
    if (!container || container.childNodes.length > 0) return;

    window.turnstile.render(container, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      theme: "auto",
      size: "flexible",
      callback: (token: string) => {
        setTurnstileToken(token);
      },
      "expired-callback": () => {
        setTurnstileToken("");
      },
      "error-callback": () => {
        setTurnstileToken("");
      },
    });
  }, [turnstileReady, chatSession]);

  return (
    <div className="py-20 sm:py-24">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setTurnstileReady(true)}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <SectionHeading
            label="Contact"
            title="Let's Work Together"
            description="Have a project in mind, or need help fixing something? Chat with me in real-time."
          />
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <SectionReveal className="lg:col-span-3">
            {checkingSession ? (
              <div className="rounded-2xl border border-border bg-card h-[500px] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : chatSession ? (
              <ChatWindow
                conversationId={chatSession.conversationId}
                userId={chatSession.userId}
                userName={chatSession.userName}
              />
            ) : turnstileToken ? (
              <ChatEntry onAuthenticated={(data) => setChatSession(data)} />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 min-h-[260px] flex flex-col justify-center">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Verify before starting chat
                </h3>
                <p className="text-sm text-foreground-muted mb-5">
                  Complete the verification below to start a conversation.
                </p>

                <div id="turnstile-container" className="min-h-[70px]" />
              </div>
            )}
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:col-span-2">
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Fastest response
                </h3>
                <p className="text-sm text-foreground-muted mb-4">
                  For project inquiries, message me on Fiverr — I typically respond within minutes.
                </p>
                <a
                  href={FIVERR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1dbf73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19a463] transition-colors w-full justify-center"
                >
                  Message on Fiverr
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Email
                </h3>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  <Mail size={14} />
                  {EMAIL}
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Schedule a call
                </h3>
                <p className="text-sm text-foreground-muted mb-3">
                  Prefer a quick video call? Book a time that works for you.
                </p>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors w-full justify-center"
                  disabled
                >
                  <Calendar size={14} />
                  Coming Soon
                </button>
              </div>
            </div>
          </SectionReveal>
        </div>

        <div className="mt-16">
          <SectionReveal>
            <h2 className="text-lg font-bold text-foreground mb-6">Common Questions</h2>
          </SectionReveal>
          <div className="space-y-3">
            {faqs.slice(0, 5).map((faq, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <ContactFaqItem question={faq.question} answer={faq.answer} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
      >
        <span className="text-sm font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown
          size={16}
          className={`text-foreground-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 -mt-1">
          <p className="text-sm text-foreground-muted leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}