import Link from 'next/link';
import { notFound } from 'next/navigation';
import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportForm from '@/components/SupportForm';
import { barns, getBarn } from '@/lib/barns';
import { tickerLines } from '@/lib/copy';

export function generateStaticParams() {
  return barns.map((b) => ({ barn: b.slug }));
}

export async function generateMetadata({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  return { title: barn ? `Support — ${barn.name}` : 'Not found' };
}

export default async function SupportPage({ params }) {
  const { barn: slug } = await params;
  const barn = getBarn(slug);
  if (!barn) notFound();

  return (
    <>
      <Ticker lines={tickerLines} />
      <Header barn={barn} />

      <main className="pt-36 pb-24 bg-oat dark:bg-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-14">
          <div>
            <p className="flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              {barn.name}
            </p>
            <h1 className="font-display text-[2.2rem] md:text-[2.8rem] leading-tight">Contact support</h1>
            <p className="mt-4 mb-10 text-ink/65 dark:text-oat/60 leading-relaxed max-w-lg">
              Tell us the day and the time you rode, and we can usually sort it out the same day.
            </p>
            <SupportForm barn={{ slug: barn.slug, name: barn.name }} />
          </div>

          <aside className="lg:pt-24">
            <p className="font-display text-xl leading-snug">Have a quick question?</p>
            <p className="text-ink/65 dark:text-oat/60 leading-relaxed mt-2">
              Most answers about finding, buying and downloading footage are in the FAQ.
            </p>
            <Link href="/faq" className="mt-4 inline-block font-label font-semibold text-hermes-ink dark:text-hermes-light hover:underline underline-offset-4">
              Read the FAQ →
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
