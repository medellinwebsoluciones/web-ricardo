"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { site, mailtoContact } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Contact({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, locale, website }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section-pad border-t border-zinc-900">
      <div className="container-tight">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="eyebrow">{t.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
                {t.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg text-zinc-400">{t.subheading}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 space-y-3">
                <a
                  href={mailtoContact(locale)}
                  className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-emerald-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  {site.email}
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-emerald-400">
                    <LinkedInIcon className="h-4 w-4" />
                  </span>
                  LinkedIn
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {status === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <p className="mt-4 text-lg font-medium text-white">
                  {t.success}
                </p>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      {t.nameLabel}
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field mt-2"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      {t.emailLabel}
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field mt-2"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      {t.phoneLabel}
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field mt-2"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      {t.messageLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="input-field mt-2 resize-none"
                    />
                  </div>
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  {status === "error" && (
                    <p className="text-sm text-red-400">{t.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary w-full"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t.submit}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
