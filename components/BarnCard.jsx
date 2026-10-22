import Link from 'next/link';

export default function BarnCard({ barn }) {
  return (
    <Link
      href={`/${barn.slug}`}
      className="group rounded-2xl overflow-hidden border border-ink/10 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] flex flex-col hover:border-hermes transition-colors"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={barn.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl text-ink dark:text-oat group-hover:text-hermes-ink dark:group-hover:text-hermes-light transition-colors">
          {barn.name}
        </h3>
        <p className="text-ink/65 dark:text-oat/55 text-[0.82rem] mt-1.5">{barn.city}</p>

        <p className="text-ink/60 dark:text-oat/55 text-[0.88rem] leading-relaxed mt-4">{barn.blurb}</p>

        <div className="flex flex-wrap gap-1.5 mt-5">
          {barn.disciplines.map((d) => (
            <span
              key={d}
              className="px-2.5 py-1 rounded-full border border-ink/15 dark:border-oat/15 font-label text-[0.62rem] uppercase tracking-[0.12em] text-ink/65 dark:text-oat/55"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between font-label text-[0.72rem] text-ink/65 dark:text-oat/55">
          <span>
            {barn.arena.name}
          </span>
          <span className="text-hermes-ink dark:text-hermes-light group-hover:translate-x-0.5 transition-transform">
            /{barn.slug} →
          </span>
        </div>
      </div>
    </Link>
  );
}
