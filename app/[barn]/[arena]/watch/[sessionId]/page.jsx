import Link from 'next/link';
import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WatchRoom from '@/components/WatchRoom';
import FolderCard from '@/components/FolderCard';
import DemoActionButton from '@/components/DemoActionButton';
import { getArena, getBarn } from '@/lib/barns';
import { demoMarkers, getPurchase, purchases } from '@/lib/rides';
import { tickerLines } from '@/lib/copy';
import { feeds } from '@/lib/media';

// Only bought folders have a watch page. There is no preview state.
export function generateStaticParams() {
  return purchases.map((p) => ({ barn: p.barn, arena: p.arena, sessionId: p.id }));
}

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  const folder = getPurchase(sessionId);
  return { title: folder ? `${folder.names.display} — Akture Equestrian` : 'Not found' };
}

export default async function WatchPage({ params }) {
  const { barn: barnSlug, arena: arenaSlug, sessionId } = await params;
  const barn = getBarn(barnSlug);
  const arena = getArena(barnSlug, arenaSlug);
  const folder = getPurchase(sessionId);
  if (!barn || !arena || !folder || folder.barn !== barnSlug || folder.arena !== arenaSlug) {
    notFound();
  }

  // Every folder from the same purchase, in order — the play-in-order queue.
  const queue = purchases
    .filter((p) => p.purchaseGroup === folder.purchaseGroup)
    .sort((a, b) => a.startMin - b.startMin);
  const others = queue.filter((p) => p.id !== folder.id);

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <main className="pt-32 pb-20 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <nav className="flex items-center gap-2 font-label text-[0.72rem] text-ink/60 dark:text-oat/55 mb-6">
            <Link href={`/${barn.slug}/my-videos`} className="hover:text-hermes-ink dark:hover:text-hermes-light">
              My Videos
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${barn.slug}/${arena.slug}`} className="hover:text-hermes-ink dark:hover:text-hermes-light">
              {arena.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink/75 dark:text-oat/70 tabular-nums">
              {folder.dateLabel} · {folder.start}
            </span>
          </nav>

          <div className="mb-8">
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-3">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              {folder.discipline || 'Recorded'} · {queue.length > 1 ? `${queue.length} folders in this purchase` : 'one folder'}
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.6rem] leading-tight">
              {folder.label || folder.names.display}
            </h1>
            <p className="mt-2.5 text-ink/60 dark:text-oat/55 text-[0.92rem] tabular-nums">
              {folder.horse} · {arena.name} · {folder.dateLabel}, {folder.start}–{folder.end}
            </p>
          </div>

          <WatchRoom folder={folder} queue={queue} markers={demoMarkers} />

          {/* The folder itself: three files, the zip, the expiry. */}
          <section className="mt-12 rounded-2xl border border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="min-w-0">
                <p className="font-label text-[0.62rem] uppercase tracking-[0.2em] text-ink/65 dark:text-oat/55 mb-2">
                  This folder
                </p>
                <p className="font-display text-xl">{folder.names.display}</p>
                <p className="font-label text-[0.72rem] text-ink/65 dark:text-oat/55 mt-1 truncate">
                  {folder.names.zip}
                </p>
                <ul className="mt-5 space-y-2">
                  {folder.names.files.map((f, i) => (
                    <li key={f.id} className="flex items-center gap-3 text-[0.86rem]">
                      <span className="w-6 h-6 rounded-md border border-hermes/40 bg-hermes/10 flex items-center justify-center font-label text-[0.66rem] text-hermes-ink dark:text-hermes-light">
                        {i + 1}
                      </span>
                      <span className="text-ink/80 dark:text-oat/75 w-24">{f.label}</span>
                      <span className="font-label text-[0.72rem] text-ink/65 dark:text-oat/55 truncate">{f.filename}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shrink-0 md:text-right">
                <p className="text-ink/65 dark:text-oat/55 text-[0.84rem]">
                  Comes down <span className="font-semibold text-ink dark:text-oat">{folder.expires}</span>
                </p>
                <p className="text-ink/65 dark:text-oat/55 text-[0.78rem] mt-1 max-w-[16rem] md:ml-auto">
                  Download the zip before then and it is yours for good.
                </p>
                <DemoActionButton label="Download the folder" icon="ph-bold ph-download-simple" className="mt-4" />
              </div>
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {feeds.map((f) => (
              <div key={f.id} className="border-t border-hermes/40 pt-5">
                <span className="font-display text-lg">{f.label}</span>
                <p className="text-ink/60 dark:text-oat/55 text-[0.86rem] leading-relaxed mt-1">
                  {f.position}. {f.reads}.
                </p>
              </div>
            ))}
          </section>

          {others.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl mb-2">The other folders in this purchase</h2>
              <p className="text-ink/60 dark:text-oat/55 text-[0.92rem] mb-8">
                Press play above and they run in order on their own.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {others.slice(0, 3).map((p) => (
                  <FolderCard key={p.id} folder={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
