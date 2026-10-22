'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_BARN_SLUG, MOCK_ACCOUNT_KEY } from '@/lib/access';

// Mock accounts live in this browser until the production auth provider is connected.
function readAccount() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_ACCOUNT_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function AccessForm() {
  const router = useRouter();
  const [mode, setMode] = useState('create'); // 'create' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    const acct = readAccount();
    setExisting(acct);
    if (acct) setMode('login');
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and a password.');
      return;
    }

    if (mode === 'create') {
      try {
        const account = { email: email.trim(), barn: DEFAULT_BARN_SLUG, provider: 'email' };
        localStorage.setItem(MOCK_ACCOUNT_KEY, JSON.stringify(account));
        router.push(`/${DEFAULT_BARN_SLUG}`);
      } catch {
        setError('Your account could not be saved in this browser. Check your browser storage settings and try again.');
      }
      return;
    }

    // log in
    const acct = readAccount();
    if (!acct) {
      setError('No account in this browser yet. Create an account or continue with Google.');
      return;
    }
    if (acct.email !== email.trim()) {
      setError('That email does not match the account in this browser.');
      return;
    }
    router.push(`/${DEFAULT_BARN_SLUG}`);
  }

  function onGoogleSignIn() {
    setError('');
    try {
      const account = {
        email: existing?.email || 'google-rider@example.com',
        barn: DEFAULT_BARN_SLUG,
        provider: 'google',
      };
      localStorage.setItem(MOCK_ACCOUNT_KEY, JSON.stringify(account));
      router.push(`/${DEFAULT_BARN_SLUG}`);
    } catch {
      setError('Google sign-in could not be saved in this browser. Check your browser storage settings and try again.');
    }
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

      <div className="relative my-6 text-center">
        <span className="relative z-10 bg-oat px-3 font-label text-[0.68rem] uppercase tracking-[0.14em] text-ink/50 dark:bg-ink dark:text-oat/50">
          or
        </span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/10 dark:bg-oat/10" />
      </div>

      <button
        type="button"
        onClick={onGoogleSignIn}
        className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-ink/15 dark:border-oat/20 bg-white dark:bg-oat/[0.04] px-5 py-3 font-label text-sm font-semibold text-ink dark:text-oat hover:border-hermes transition-colors"
      >
        <span aria-hidden="true" className="font-display text-lg font-bold text-[#4285F4]">G</span>
        Continue with Google
      </button>

      <div className="mt-8 rounded-xl border border-ink/15 dark:border-oat/15 p-5">
        <p className="text-ink/65 dark:text-oat/55 text-[0.82rem] leading-relaxed">
          Email accounts and Google sign-in are mocked in this preview and stored in this browser.
          No authentication data is sent to a server.
          {existing && (
            <>
              {' '}
              An account for <span className="font-semibold">{existing.email}</span> already
              exists here.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
