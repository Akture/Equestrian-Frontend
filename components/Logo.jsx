import Link from 'next/link';

/**
 * PLACEHOLDER MARK.
 *
 * The real logo — the front two-thirds of a horse jumping through the camera,
 * mirroring the athlete knocked out of the parent Akture mark — is Sky's to draw.
 * This stand-in keeps the same idea (camera frame, equestrian subject in the lens)
 * with geometry that holds up at 24px so the mockup has something honest in the
 * header. Swap the <svg> below when the real mark lands.
 */
export function Mark({ className = '', ground = 'currentColor' }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M 96 118 h 88 l 26 -38 h 92 l 26 38 h 88
           a 68 68 0 0 1 68 68 v 180 a 68 68 0 0 1 -68 68
           H 96 a 68 68 0 0 1 -68 -68 V 186 a 68 68 0 0 1 68 -68 Z
           M 96 158 a 28 28 0 0 0 -28 28 v 180 a 28 28 0 0 0 28 28
           h 320 a 28 28 0 0 0 28 -28 V 186 a 28 28 0 0 0 -28 -28
           h -110 l -26 -38 h -50 l -26 38 Z"
      />
      <path
        d="M 207.1 330.2 A 76 76 0 1 1 304.9 330.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="48"
        strokeLinecap="round"
      />
      <g fill={ground}>
        <circle cx="193.7" cy="315.6" r="8" />
        <circle cx="181.2" cy="258.8" r="8" />
        <circle cx="212.4" cy="209.7" r="8" />
        <circle cx="256" cy="196" r="8" />
        <circle cx="299.6" cy="209.7" r="8" />
        <circle cx="330.8" cy="258.8" r="8" />
        <circle cx="318.3" cy="315.6" r="8" />
      </g>
    </svg>
  );
}

export default function Logo({ href = '/', compact = false, className = '' }) {
  return (
    <Link href={href} aria-label="Akture Equestrian — home" className={`inline-flex items-center gap-3 ${className}`}>
      <span className="text-pine dark:text-brass shrink-0">
        {/* The nail holes are punched in the ground colour, so it flips with the theme. */}
        <Mark className="w-9 h-9 block dark:hidden" ground="#F6F2EA" />
        <Mark className="w-9 h-9 hidden dark:block" ground="#0B1611" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-label font-semibold tracking-[0.18em] text-[0.82rem] uppercase text-ink dark:text-oat">
            Akture
          </span>
          <span className="block font-label tracking-[0.3em] text-[0.58rem] uppercase text-pine dark:text-brass mt-[3px]">
            Equestrian
          </span>
        </span>
      )}
    </Link>
  );
}
