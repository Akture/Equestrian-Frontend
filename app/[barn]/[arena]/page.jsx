import { notFound, redirect } from 'next/navigation';
import { allArenaParams, getArena, getBarn } from '@/lib/barns';

export function generateStaticParams() {
  return allArenaParams();
}

export default async function ArenaPage({ params }) {
  const { barn: barnSlug, arena: arenaSlug } = await params;
  if (!getBarn(barnSlug) || !getArena(barnSlug, arenaSlug)) notFound();
  redirect(`/${barnSlug}`);
}
