// Headings say plainly what the thing is, in title case. Caps belong on eyebrows
// and metadata only — that is the one typographic rule every equestrian
// reference site keeps.
//
// `onDark` is for the green and ink grounds, where the default ink-on-oat
// foreground would be unreadable.
export default function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = 'center',
  onDark = false,
  className = '',
}) {
  const alignment = align === 'left' ? 'text-left' : 'text-center mx-auto';

  const eyebrowColour = onDark ? 'text-hermes-light' : 'text-hermes-ink dark:text-hermes-light';
  const headingColour = onDark ? 'text-oat' : 'text-ink dark:text-oat';
  const subColour = onDark ? 'text-oat/75' : 'text-ink/65 dark:text-oat/60';

  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 font-label text-[0.62rem] font-semibold uppercase tracking-[0.22em] mb-4 ${eyebrowColour} ${
            align === 'left' ? '' : 'justify-center'
          }`}
        >
          <span className="w-6 h-px bg-hermes" aria-hidden="true" />
          {eyebrow}
        </p>
      )}

      <h2 className={`font-display text-[1.85rem] leading-tight md:text-[2.4rem] ${headingColour}`}>
        {heading}
      </h2>

      {sub && <p className={`mt-4 text-lg leading-relaxed ${subColour}`}>{sub}</p>}
    </div>
  );
}
