import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccessForm from '@/components/AccessForm';
import { accessCopy, tickerLines } from '@/lib/copy';
import { media } from '@/lib/media';

export const metadata = { title: 'Log in or sign up — Akture Equestrian' };

export default function AccessPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-28 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left panel mirrors the parent Akture auth layout. */}
        <div className="relative hidden lg:block">
          <img src={media.riderPortrait} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(8,17,13,0.88)' }} />
          <div className="relative h-full flex flex-col justify-end p-12">
            <blockquote className="max-w-sm">
              <p className="font-display text-2xl leading-snug text-oat">
                Sign in or create an account to see the footage from your barn’s ring.
              </p>
              <p className="mt-5 font-label text-[0.85rem] uppercase tracking-[0.18em] text-hermes-light">
                How access works
              </p>
            </blockquote>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 md:px-12 py-20">
          <div className="w-full max-w-md">
            <p className="flex items-center gap-3 font-label text-[0.85rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-4">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              {accessCopy.eyebrow}
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.4rem] leading-tight text-ink dark:text-oat">
              {accessCopy.heading}
            </h1>
            <p className="mt-4 text-ink/60 dark:text-oat/60 leading-relaxed text-[0.94rem]">
              {accessCopy.sub}
            </p>

            <AccessForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
