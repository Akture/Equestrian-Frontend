export default function FeatureGrid({ items, columns = 4 }) {
  const cols = columns === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 ${cols} gap-x-10 gap-y-12`}>
      {items.map((item) => (
        <div key={item.title}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-brass/30 bg-brass/10 text-brass-ink dark:text-brass">
            <i className={`${item.icon} text-xl`} />
          </div>
          <h3 className="font-display text-xl text-ink dark:text-oat mb-2.5">{item.title}</h3>
          <p className="text-ink/60 dark:text-oat/55 text-[0.9rem] leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
