import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfilePanel from '@/components/ProfilePanel';
import { barns, getBarn } from '@/lib/barns';
import { tickerLines } from '@/lib/copy';

export function generateStaticParams() {
  return barns.map((b) => ({ barn: b.slug }));
}

export async function generateMetadata({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  return { title: barn ? `Profile — ${barn.name}` : 'Not found' };
}

export default async function ProfilePage({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  if (!barn) notFound();

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <main className="pt-36 pb-24 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div>
              <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
                <span className="w-6 h-px bg-hermes" aria-hidden="true" />
                {barn.name}
              </p>
              <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">Profile</h1>
            </div>
          </div>

          <ProfilePanel barn={{ slug: barn.slug, name: barn.name }} />
        </div>
      </main>

      <Footer />
    </>
  );
}
