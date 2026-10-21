import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import BarnCard from '@/components/BarnCard';
import { barnSteps, tickerLines } from '@/lib/copy';
import { barns } from '@/lib/barns';
import { media } from '@/lib/media';

export const metadata = { title: 'Partner barns — Akture Equestrian' };

// Mock barns stay off the public page until real barns are signed (10/13 review).
const liveBarns = barns.filter((barn) => barn.live);

export default function BarnsPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36">
        <section className="px-6 md:px-12 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="flex items-center justify-center gap-3 font-label text-[0.85rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              Barns
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-ink dark:text-oat">
              Akture in your ring
            </h1>
            <p className="mt-6 text-ink/65 dark:text-oat/60 leading-relaxed">
              Fixed cameras in your ring, footage your riders can find in minutes, and nothing for
              your staff to manage.
            </p>
          </div>
        </section>

        {liveBarns.length > 0 && (
          <section className="px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {liveBarns.map((barn) => (
                <BarnCard key={barn.slug} barn={barn} />
              ))}
            </div>
          </section>
        )}

        <section id="bring-akture" className="py-24 bg-pine-deep text-oat scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <div>
                <SectionHeading
                  eyebrow="How to get started"
                  heading="A painless process"
                  sub="From the first call to footage in your clients’ hands, in four steps."
                  align="left"
                  onDark
                  className="mb-10"
                />

                <div className="space-y-7">
                  {barnSteps.map((s) => (
                    <div key={s.title} className="flex gap-4">
                      <span className="w-10 h-10 shrink-0 rounded-lg border border-hermes/40 bg-hermes/10 text-hermes-light flex items-center justify-center">
                        <i className={`${s.icon} text-base`} />
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-oat">{s.title}</h3>
                        <p className="text-ink/65 dark:text-oat/55 text-[0.88rem] leading-relaxed mt-1">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 border-l-2 border-hermes pl-5 py-1">
                  <p className="text-oat/65 text-[0.88rem] leading-relaxed">
                    The one thing we cannot tell from a photo is your internet. Some rings need a
                    connection of their own, and we would rather find that out on the site visit than
                    at your first show.
                  </p>
                </div>

                <a
                  href="mailto:contact@akture.video?subject=Akture%20Equestrian%20—%20our%20ring"
                  className="mt-10 inline-flex items-center gap-2 btn-hermes px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
                >
                  Email us about your ring
                  <i className="ph-bold ph-arrow-right text-sm" />
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-ink/10 dark:border-brass/20">
                <img src={media.barnAisleBright} alt="A modern barn aisle" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
