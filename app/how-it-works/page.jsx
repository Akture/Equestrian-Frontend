import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import MultiCamShowcase from '@/components/MultiCamShowcase';
import { barnSteps, howItWorks, theRig, tickerLines } from '@/lib/copy';
import { cameraRig } from '@/lib/barns';
import { media } from '@/lib/media';

export const metadata = { title: 'How it works — Akture Equestrian' };

export default function HowItWorksPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36">
        <Section tone="oat" className="pb-16">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <p className="flex items-center justify-center gap-3 font-label text-[0.85rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              How it works
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08]">
              How it works
            </h1>
            <p className="mt-6 text-ink/65 dark:text-oat/60 leading-relaxed">
              For riders and families: sign in, find the day and time you rode, and the footage is
              yours. For barns: a call, a visit and a one-day install.
            </p>
          </div>
        </Section>

        {/* The four rider steps, on the green ground */}
        <Section tone="pine" className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <SectionHeading eyebrow="For riders and families" heading="From sign-in to your footage" align="left" onDark className="mb-14" />
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
              {howItWorks.map((step) => (
                <li key={step.step}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-display text-3xl text-hermes-light leading-none">
                      {step.step}
                    </span>
                    <span className="flex-1 h-px bg-hermes/50" aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-xl text-oat mb-2.5">{step.title}</h2>
                  <p className="text-oat/65 text-[0.9rem] leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <MultiCamShowcase />

        {/* What we install */}
        <Section tone="oatDim" id="what-we-install" className="py-24 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <div className="rounded-2xl overflow-hidden border border-ink/15 dark:border-oat/15">
                <img
                  src={media.coveredArena}
                  alt="Interior of a covered riding arena"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <SectionHeading
                  eyebrow={theRig.eyebrow}
                  heading={theRig.heading}
                  sub={theRig.sub}
                  align="left"
                  className="mb-10"
                />

                <div className="space-y-6">
                  {cameraRig.map((cam) => (
                    <div key={cam.id} className="flex gap-4 items-start">
                      <span className="w-10 h-10 shrink-0 rounded-lg border border-hermes/40 bg-hermes/10 text-hermes-ink dark:text-hermes-light flex items-center justify-center">
                        <i className={`${cam.icon} text-base`} />
                      </span>
                      <div>
                        <p className="font-display text-lg">{cam.label}</p>
                        <p className="text-ink/60 dark:text-oat/55 text-[0.88rem] mt-1">
                          {cam.position}. {cam.reads}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/demo/covered/watch/player-preview"
                  className="mt-10 inline-flex items-center gap-2 font-label text-sm font-semibold text-hermes-ink dark:text-hermes-light hover:underline underline-offset-4"
                >
                  Try the player with sample footage →
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* The barn flow (10/13 review: this page covers barns as well as riders) */}
        <Section tone="pine" className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <SectionHeading eyebrow="For barns" heading="How to get started" align="left" onDark className="mb-14" />
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
              {barnSteps.map((step, idx) => (
                <li key={step.title}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-display text-3xl text-hermes-light leading-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 h-px bg-hermes/50" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl text-oat mb-2.5">{step.title}</h3>
                  <p className="text-oat/65 leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </ol>
            <Link
              href="/barns#bring-akture"
              className="mt-12 btn-hermes inline-flex items-center gap-2 px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
            >
              Talk to us about your arena
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>
        </Section>

        <Section tone="oat" className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-[1.7rem] md:text-[2.1rem] mb-4">
              Ready to purchase footage?
            </h2>
            <p className="text-ink/65 dark:text-oat/55 mb-8 leading-relaxed">
              Log in or create an account to browse the footage available at your barn.
            </p>
            <Link
              href="/access"
              className="btn-hermes inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-label text-sm font-semibold shadow-hermes-md"
            >
              Purchase footage
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
