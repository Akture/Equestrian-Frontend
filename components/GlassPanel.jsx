// The nav pill inherited from akture.video, re-tinted to the cream-and-green
// palette. Translucent rather than transparent — the team flagged text getting
// messy behind the old 4.5%-opacity dark version.
export default function GlassPanel({ className = '', style = {}, children, ...props }) {
  return (
    <div
      className={`backdrop-blur-md bg-oat/90 dark:bg-ink/90 border border-pine-deep/15 dark:border-oat/15 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
