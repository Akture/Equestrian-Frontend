import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24 bg-oat dark:bg-ink">
        <div className="max-w-md text-center">
          <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-brass-ink dark:text-brass mb-5">
            Nothing here
          </p>
          <h1 className="font-display text-[2.2rem] leading-tight text-ink dark:text-oat mb-4">
            That page is not on this barn’s address
          </h1>
          <p className="text-ink/60 dark:text-oat/55 leading-relaxed mb-9">
            Barn pages live at equestrian.akture.video and the barn’s name. If you came from a link
            your barn sent, check the code on it.
          </p>
          <Link
            href="/"
            className="btn-hermes inline-flex items-center gap-2 px-6 py-3 rounded-full font-label text-sm font-semibold"
          >
            Back to the start
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
