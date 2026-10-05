import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import ChunkBrowser from '@/components/ChunkBrowser';
import DemoRibbon from '@/components/DemoRibbon';
import { barns, cameraRig, getBarn } from '@/lib/barns';
import { chunksForDay, days, purchasesForBarn } from '@/lib/rides';
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

  const { arena } = barn;
  const chunksByDay = Object.fromEntries(days.map((d) => [d.key, chunksForDay(barn.slug, arena.slug, d.key)]));
  const ownedIds = purchasesForBarn(barn.slug)
    .filter((p) => p.arena === arena.slug)
    .map((p) => p.id);

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
          </div>
        </div>
      </section>

      {/* The purchase page. One arena per barn for now, so the barn page goes
          straight to the footage — no arena to choose first. */}
      <section id="find-your-ride" className="py-20 bg-oat dark:bg-ink scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                {arena.name} · {arena.dims} · {arena.surface}
              </p>
              <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight">Find your ride</h2>
              <p className="mt-4 text-ink/65 dark:text-oat/60 leading-relaxed max-w-lg">
                Everything recorded in the {arena.name.toLowerCase()} in the last two days is listed
                below in 15-minute chunks. Narrow it to the time you rode, select up to an hour in a
                row, and buy it. Every camera in the arena comes with the purchase.
              </p>
            </div>
            <DemoRibbon />
          </div>

          <ChunkBrowser barnSlug={barn.slug} arenaSlug={arena.slug} chunksByDay={chunksByDay} ownedIds={ownedIds} />
        </div>
      </section>

      {/* What sits in the arena, in one line per camera. */}
      <Section tone="pine" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-light mb-4">
            <span className="w-6 h-px bg-hermes" aria-hidden="true" />
            The cameras
          </p>
          <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight text-oat max-w-xl">
            The cameras in this arena
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
