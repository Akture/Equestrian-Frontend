'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GlassPanel from './GlassPanel';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { DEFAULT_BARN_SLUG, MOCK_ACCOUNT_KEY } from '@/lib/access';

const baseLinks = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Barns', href: '/barns' },
  { label: 'FAQ', href: '/faq' },
];

export default function Header({ barn = null }) {
  const [open, setOpen] = useState(false);
  const [accountBarn, setAccountBarn] = useState(null);

  // The nav follows sign-in, not the page (10/13 review): the same header on
  // every page, with the account tools once someone is signed in.
  useEffect(() => {
    try {
      const account = JSON.parse(localStorage.getItem(MOCK_ACCOUNT_KEY) || 'null');
      if (account && typeof account.email === 'string') {
        setAccountBarn(account.barn || DEFAULT_BARN_SLUG);
      }
    } catch {
      /* private browsing — treat as signed out */
    }
  }, []);

  const signedInBarn = accountBarn || barn?.slug || null;
  const links = signedInBarn
    ? [
        { label: 'My Videos', href: `/${signedInBarn}/my-videos` },
        { label: 'Support', href: `/${signedInBarn}/support` },
      ]
    : baseLinks;

  return (
    <header className="fixed top-8 left-0 right-0 z-50 px-4 md:px-12 flex justify-center w-full">
      <GlassPanel
        className={`w-full max-w-7xl shadow-rail overflow-hidden transition-[border-radius] duration-300 ${
          open ? 'rounded-3xl' : 'rounded-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 h-16 px-5 md:px-6 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />

            {barn && (
              <>
                <span className="hidden sm:block w-px h-6 bg-pine/15 dark:bg-oat/15" aria-hidden="true" />
                <span className="hidden sm:block font-label text-[0.7rem] uppercase tracking-[0.16em] text-pine dark:text-oat/70 truncate">
                  {barn.shortName}
                </span>
              </>
            )}

            <button
              type="button"
              className="md:hidden ml-1 p-2 rounded-full border border-pine/15 dark:border-oat/15 text-pine dark:text-oat/80 hover:border-hermes transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
            >
              <span className={`block w-4 h-0.5 bg-current mb-1 transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block w-4 h-0.5 bg-current mb-1 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-4 h-0.5 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-[0.82rem] font-medium text-ink/75 dark:text-oat/75 hover:text-hermes-ink dark:hover:text-hermes-ink dark:hover:text-hermes transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={`items-center gap-3 ${open ? 'hidden' : 'flex'}`}>
            <ThemeToggle className="hidden sm:flex" />

            <Link
              href={signedInBarn ? `/${signedInBarn}/profile` : '/access'}
              className="hidden lg:block font-label text-[0.82rem] font-medium text-ink/75 dark:text-oat/75 hover:text-hermes-ink dark:hover:text-hermes transition-colors"
            >
              {signedInBarn ? 'Profile' : 'Log in'}
            </Link>

            <Link
              href={signedInBarn ? `/${signedInBarn}` : '/access'}
              className="btn-hermes px-5 py-2.5 rounded-full font-label text-[0.95rem] font-semibold whitespace-nowrap shadow-hermes-sm"
            >
              Purchase footage
            </Link>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-4 px-6 pb-6 border-t border-pine/10 dark:border-oat/10 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-label text-sm font-medium text-ink/75 dark:text-oat/75 hover:text-hermes-ink dark:hover:text-hermes transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center justify-between pt-1">
              <Link
                href={signedInBarn ? `/${signedInBarn}/profile` : '/access'}
                onClick={() => setOpen(false)}
                className="font-label text-sm font-medium text-ink/75 dark:text-oat/75"
              >
                {signedInBarn ? 'Profile' : 'Log in'}
              </Link>
              <ThemeToggle />
            </div>

            <Link
              href={signedInBarn ? `/${signedInBarn}` : '/access'}
              onClick={() => setOpen(false)}
              className="btn-hermes px-5 py-3 rounded-full font-label text-sm font-semibold text-center"
            >
              Purchase footage
            </Link>
          </nav>
        </div>
      </GlassPanel>
    </header>
  );
}
