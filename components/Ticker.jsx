import styles from './Ticker.module.css';

export default function Ticker({ lines }) {
  const doubled = [...lines, ...lines];

  return (
    <div className="bg-pine dark:bg-pine-deep text-oat py-2 text-xs font-label tracking-wide relative z-50 overflow-hidden border-b border-brass/25">
      <div className={`${styles.track} whitespace-nowrap`}>
        {doubled.map((line, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-3">
            <span className="text-brass" aria-hidden="true">
              &#9670;
            </span>
            <span className="text-oat/90">{line}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
