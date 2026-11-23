import Link from 'next/link';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DemoRibbon from '@/components/DemoRibbon';
import { barns } from '@/lib/barns';
import { tickerLines } from '@/lib/copy';

export const metadata = { title: 'Choose Location — Akture Equestrian' };

// The first page after signing in: every barn we film, with the details a rider
// needs to recognise their own. Picking one opens that barn's purchase page.
export default function SelectBarnPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36 pb-24 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              Your barns
            </p>
            <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">
              Choose Location
            </h1>
            <p className="mt-4 text-ink/65 dark:text-oat/60 leading-relaxed">
              Footage is sold barn by barn. Pick the barn you rode at to see the times for sale
              in its arena, and the footage you already own.
            </p>
            <DemoRibbon className="mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {barns.map((barn) => (
              <Link
                key={barn.slug}
                href={`/${barn.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-ink/15 dark:border-oat/15 bg-white/60 dark:bg-oat/[0.03] hover:border-hermes transition-colors"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={barn.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <span className="absolute bottom-3 left-4 font-label text-[0.62rem] uppercase tracking-[0.14em] text-oat/85">
                    equestrian.akture.video/{barn.slug}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="font-display text-xl text-ink dark:text-oat group-hover:text-hermes-ink dark:group-hover:text-hermes-light transition-colors">
                    {barn.name}
                  </h2>
                  <p className="mt-1.5 text-[0.82rem] text-ink/65 dark:text-oat/55">{barn.city}</p>

                  <p className="mt-4 text-[0.88rem] leading-relaxed text-ink/60 dark:text-oat/55">
                    {barn.blurb}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {barn.disciplines.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 rounded-full border border-ink/15 dark:border-oat/15 font-label text-[0.62rem] uppercase tracking-[0.12em] text-ink/65 dark:text-oat/55"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <dl className="mt-5 space-y-1.5 font-label text-[0.72rem] text-ink/70 dark:text-oat/60">
                    {[
                      ['Arena', barn.arena.name],
                      ['Size', barn.arena.dims],
                      ['Surface', barn.arena.surface],
                    ].map(([label, value]) => (
                      <div key={label} className="flex gap-3">
                        <dt className="w-16 shrink-0 uppercase tracking-[0.12em] text-ink/50 dark:text-oat/45">
                          {label}
                        </dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  {barn.availability && (
                    <div className="mt-5 rounded-xl border border-ink/10 dark:border-oat/10 p-3.5">
                      <p className="font-label text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-hermes-ink dark:text-hermes-light">
                        Footage availability
                      </p>
                      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink/65 dark:text-oat/55">
                        {barn.availability}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-6 flex items-center justify-between font-label text-[0.75rem] font-semibold text-hermes-ink dark:text-hermes-light">
                    <span>Purchase footage</span>
                    <i className="ph-bold ph-arrow-right text-sm group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-[0.85rem] text-ink/60 dark:text-oat/55">
            Rode somewhere that is not listed?{' '}
            <Link
              href="/barns#bring-akture"
              className="font-semibold text-hermes-ink dark:text-hermes-light hover:underline underline-offset-4"
            >
              Tell us about the barn
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
