import Link from 'next/link';
import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChunkBrowser from '@/components/ChunkBrowser';
import DemoRibbon from '@/components/DemoRibbon';
import { allArenaParams, getArena, getBarn } from '@/lib/barns';
import { availableChunksForDay, getRecentDays, purchasesForBarn } from '@/lib/rides';
import { tickerLines } from '@/lib/copy';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return allArenaParams();
}

export async function generateMetadata({ params }) {
  const { barn: barnSlug, arena: arenaSlug } = await params;
  const barn = getBarn(barnSlug);
  const arena = getArena(barnSlug, arenaSlug);
  return { title: arena ? `${arena.name} — ${barn.name}` : 'Arena not found' };
}

export default async function ArenaPage({ params }) {
  const { barn: barnSlug, arena: arenaSlug } = await params;
  const barn = getBarn(barnSlug);
  const arena = getArena(barnSlug, arenaSlug);
  if (!barn || !arena) notFound();

  const dayOptions = getRecentDays();
  const chunksByDay = Object.fromEntries(
    dayOptions.map((day) => [
      day.key,
      availableChunksForDay(barnSlug, arenaSlug, day.key, new Date(), dayOptions),
    ])
  );
  const ownedIds = purchasesForBarn(barnSlug)
    .filter((p) => p.arena === arenaSlug)
    .map((p) => p.id);

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <main className="pt-36 pb-24 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <nav className="flex items-center gap-2 font-label text-[0.72rem] text-ink/60 dark:text-oat/55 mb-8">
            <Link href={`/${barn.slug}`} className="hover:text-hermes-ink dark:hover:text-hermes-light">
              {barn.shortName}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink/75 dark:text-oat/70">{arena.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                {arena.dims} · {arena.surface}
              </p>
              <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">{arena.name}</h1>
              <p className="mt-4 text-ink/65 dark:text-oat/60 leading-relaxed max-w-lg">
                Browse all available footage, newest first. Purchase in 15-minute chunks, up to
                60 minutes at a time. Every purchase includes three video angles that play
                seamlessly in our media player. Downloads arrive as separate files for each angle;
                playing all three together offline requires a specialized media player. Footage
                is visual only and has no sound.
              </p>
            </div>
            <DemoRibbon />
          </div>

          <ChunkBrowser
            barnSlug={barn.slug}
            barnName={barn.name}
            arenaSlug={arena.slug}
            arenaName={arena.name}
            dayOptions={dayOptions}
            chunksByDay={chunksByDay}
            ownedIds={ownedIds}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
