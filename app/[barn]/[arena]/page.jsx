import { redirect } from 'next/navigation';
import { allArenaParams } from '@/lib/barns';

// The arena page was folded into the barn page (10/4 team call): one arena per
// barn, so the barn page is the purchase page. Old links land there instead.
export function generateStaticParams() {
  return allArenaParams();
}

export default async function ArenaRedirect({ params }) {
  const { barn } = await params;
  redirect(`/${barn}#find-your-ride`);
}
