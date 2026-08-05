"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Calendar } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Msg = { role: "user" | "assistant"; content: string };

export function Chat({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const sessionRef = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: dict.chat.greeting }]);
    }
  }, [open, messages.length, dict.chat.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, loading, reduce]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history = messages.filter((m) => m.content !== dict.chat.greeting);
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionRef.current,
          locale,
          history,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("chat_failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });

        // Extraer metadata de sesion (prefijo \u0000META{...}\u0000)
        const metaMatch = acc.match(/^\u0000META(.*?)\u0000/s);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            if (meta.sessionId) sessionRef.current = meta.sessionId;
          } catch {
            /* noop */
          }
          acc = acc.slice(metaMatch[0].length);
        }

        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: dict.chat.error,
          };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: dict.chat.error };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(600px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {dict.chat.title}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {dict.chat.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-500 text-zinc-950"
                        : "border border-zinc-800 bg-zinc-900 text-zinc-200"
                    }`}
                  >
                    {m.content ||
                      (loading && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-zinc-500" />
                          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-zinc-500 [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-zinc-500 [animation-delay:0.4s]" />
                        </span>
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={dict.chat.placeholder}
                  className="max-h-28 flex-1 resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-40"
                  aria-label={dict.chat.send}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[10px] leading-tight text-zinc-600">
                  {dict.chat.disclaimer}
                </p>
                <a
                  href={`/${locale}#agenda`}
                  onClick={() => setOpen(false)}
                  className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                >
                  <Calendar className="h-3 w-3" />
                  {dict.chat.bookCta}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="group fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500 px-4 py-3 text-sm font-medium text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 sm:right-6"
        aria-label={dict.chat.launcher}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
        <span className="hidden sm:inline">{dict.chat.launcher}</span>
      </button>
    </>
  );
}
