import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { EngagementTrust } from "@/components/sections/EngagementTrust";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { MwsAgencyOffer } from "@/components/sections/MwsAgencyOffer";
import { LabTeaser } from "@/components/sections/LabTeaser";
import { Stack } from "@/components/sections/Stack";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Chat } from "@/components/Chat";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = getDictionary(l);

  return (
    <>
      <AnalyticsTracker locale={l} />
      <Header locale={l} dict={dict} />
      <main>
        <Hero dict={dict} />
        <About dict={dict} />
        <EngagementTrust dict={dict} />
        <CaseStudies dict={dict} locale={l} />
        <MwsAgencyOffer dict={dict} locale={l} />
        <LabTeaser locale={l} />
        <Stack dict={dict} />
        <Booking locale={l} dict={dict} />
        <Contact locale={l} dict={dict} />
      </main>
      <Footer locale={l} dict={dict} />
      <Chat locale={l} dict={dict} />
    </>
  );
}
