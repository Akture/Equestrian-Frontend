import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import PricingTeaser from '@/components/PricingTeaser';
import { pricingCopy, tickerLines } from '@/lib/copy';
import { includedInEveryWindow } from '@/lib/pricing';
import { media } from '@/lib/media';

export const metadata = { title: 'Pricing — Akture Equestrian' };

export default function PricingPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36">
        <section className="relative px-6 md:px-12 pb-16">
          <div className="absolute inset-0 bg-hatch opacity-60 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="flex items-center justify-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              {pricingCopy.eyebrow}
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-ink dark:text-oat">
              {pricingCopy.heading}
            </h1>
            <p className="mt-6 text-ink/60 dark:text-oat/60 leading-relaxed">{pricingCopy.sub}</p>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <PricingTeaser />
          </div>
        </section>

        {/* What comes with every window ----------------------------------- */}
        <section className="py-20 bg-pine-deep text-oat">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <SectionHeading eyebrow="With every video" heading="What comes with every purchase" align="left" onDark className="mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {includedInEveryWindow.map((item) => (
                <div key={item} className="flex items-start gap-3 text-oat/75 text-[0.92rem]">
                  <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-hermes/20 text-hermes-light flex items-center justify-center">
                    <i className="ph-bold ph-check text-[0.6rem]" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="py-20 bg-oat dark:bg-ink">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-[1.7rem] md:text-[2.1rem] text-ink dark:text-oat mb-4">
              Questions before you buy
            </h2>
            <p className="text-ink/60 dark:text-oat/55 mb-8 leading-relaxed">
              What the cameras cover, who can see your footage, and what happens if a lesson
              runs long.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink/15 dark:border-oat/20 font-label text-sm font-semibold text-ink/75 dark:text-oat/75 hover:border-brass hover:text-brass-ink dark:hover:text-brass transition-colors"
            >
              Read the FAQ
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
