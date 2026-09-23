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
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
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
                Akture puts fixed cameras on courts and fields so the people who played can buy back
                the footage. An arena works differently. One horse and rider go at a time, the part
                worth watching is short, and what a trainer needs to see is the takeoff spot, which
                depends entirely on where the camera is standing.
              </p>
              <p>
                So the equestrian build puts several cameras in each arena and runs them on a
                single timeline. Footage is sold by the window of time, because nobody knows in
                advance exactly when a class will go in.
              </p>
              <p>
                It lives at its own address — equestrian.akture.video — with a page for each barn.
                A barn hands out one code, a client enters it once, and from then on that account
                is tied to that barn. There is no public feed and no search across barns.
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
                sub="We are walking arenas now and spacing the first barns about a month apart, so the second install is better than the first. If your arena hosts lessons or shows, we would like to see it."
                align="left"
                onDark
                className="mb-8"
              />
              <Link
                href="/barns#bring-akture"
                className="btn-hermes inline-flex items-center gap-2 px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
              >
                Talk to us about your arena
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
