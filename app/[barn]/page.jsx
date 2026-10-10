import Link from 'next/link';
import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import DemoRibbon from '@/components/DemoRibbon';
import { barns, cameraRig, getBarn } from '@/lib/barns';
import { tickerLines } from '@/lib/copy';

export function generateStaticParams() {
  return barns.map((b) => ({ barn: b.slug }));
}

export async function generateMetadata({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  return { title: barn ? `${barn.name} — Akture Equestrian` : 'Barn not found' };
}

export default async function BarnPage({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  if (!barn) notFound();

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <section className="relative pt-40 pb-20 overflow-hidden">
        <img src={barn.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,17,13,0.94) 0%, rgba(8,17,13,0.86) 32%, rgba(8,17,13,0.58) 62%, rgba(8,17,13,0.18) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              equestrian.akture.video/{barn.slug}
            </p>

            <h1 className="font-display text-[2.6rem] md:text-[3.4rem] leading-[1.05] text-oat">
              {barn.name}
            </h1>
            <p className="mt-3 text-oat/60 text-[0.94rem]">{barn.city}</p>
            <p className="mt-6 text-oat/70 leading-relaxed max-w-lg">{barn.blurb}</p>
            {barn.slug === 'aubreymeadows' && (
              <div className="mt-6 max-w-lg rounded-xl border border-oat/20 bg-ink/30 p-4">
                <p className="font-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-hermes-light">
                  Footage availability
                </p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-oat/80">
                  Monday to Friday: 8am to 5pm · Saturday &amp; Sunday: 9am to 12pm.
                  Any changes to footage availability will be reflected here. Footage is
                  available for sale for up to 48 hours after recording.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The barn portal is a way into an arena. Choose the arena, then the day. */}
      <Section tone="oat" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                Arenas
              </p>
              <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight">
                Open the arena you rode in
              </h2>
            </div>
            <DemoRibbon />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {barn.arenas.map((arena) => (
              <Link
                key={arena.slug}
                href={`/${barn.slug}/${arena.slug}`}
                className="group relative rounded-2xl overflow-hidden border border-ink/15 dark:border-oat/15 hover:border-hermes transition-colors"
              >
                <div className="relative h-56">
                  <img
                    src={arena.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(0deg, rgba(8,17,13,0.92) 0%, rgba(8,17,13,0.55) 45%, rgba(8,17,13,0.22) 100%)',
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl text-oat">{arena.name}</h3>
                    <p className="mt-1.5 text-oat/65 text-[0.86rem]">
                      {arena.dims} · {arena.surface}
                    </p>
                  </div>
                </div>

                <div className="bg-pine-deep px-6 py-4 flex items-center justify-between">
                  <span className="font-label text-[0.72rem] text-oat/65">{arena.use}</span>
                  <span className="inline-flex items-center gap-2 font-label text-[0.8rem] font-semibold text-hermes-light group-hover:gap-3 transition-all">
                    Purchase footage
                    <i className="ph-bold ph-arrow-right text-sm" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* What sits in each arena, in one line per camera. */}
      <Section tone="pine" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-light mb-4">
            <span className="w-6 h-px bg-hermes" aria-hidden="true" />
            The cameras
          </p>
          <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight text-oat max-w-xl">
            The same cameras in every arena here
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {cameraRig.map((cam) => (
              <div key={cam.id} className="border-t border-hermes/40 pt-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <i className={`${cam.icon} text-hermes-light`} />
                  <span className="font-display text-lg text-oat">{cam.label}</span>
                </div>
                <p className="text-oat/60 text-[0.86rem] leading-relaxed">{cam.reads}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}
