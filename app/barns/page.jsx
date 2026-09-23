import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import BarnCard from '@/components/BarnCard';
import DemoRibbon from '@/components/DemoRibbon';
import { tickerLines } from '@/lib/copy';
import { barns } from '@/lib/barns';
import { media } from '@/lib/media';

export const metadata = { title: 'Partner barns — Akture Equestrian' };

const steps = [
  {
    icon: 'ph ph-path',
    title: 'We walk the arena',
    desc: 'Dimensions, sight lines, power, and where the internet actually reaches. Covered and outdoor rings are scoped separately.',
  },
  {
    icon: 'ph ph-wrench',
    title: 'The cameras go in',
    desc: 'A wide camera down the long side and one at each end, mounted once and pointed once. Your staff have nothing to charge, carry, or aim.',
  },
  {
    icon: 'ph ph-link-simple',
    title: 'Your page goes live',
    desc: 'equestrian.akture.video and your barn name. You hand out a one-time code; each client account is tied to your barn from then on.',
  },
];

export default function BarnsPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36">
        <section className="px-6 md:px-12 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="flex items-center justify-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              Barns
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-ink dark:text-oat">
              The barns we are in
            </h1>
            <p className="mt-6 text-ink/65 dark:text-oat/60 leading-relaxed">
              Each barn has its own page and hands out its own code. Riders reach their barn’s
              arenas and nothing else.
            </p>
            <div className="flex justify-center mt-7">
              <DemoRibbon />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {barns.map((barn) => (
              <BarnCard key={barn.slug} barn={barn} />
            ))}
          </div>
        </section>

        <section id="bring-akture" className="py-24 bg-pine-deep text-oat scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <div>
                <SectionHeading
                  eyebrow="Bring Akture to your arena"
                  heading="How a barn comes online"
                  sub="We are spacing the first installs about a month apart so each one teaches us something before the next."
                  align="left"
                  onDark
                  className="mb-10"
                />

                <div className="space-y-7">
                  {steps.map((s) => (
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
                    Barn connectivity is the one thing we cannot guess from a photo. Some arenas will
                    need a dedicated uplink or a local recorder on site, and we would rather find that
                    on the walk-through than after the first show.
                  </p>
                </div>

                <a
                  href="mailto:contact@akture.video?subject=Akture%20Equestrian%20—%20our%20arena"
                  className="mt-10 inline-flex items-center gap-2 btn-hermes px-6 py-3 rounded-full font-label text-sm font-semibold shadow-hermes-md"
                >
                  Email us about your arena
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
