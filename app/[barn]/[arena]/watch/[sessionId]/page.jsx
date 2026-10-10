import { notFound } from 'next/navigation';
import Link from 'next/link';
import MultiCamPlayer from '@/components/MultiCamPlayer';
import MockPurchaseGate from '@/components/MockPurchaseGate';
import { getArena, getBarn } from '@/lib/barns';
import { demoMarkers, getChunk, getPlayerPreview, getPurchase, getWatchable, purchases, videoFolderTitle } from '@/lib/rides';

function resolveFolder(barnSlug, arenaSlug, sessionId) {
  return getPurchase(sessionId) || getPlayerPreview(barnSlug, arenaSlug, sessionId) ||
    getWatchable(barnSlug, arenaSlug, sessionId, getArena(barnSlug, arenaSlug)?.name);
}

export function generateStaticParams() {
  return [
    ...purchases.map((p) => ({ barn: p.barn, arena: p.arena, sessionId: p.id })),
    { barn: 'demo', arena: 'covered', sessionId: 'player-preview' },
  ];
}

export async function generateMetadata({ params }) {
  const { barn, arena, sessionId } = await params;
  const folder = resolveFolder(barn, arena, sessionId);
  const barnName = getBarn(barn)?.name;
  return {
    title: folder && barnName
      ? `${videoFolderTitle(barnName, folder)} — Akture Equestrian`
      : 'Not found',
  };
}

export default async function WatchPage({ params, searchParams }) {
  const [{ barn: barnSlug, arena: arenaSlug, sessionId }, query] = await Promise.all([params, searchParams]);
  const barn = getBarn(barnSlug);
  const arena = getArena(barnSlug, arenaSlug);
  const folder = resolveFolder(barnSlug, arenaSlug, sessionId);
  if (!barn || !arena || !folder || folder.barn !== barnSlug || folder.arena !== arenaSlug) {
    notFound();
  }

  const autoPlay = query?.autoplay === '1';
  const requestedQueue = query?.queue
    ?.split(',')
    .map((id) => resolveFolder(barnSlug, getChunk(id)?.arena, id))
    .filter((item) => item?.barn === barnSlug);
  const queue = requestedQueue?.length
    ? requestedQueue
    : folder.preview
      ? [folder]
      : purchases
        .filter((purchase) => purchase.barn === barnSlug && (
          autoPlay ? purchase.iso === folder.iso : purchase.purchaseGroup === folder.purchaseGroup
        ))
        .sort((a, b) => a.startMin - b.startMin || a.arenaName.localeCompare(b.arenaName));
  const folderIds = [...new Set([folder.id, ...(requestedQueue || []).map((item) => item.id)])];
  const seededIds = [
    ...purchases.filter((purchase) => purchase.barn === barnSlug).map((purchase) => purchase.id),
    ...(barnSlug === 'demo' && arenaSlug === 'covered' ? ['player-preview'] : []),
  ];

  return (
    <main className="min-h-screen bg-ink px-3 py-4 text-oat md:px-8 md:py-6">
      <div className="mx-auto max-w-[1720px]">
        <Link
          href={`/${barn.slug}/my-videos`}
          className="mb-4 inline-flex items-center gap-2 font-label text-[0.78rem] text-oat/65 transition-colors hover:text-hermes-light"
        >
          <i className="ph-bold ph-arrow-left" aria-hidden="true" />
          My Videos
        </Link>
        <MockPurchaseGate barnSlug={barnSlug} folderIds={folderIds} seededIds={seededIds}>
          <MultiCamPlayer
            session={folder}
            queue={queue}
            autoStart={autoPlay}
            markers={demoMarkers}
            barnName={barn.name}
          />
        </MockPurchaseGate>
      </div>
    </main>
  );
}
