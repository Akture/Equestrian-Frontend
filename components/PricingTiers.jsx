import { timeTiers } from '@/lib/pricing';

export default function PricingTiers({ compact = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {timeTiers.map((tier) => (
        <div
          key={tier.id}
          className={`rounded-2xl border p-7 flex flex-col transition-colors ${
            tier.highlight
              ? 'border-brass bg-brass/10 dark:bg-brass/10'
              : 'border-ink/10 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03]'
          }`}
        >
          <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brass-ink dark:text-brass">
            {tier.window}
          </p>

          <p className="font-display text-[2.6rem] leading-none mt-4 text-ink dark:text-oat">
            ${tier.price}
          </p>
          <p className="text-ink/65 dark:text-oat/55 text-sm mt-1.5">per window, all three angles</p>

          <p className="text-ink/65 dark:text-oat/60 text-[0.9rem] leading-relaxed mt-5">{tier.blurb}</p>

          {!compact && (
            <ul className="mt-5 space-y-2 border-t border-ink/10 dark:border-oat/10 pt-5">
              {tier.fits.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[0.86rem] text-ink/60 dark:text-oat/55">
                  <i className="ph-bold ph-check text-brass-ink dark:text-brass text-xs mt-1" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {tier.highlight && (
            <span className="mt-5 inline-flex w-fit items-center rounded-full bg-brass px-3 py-1 font-label text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink">
              Most lessons
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
