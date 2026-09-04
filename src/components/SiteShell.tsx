import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { Chat } from "@/components/Chat";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteShell({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyticsTracker locale={locale} />
      <Header locale={locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} />
      <Chat locale={locale} dict={dict} />
      <FloatingWhatsApp locale={locale} label={dict.contact.whatsappAria} />
    </>
  );
}
