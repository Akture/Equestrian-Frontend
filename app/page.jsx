import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import HeroCarousel from '@/components/HeroCarousel';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/FeatureGrid';
import MultiCamShowcase from '@/components/MultiCamShowcase';
import PricingTeaser from '@/components/PricingTeaser';
import BarnCard from '@/components/BarnCard';
import { barnFeatures, pricingCopy, riderFeatures, tickerLines } from '@/lib/copy';
import { barns } from '@/lib/barns';
import { media } from '@/lib/media';

// The barn carousel waits until there are at least three real, signed barns
// (10/13 review). Mock barns never show on the homepage.
const liveBarns = barns.filter((barn) => barn.live);

export default function HomePage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />
      <HeroCarousel />

      {/* For riders and families */}
      <Section tone="oat" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            eyebrow="For riders and families"
            heading="Finding your ride takes a few seconds"
            sub="You buy a stretch of time in one arena. Everything below is about getting you to the part you care about."
            className="mb-16"
          />
          <FeatureGrid items={riderFeatures} />
        </div>
      </Section>

      <MultiCamShowcase />

      {/* For barns, on the green ground */}
      <Section tone="pine" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            eyebrow="For barns"
            heading="Video your clients want, with nothing for you to manage"
            sub="The cameras go in once. Nothing about the barn’s day changes."
            onDark
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
            {barnFeatures.map((item) => (
              <div key={item.title} className="border-t border-hermes/40 pt-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-hermes/40 bg-hermes/10 text-hermes-light">
                  <i className={`${item.icon} text-xl`} />
                </div>
                <h3 className="font-display text-xl text-oat mb-2.5">{item.title}</h3>
                <p className="text-oat/65 text-[0.9rem] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link
              href="/barns#bring-akture"
              className="btn-hermes inline-flex items-center gap-2 px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
            >
              Talk to us about your arena
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Pricing preview */}
      <Section tone="oat" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            eyebrow={pricingCopy.eyebrow}
            heading={pricingCopy.heading}
            sub={pricingCopy.sub}
            className="mb-14"
          />
          <PricingTeaser />

          <p className="text-center mt-10">
            <Link
              href="/pricing"
              className="font-label text-sm font-semibold text-hermes-ink dark:text-hermes-light hover:underline underline-offset-4"
            >
              See pricing →
            </Link>
          </p>
        </div>
      </Section>

      {/* Barn carousel, held until three real barns are live */}
      {liveBarns.length >= 3 && (
      <Section tone="oatDim" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <SectionHeading eyebrow="Our barns" heading="Explore our barns" align="left" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveBarns.slice(0, 3).map((barn) => (
              <BarnCard key={barn.slug} barn={barn} />
            ))}
          </div>

          <p className="mt-10">
            <Link
              href="/barns"
              className="font-label text-sm font-semibold text-hermes-ink dark:text-hermes-light hover:underline underline-offset-4"
            >
              See all barns →
            </Link>
          </p>
        </div>
      </Section>
      )}

      {/* Closing band */}
      <section className="relative py-28 overflow-hidden">
        <img src={media.barnAisleWarm} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(8,17,13,0.88)' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-[1.9rem] md:text-[2.5rem] leading-tight text-oat mb-5">
            Want the cameras in your arena?
          </h2>
          <p className="text-oat/70 leading-relaxed mb-9">
            We are installing at our first barns now, and spacing them out so each one teaches us
            something before the next. If your arena hosts lessons or shows, we would like to walk it.
          </p>
          <Link
            href="/barns#bring-akture"
            className="btn-hermes inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-label text-sm font-semibold shadow-hermes-md"
          >
            Talk to us
            <i className="ph-bold ph-arrow-right text-sm" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
