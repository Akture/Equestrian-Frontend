'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MOCK_ACCOUNT_KEY } from '@/lib/access';

export default function BarnAccessGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    try {
      const account = JSON.parse(localStorage.getItem(MOCK_ACCOUNT_KEY) || 'null');
      if (account && typeof account.email === 'string') {
        setStatus('ready');
      } else {
        router.replace('/access');
      }
    } catch {
      setStatus('error');
    }
  }, [pathname, router]);

  if (status === 'ready') return children;
  if (status === 'error') {
    return (
      <main className="min-h-screen bg-oat px-6 py-32 text-center dark:bg-ink">
        <p className="font-display text-xl text-ink dark:text-oat">We could not read your sign-in in this browser.</p>
        <p className="mt-3 text-[0.9rem] text-ink/65 dark:text-oat/60">
          Check your browser storage settings, then try signing in again.
        </p>
        <Link href="/access" className="btn-hermes mt-6 inline-flex rounded-full px-6 py-3 font-label text-sm font-semibold">
          Log in or sign up
        </Link>
      </main>
    );
  }
  return null;
}
