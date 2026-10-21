// Section grounds. `pine` is the deep green block; `ink` is the dark room the
// player lives in. Tones carry their own text colour so a caller never has to
// remember which foreground goes with which ground.
const tones = {
  oat: 'bg-oat dark:bg-ink text-ink dark:text-oat',
  oatDim: 'bg-oat-dim dark:bg-ink-soft text-ink dark:text-oat',
  pine: 'bg-pine-deep text-oat',
  pineMid: 'bg-pine text-oat',
  ink: 'bg-ink text-oat',
};

export default function Section({ tone = 'oat', className = '', children, ...props }) {
  return (
    <section className={`${tones[tone] || tones.oat} ${className}`} {...props}>
      {children}
    </section>
  );
}

// A short orange rule. The accent earns its place on structure, not only buttons.
export function Eyebrow({ children, tone = 'light', className = '' }) {
  const colour = tone === 'dark' ? 'text-hermes-light' : 'text-hermes-ink';
  return (
    <p className={`flex items-center gap-3 font-label text-[0.85rem] font-semibold uppercase tracking-[0.22em] ${colour} ${className}`}>
      <span className="w-6 h-px bg-hermes" aria-hidden="true" />
      {children}
    </p>
  );
}
