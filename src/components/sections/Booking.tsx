"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, Video, CheckCircle2, Loader2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Slot = { label: string; startIso: string };

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function Booking({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.booking;
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    whenHuman: string;
    meetLink: string | null;
  } | null>(null);
  const [error, setError] = useState("");

  const loadSlots = useCallback(async (d: string) => {
    setLoadingSlots(true);
    setSelected(null);
    setError("");
    try {
      const res = await fetch(`/api/booking/availability?date=${d}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadSlots(date);
  }, [date, loadSlots]);

  async function submit() {
    if (!selected || !name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          startIso: selected.startIso,
          locale,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error === "slot_taken") {
          setError(t.errorGeneric);
          loadSlots(date);
        } else {
          setError(t.errorGeneric);
        }
        return;
      }
      setSuccess({ whenHuman: data.whenHuman, meetLink: data.meetLink });
    } catch {
      setError(t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="agenda" className="section-pad border-t border-zinc-900">
      <div className="container-tight">
        <Reveal>
          <span className="eyebrow">{t.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">{t.subheading}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            {success ? (
              <div className="flex flex-col items-center px-8 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {t.successTitle}
                </h3>
                <p className="mt-2 max-w-md text-zinc-400">{t.successBody}</p>
                <p className="mt-4 font-medium text-zinc-200">
                  {success.whenHuman}
                </p>
                {success.meetLink && (
                  <a
                    href={success.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6"
                  >
                    <Video className="h-4 w-4" />
                    {t.meetLabel}
                  </a>
                )}
              </div>
            ) : (
              <div className="grid gap-0 md:grid-cols-2">
                {/* Fecha + slots */}
                <div className="border-b border-zinc-800 p-6 md:border-b-0 md:border-r">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    {t.dateLabel}
                  </label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field mt-2 [color-scheme:dark]"
                  />

                  <label className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    {t.slotLabel}
                  </label>
                  <div className="mt-3 min-h-[120px]">
                    {loadingSlots ? (
                      <p className="flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.loadingSlots}
                      </p>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-zinc-500">{t.noSlots}</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {slots.map((s) => (
                          <button
                            key={s.startIso}
                            onClick={() => setSelected(s)}
                            className={`rounded-lg border px-2 py-2 text-left text-xs transition-colors sm:text-sm ${
                              selected?.startIso === s.startIso
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-zinc-600">{t.tz}</p>
                </div>

                {/* Datos */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-zinc-300">
                        {t.nameLabel}
                      </label>
                      <input
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field mt-2"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-300">
                        {t.topicLabel}
                      </label>
                      <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        rows={2}
                        placeholder={t.topicPlaceholder}
                        className="input-field mt-2 resize-none"
                      />
                    </div>
                    {/* honeypot */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                      onClick={submit}
                      disabled={
                        submitting || !selected || !name.trim() || !email.trim()
                      }
                      className="btn-primary w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.submitting}
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4" />
                          {t.submit}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
