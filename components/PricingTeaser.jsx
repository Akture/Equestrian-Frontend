import { pricingCopy } from '@/lib/copy';

// Pre-launch pricing (10/13 review): a floor price for riders and the install
// model for barns — no time tiers until the real rates are set at go-live.
export default function PricingTeaser() {
  const cards = [pricingCopy.riders, pricingCopy.barns];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className={`rounded-2xl border p-8 flex flex-col ${
            idx === 0
              ? 'border-brass bg-brass/10'
              : 'border-ink/10 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03]'
          }`}
        >
          <p className="font-label text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-brass-ink dark:text-brass">
            {card.label}
          </p>
          <p className="font-display text-[2.2rem] leading-tight mt-4 text-ink dark:text-oat">{card.lead}</p>
          <p className="text-ink/65 dark:text-oat/60 mt-1">{card.unit}</p>

          <ul className="mt-6 space-y-2.5 border-t border-ink/10 dark:border-oat/10 pt-6">
            {card.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-ink/70 dark:text-oat/65">
                <i className="ph-bold ph-check text-brass-ink dark:text-brass text-sm mt-1" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
