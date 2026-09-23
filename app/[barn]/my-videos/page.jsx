import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyVideosBoard from '@/components/MyVideosBoard';
import DemoRibbon from '@/components/DemoRibbon';
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
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                {barn.name}
              </p>
              <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">My Videos</h1>
              <p className="mt-4 text-ink/65 dark:text-oat/60 leading-relaxed max-w-lg">
                Every purchase arrives as a folder for each 15 minutes, with all three angles inside.
                Each folder shows the date it comes down — download it before then to keep it.
              </p>
            </div>
            <DemoRibbon />
          </div>

          <MyVideosBoard barnSlug={barn.slug} folders={folders} />
        </div>
      </main>

      <Footer />
    </>
  );
}
