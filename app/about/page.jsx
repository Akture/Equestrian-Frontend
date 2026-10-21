import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { footerBlurb, tickerLines } from '@/lib/copy';
import { media } from '@/lib/media';

export const metadata = { title: 'About — Akture Equestrian' };

export default function AboutPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36">
        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-3xl mx-auto">
            <p className="flex items-center gap-3 font-label text-[0.85rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              About
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-ink dark:text-oat">
              The equestrian side of Akture
            </h1>
            <p className="mt-7 text-ink/65 dark:text-oat/60 leading-relaxed text-lg">{footerBlurb}</p>

            <div className="h-px bg-hermes/40 my-12" />

            <div className="space-y-6 text-ink/65 dark:text-oat/60 leading-relaxed">
              <p>
                Akture started with fixed cameras on courts and fields, so the people who played
                could watch the game again. A riding ring asks for something different. One horse
                and rider go at a time, the part worth watching is short, and what a trainer needs
                to see depends on where the camera is standing.
              </p>
              <p>
                So we put three cameras in the ring, on the rail, at the in-gate and at the far
                end, and run them on one shared clock. You buy the stretch of time you rode,
                because nobody knows to the minute when a class will go in, and every angle comes
                with it.
              </p>
              <p>
                Each barn has its own page. Riders, parents and trainers sign in to see their
                barn’s footage, and nothing is public.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-pine-deep text-oat">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden border border-ink/10 dark:border-brass/20">
              <img src={media.tackDetail} alt="" className="w-full h-full object-cover" style={{ maxHeight: '460px' }} />
            </div>
            <div>
              <SectionHeading
                eyebrow="Right now"
                heading="Where we are"
                sub="We are installing at our first barns now and taking them one at a time, so each install is better than the last. If your ring hosts lessons or shows, we would like to see it."
                align="left"
                onDark
                className="mb-8"
              />
              <Link
                href="/barns#bring-akture"
                className="btn-hermes inline-flex items-center gap-2 px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
              >
                Talk to us about your ring
                <i className="ph-bold ph-arrow-right text-sm" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
