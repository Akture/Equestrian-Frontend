// Every surface in this build is a mockup. Data is placeholder; nothing here
// takes a payment, creates an account, or sends anything anywhere. This says so
// out loud rather than letting a reviewer assume otherwise.
export default function DemoRibbon({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-hermes/35 bg-hermes/10 px-3 py-1 text-[0.66rem] font-label font-semibold uppercase tracking-[0.18em] text-hermes-ink dark:text-hermes ${className}`}
    >
      <i className="ph-fill ph-flask text-xs" />
      Mockup — sample data
    </div>
  );
}
