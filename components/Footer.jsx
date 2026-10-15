import Link from 'next/link';
import Logo from './Logo';

const columns = [
  {
    heading: 'Ride',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Purchase footage', href: '/demo' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Partner barns', href: '/barns' },
    ],
  },
  {
    heading: 'Barns',
    links: [
      { label: 'Bring Akture to your arena', href: '/barns#bring-akture' },
      { label: 'What we install', href: '/how-it-works#what-we-install' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Akture',
    links: [
      { label: 'Akture for sports', href: 'https://akture.video' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:contact@akture.video?subject=Akture%20Equestrian' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-oat-dim dark:bg-pine-deep pt-20 pb-10 border-t border-pine/10 dark:border-brass/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          <div className="lg:col-span-2">
            <Logo className="mb-6" />

            <p className="text-ink/60 dark:text-oat/55 text-sm leading-relaxed mb-8 max-w-sm">
              Arena cameras that record your lessons and your classes, so you can watch the
              ride again and keep it.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: 'ph-fill ph-instagram-logo', href: 'https://www.instagram.com/akture.video/', label: 'Instagram' },
                { icon: 'ph-fill ph-youtube-logo', href: 'https://www.youtube.com/@AktureVideo', label: 'YouTube' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-pine/10 dark:bg-oat/10 text-pine dark:text-oat/70 hover:text-oat hover:bg-hermes"
                >
                  <i className={`${item.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-label font-semibold text-ink dark:text-oat mb-6 uppercase tracking-[0.16em] text-xs">
                {col.heading}
              </h4>
              <ul className="space-y-4">
                {col.links.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('/') ? (
                      <Link href={item.href} className="text-ink/60 dark:text-oat/55 hover:text-hermes-ink dark:hover:text-hermes-light transition-colors text-sm">
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="text-ink/60 dark:text-oat/55 hover:text-hermes-ink dark:hover:text-hermes-light transition-colors text-sm">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-hermes/40 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-ink/65 dark:text-oat/55 text-xs">
            Akture Equestrian is part of Akture. This is an internal design mockup — not a live
            service, and not a public page.
          </p>
          <p className="text-ink/65 dark:text-oat/55 text-xs font-label tracking-wider">
            equestrian.akture.video
          </p>
        </div>
      </div>
    </footer>
  );
}
