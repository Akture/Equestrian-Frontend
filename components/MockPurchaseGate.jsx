'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MOCK_PURCHASES_KEY } from '@/lib/purchaseStore';

export default function MockPurchaseGate({ barnSlug, folderIds, seededIds, children }) {
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MOCK_PURCHASES_KEY) || '[]');
      if (!Array.isArray(saved)) throw new Error('Saved purchases are not in the expected format.');
      const purchasedIds = new Set(
        saved.filter((purchase) => purchase.barn === barnSlug).map((purchase) => purchase.id)
      );
      const allowedIds = new Set([...seededIds, ...purchasedIds]);
      setAllowed(folderIds.every((id) => allowedIds.has(id)));
    } catch (cause) {
      setError(cause.message);
    }
  }, [barnSlug, folderIds, seededIds]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <p className="font-display text-xl text-ink dark:text-oat">Your purchase could not be verified</p>
        <p className="mt-3 text-[0.86rem] leading-relaxed text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }
  if (allowed) return children;
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-ink/15 p-8 text-center dark:border-oat/15">
      <p className="font-display text-xl text-ink dark:text-oat">This footage is not in My Videos</p>
      <p className="mt-3 text-[0.86rem] text-ink/60 dark:text-oat/60">
        Complete a test-mode purchase before watching this footage.
      </p>
      <Link href={`/${barnSlug}`} className="btn-hermes mt-6 inline-flex rounded-full px-6 py-3 font-label text-sm font-semibold">
        Browse footage
      </Link>
    </div>
  );
}
