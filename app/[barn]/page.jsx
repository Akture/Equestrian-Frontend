import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import ChunkBrowser from '@/components/ChunkBrowser';
import { barns, cameraRig, getBarn } from '@/lib/barns';
import { tickerLines } from '@/lib/copy';
import { availableChunksForDay, getRecentDays, purchasesForBarn } from '@/lib/rides';

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
  const dayOptions = getRecentDays();
  const chunksByDay = Object.fromEntries(
    dayOptions.map((day) => [
      day.key,
      availableChunksForDay(slug, arena.slug, day.key, new Date(), dayOptions)
        .map((chunk) => ({ ...chunk, arenaName: arena.name })),
    ])
  );
  const ownedIds = purchasesForBarn(slug).map((purchase) => purchase.id);

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
            {barn.availability && (
              <div className="mt-6 max-w-lg rounded-xl border border-oat/20 bg-ink/30 p-4">
                <p className="font-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-hermes-light">
                  Footage availability
                </p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-oat/80">
                  {barn.availability}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Section tone="oatPine" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                {arena.name} · {arena.dims} · {arena.surface}
              </p>
              <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight">
                Find and purchase your ride
              </h2>
            </div>
          </div>

          <ChunkBrowser
            barnSlug={barn.slug}
            barnName={barn.name}
            dayOptions={dayOptions}
            chunksByDay={chunksByDay}
            ownedIds={ownedIds}
          />
        </div>
      </Section>

      {/* The three cameras, one line each. */}
      <Section tone="pineInk" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-light mb-4">
            <span className="w-6 h-px bg-hermes" aria-hidden="true" />
            The cameras
          </p>
          <h2 className="font-display text-[1.85rem] md:text-[2.3rem] leading-tight text-oat max-w-xl">
            The cameras in this ring
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
