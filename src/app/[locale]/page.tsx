import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { EnterpriseStrip } from "@/components/sections/EnterpriseStrip";
import { About } from "@/components/sections/About";
import { EngagementTrust } from "@/components/sections/EngagementTrust";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { ProductsIntro } from "@/components/sections/ProductsIntro";
import { MwsAgencyOffer } from "@/components/sections/MwsAgencyOffer";
import { LabTeaser } from "@/components/sections/LabTeaser";
import { CareerTeaser } from "@/components/sections/CareerTeaser";
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
        <Hero dict={dict} locale={l} />
        <EnterpriseStrip dict={dict} locale={l} />
        <About dict={dict} />
        <EngagementTrust dict={dict} />
        <CaseStudies dict={dict} locale={l} />
        <CareerTeaser locale={l} dict={dict} />
        <ProductsIntro dict={dict} />
        <LabTeaser locale={l} />
        <MwsAgencyOffer dict={dict} locale={l} />
        <Stack dict={dict} />
        <Booking locale={l} dict={dict} />
        <Contact locale={l} dict={dict} />
      </main>
      <Footer locale={l} dict={dict} />
      <Chat locale={l} dict={dict} />
    </>
  );
}
