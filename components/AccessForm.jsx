'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { barns } from '@/lib/barns';
import DemoRibbon from './DemoRibbon';

// MOCK ACCESS. Two paths on one page, the way the product works:
//   · Create account — email, password and the barn code, entered once.
//   · Log in — email and password. No code; the account is already tied.
// The "account" is a record in this browser's localStorage so the flow can be
// walked end to end. Nothing is sent anywhere. Try AA1111 for the demo barn.
const KEY = 'aq-mock-account';

function readAccount() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch (e) {
    return null;
  }
}

export default function AccessForm({ helpText }) {
  const router = useRouter();
  const [mode, setMode] = useState('create'); // 'create' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    const acct = readAccount();
    setExisting(acct);
    if (acct) setMode('login');
  }, []);

  function barnForCode(typed) {
    const up = typed.trim().toUpperCase();
    return barns.find((b) => up.startsWith(b.accessCodeHint.toUpperCase())) || null;
  }

  function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and a password.');
      return;
    }

    if (mode === 'create') {
      const barn = barnForCode(code);
      if (!code.trim()) {
        setError('Enter the code from your barn’s link.');
        return;
      }
      if (!barn) {
        setError('That code does not match a barn in this mockup. Try AA1111 for the demo barn.');
        return;
      }
      try {
        localStorage.setItem(KEY, JSON.stringify({ email: email.trim(), barn: barn.slug }));
      } catch (err) {
        /* private browsing — the account just does not persist */
      }
      router.push(`/${barn.slug}`);
      return;
    }

    // log in
    const acct = readAccount();
    if (!acct) {
      setError('No account in this browser yet. Create one with your barn code.');
      return;
    }
    if (acct.email !== email.trim()) {
      setError('That email does not match the account in this browser.');
      return;
    }
    router.push(`/${acct.barn}`);
  }

  const field =
    'w-full rounded-form border border-ink/15 dark:border-oat/20 bg-white dark:bg-oat/[0.04] px-5 py-3.5 text-ink dark:text-oat placeholder:text-ink/60 dark:placeholder:text-oat/55 focus:outline-none focus:border-hermes focus:ring-1 focus:ring-hermes/40 transition-colors';
  const label =
    'block font-label text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink/65 dark:text-oat/55 mb-2.5';

  return (
    <div className="mt-9">
      {/* mode switch */}
      <div className="flex rounded-full border border-ink/15 dark:border-oat/20 p-1 mb-8">
        {[
          { id: 'create', label: 'Create account' },
          { id: 'login', label: 'Log in' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setError('');
            }}
            className={`flex-1 rounded-full py-2.5 font-label text-[0.82rem] font-semibold transition-colors ${
              mode === m.id
                ? 'bg-hermes text-ink'
                : 'text-ink/65 dark:text-oat/60 hover:text-ink dark:hover:text-oat'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="aq-email" className={label}>
            Email
          </label>
          <input
            id="aq-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="off"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="aq-password" className={label}>
            Password
          </label>
          <input
            id="aq-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            className={field}
          />
        </div>

        {mode === 'create' && (
          <div className="animate-rise">
            <label htmlFor="aq-code" className={label}>
              Barn code
            </label>
            <input
              id="aq-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AA1111"
              autoComplete="off"
              spellCheck="false"
              className={`${field} tracking-[0.1em] uppercase placeholder:tracking-normal`}
            />
            <p className="mt-3 text-ink/65 dark:text-oat/55 text-[0.82rem] leading-relaxed">{helpText}</p>
          </div>
        )}

        {error && (
          <p className="text-[0.84rem] text-hermes-ink dark:text-hermes-light leading-relaxed" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full btn-hermes rounded-full py-3.5 font-label text-sm font-semibold shadow-hermes-md"
        >
          {mode === 'create' ? 'Create account and open my barn' : 'Log in'}
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-ink/15 dark:border-oat/15 p-5">
        <DemoRibbon className="mb-3" />
        <p className="text-ink/65 dark:text-oat/55 text-[0.82rem] leading-relaxed">
          The account is a record in this browser only — nothing is sent anywhere. Use code{' '}
          <span className="font-label font-semibold text-ink dark:text-oat">AA1111</span> for the
          demo barn.
          {existing && (
            <>
              {' '}
              An account for <span className="font-semibold">{existing.email}</span> already
              exists here, tied to /{existing.barn}.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
