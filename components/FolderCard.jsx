import Link from 'next/link';

// One purchased 15-minute folder: three angle files, one expiry, one Watch.
export default function FolderCard({ folder, current = false, queueIds = [] }) {
  const href = `/${folder.barn}/${folder.arena}/watch/${folder.id}`;

  return (
    <div
      className={`rounded-2xl border overflow-hidden flex flex-col ${
        current
          ? 'border-hermes bg-hermes/10'
          : 'border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03]'
      }`}
    >
      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
        <img src={folder.thumb} alt="" className="w-full h-full object-cover" />
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(8,17,13,0.85) 0%, rgba(8,17,13,0.15) 60%)' }}
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-hermes font-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink">
          {current ? 'Playing' : 'Bought'}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-label text-[0.85rem] uppercase tracking-[0.16em] text-hermes-light">
            {folder.arenaName}
          </p>
          <p className="font-display text-lg text-oat leading-tight mt-0.5 tabular-nums">
            {folder.dateLabel} · {folder.start}–{folder.end}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-ink dark:text-oat text-[0.9rem]">{folder.label || 'Recorded · unlabelled'}</p>
        <p className="text-ink/60 dark:text-oat/55 text-[0.8rem] mt-1">
          {folder.horse} · comes down {folder.expires}
        </p>

        <ul className="mt-4 space-y-1.5 border-t border-ink/10 dark:border-oat/10 pt-4">
          {folder.names.files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 text-[0.78rem]">
              <span className="text-ink/75 dark:text-oat/70">{f.label}</span>
              <span className="font-label text-[0.85rem] text-ink/65 dark:text-oat/55 truncate">{f.filename}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          {current ? (
            <span className="block text-center px-4 py-2.5 rounded-full border border-hermes/60 font-label text-[0.82rem] font-semibold text-hermes-ink dark:text-hermes-light">
              Now playing
            </span>
          ) : (
            <Link
              href={href}
              className="block btn-hermes text-center px-4 py-2.5 rounded-full font-label text-[0.82rem] font-semibold"
            >
              Watch
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
