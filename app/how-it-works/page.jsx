import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import MultiCamShowcase from '@/components/MultiCamShowcase';
import { howItWorks, theRig, tickerLines } from '@/lib/copy';
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
            <p className="flex items-center justify-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              How it works
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08]">
              From your barn’s code to your footage
            </h1>
            <p className="mt-6 text-ink/65 dark:text-oat/60 leading-relaxed">
              You enter a code once. After that, finding a ride is picking a day and
              the stretch of time you rode in.
            </p>
          </div>
        </Section>

        {/* The four steps, on the green ground */}
        <Section tone="pine" className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
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
              </div>
            </div>
          </div>
        </Section>

        <Section tone="oat" className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-[1.7rem] md:text-[2.1rem] mb-4">
              Have your barn’s code?
            </h2>
            <p className="text-ink/65 dark:text-oat/55 mb-8 leading-relaxed">
              Enter it once and your account is tied to that barn from then on.
            </p>
            <Link
              href="/access"
              className="btn-hermes inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-label text-sm font-semibold shadow-hermes-md"
            >
              Enter your barn code
              <i className="ph-bold ph-arrow-right text-sm" />
            </Link>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
