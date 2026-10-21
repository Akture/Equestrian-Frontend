import Ticker from '@/components/Ticker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { faq, tickerLines } from '@/lib/copy';

export const metadata = { title: 'Questions — Akture Equestrian' };

export default function FaqPage() {
  return (
    <>
      <Ticker lines={tickerLines} />
      <Header />

      <main className="pt-36 pb-24">
        <section className="px-6 md:px-12 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="flex items-center justify-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-hermes-ink dark:text-hermes-light mb-5">
              <span className="w-6 h-px bg-hermes" aria-hidden="true" />
              Questions
            </p>
            <h1 className="font-display text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-ink dark:text-oat">
              Questions we get asked
            </h1>
          </div>
        </section>

        <section className="px-6 md:px-12">
          <div className="max-w-3xl mx-auto divide-y divide-ink/10 dark:divide-oat/10">
            {faq.map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                  <h2 className="font-display text-xl text-ink dark:text-oat leading-snug">{item.q}</h2>
                  <span className="shrink-0 w-9 h-9 rounded-full border border-ink/15 dark:border-oat/20 flex items-center justify-center text-ink/65 dark:text-oat/55 group-open:rotate-45 transition-transform group-open:text-hermes group-open:border-hermes">
                    <i className="ph-bold ph-plus text-sm" />
                  </span>
                </summary>
                <p className="mt-4 pr-16 text-ink/65 dark:text-oat/60 leading-relaxed text-[0.94rem]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
