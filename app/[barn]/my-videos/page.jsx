import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyVideosBoard from '@/components/MyVideosBoard';
import { barns, getBarn } from '@/lib/barns';
import { purchasesForBarn } from '@/lib/rides';
import { tickerLines } from '@/lib/copy';

export function generateStaticParams() {
  return barns.map((b) => ({ barn: b.slug }));
}

export async function generateMetadata({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  return { title: barn ? `My Videos — ${barn.name}` : 'Not found' };
}

export default async function MyVideosPage({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  if (!barn) notFound();

  const folders = purchasesForBarn(slug);

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <main className="pt-36 pb-24 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-10">
            <p className="font-label text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-hermes-ink dark:text-hermes-light mb-3">
              {barn.name}
            </p>
            <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">My Videos</h1>
          </div>

          <MyVideosBoard barnSlug={barn.slug} folders={folders} />
        </div>
      </main>

      <Footer />
    </>
  );
}
