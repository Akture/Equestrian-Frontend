'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DemoActionButton from './DemoActionButton';
import { MOCK_ACCOUNT_KEY } from '@/lib/access';

// Reads the mock account this browser created on /access. Log out clears it.
export default function ProfilePanel({ barn }) {
  const router = useRouter();
  const [acct, setAcct] = useState(undefined);

  useEffect(() => {
    try {
      setAcct(JSON.parse(localStorage.getItem(MOCK_ACCOUNT_KEY) || 'null'));
    } catch (e) {
      setAcct(null);
    }
  }, []);

  function logOut() {
    try {
      localStorage.removeItem(MOCK_ACCOUNT_KEY);
    } catch (e) {
      /* nothing to clear */
    }
    router.push('/access');
  }

  if (acct === undefined) return null;

  if (!acct) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 dark:border-oat/20 p-12 text-center">
        <p className="font-display text-xl mb-3">Your profile appears here once you have an account</p>
        <p className="text-ink/65 dark:text-oat/55 text-[0.92rem] mb-6">
          Create an account or sign in to access your profile and footage.
        </p>
        <Link href="/access" className="btn-hermes inline-block rounded-full px-6 py-3 font-label text-sm font-semibold">
          Log in or sign up
        </Link>
      </div>
    );
  }

  const rows = [
    ['Email', acct.email],
    ['Barn', barn.name],
    ['Page', `equestrian.akture.video/${barn.slug}`],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-8">
      <div className="rounded-2xl border border-ink/15 dark:border-oat/15 bg-white/50 dark:bg-oat/[0.03] p-6 md:p-8">
        <dl className="divide-y divide-ink/10 dark:divide-oat/10">
          {rows.map(([k, v]) => (
            <div key={k} className="py-4 grid grid-cols-[6rem_1fr] gap-4 items-baseline">
              <dt className="font-label text-[0.85rem] uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55">{k}</dt>
              <dd className="text-[0.94rem] text-ink dark:text-oat break-words">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <DemoActionButton label="Change password" icon="ph-bold ph-key" tone="quiet" />
          <DemoActionButton label="Change email" icon="ph-bold ph-envelope-simple" tone="quiet" />
        </div>
      </div>

      <div className="rounded-2xl border border-ink/15 dark:border-oat/15 p-6">
        <p className="font-display text-lg mb-2">Log out</p>
        <p className="text-ink/60 dark:text-oat/55 text-[0.84rem] leading-relaxed mb-5">
          Removes the mock account from this browser. Sign in again whenever you want to access your footage.
        </p>
        <button
          type="button"
          onClick={logOut}
          className="w-full rounded-full border border-ink/20 dark:border-oat/25 px-5 py-2.5 font-label text-[0.82rem] font-semibold text-ink/80 dark:text-oat/80 hover:border-hermes transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
