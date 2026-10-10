'use client';

import { useState } from 'react';
import { validateStripeTestPayment } from '@/lib/stripeTest';

export default function StripeTestCheckout({ amount, onClose, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    setError('');
    const result = validateStripeTestPayment({ cardNumber, expiry, cvc });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const issue = onSuccess(result);
    if (issue) setError(issue);
  }

  const fieldClass =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[0.9rem] text-ink placeholder:text-ink/45 focus:border-hermes focus:outline-none focus:ring-2 focus:ring-hermes/20 dark:border-oat/20 dark:bg-ink dark:text-oat';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink/75 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="stripe-test-title"
        className="my-auto w-full max-w-lg rounded-3xl border border-ink/10 bg-oat p-5 shadow-2xl dark:border-oat/15 dark:bg-pine-deep md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-hermes-ink dark:text-hermes-light">
              Stripe test mode
            </p>
            <h2 id="stripe-test-title" className="mt-2 font-display text-2xl text-ink dark:text-oat">
              Complete your purchase
            </h2>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-ink/60 dark:text-oat/60">
              This is a local mock checkout. No card details are sent to Stripe or saved.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/65 hover:border-hermes dark:border-oat/20 dark:text-oat/65"
          >
            <i className="ph-bold ph-x" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-hermes/30 bg-hermes/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.84rem] text-ink/70 dark:text-oat/70">Total</span>
            <span className="font-display text-xl text-ink dark:text-oat">${amount.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-[0.76rem] leading-relaxed text-ink/65 dark:text-oat/60">
            Successful test card: <span className="font-label font-semibold tabular-nums">4242 4242 4242 4242</span>
            <br />
            Declined test card: <span className="font-label font-semibold tabular-nums">4000 0000 0000 9995</span>
            <br />
            Use any future expiry date and any 3-digit CVC.
          </p>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="stripe-test-card" className="mb-2 block font-label text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink/65 dark:text-oat/60">
              Test card number
            </label>
            <input
              id="stripe-test-card"
              autoComplete="cc-number"
              inputMode="numeric"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              placeholder="4242 4242 4242 4242"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="stripe-test-expiry" className="mb-2 block font-label text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink/65 dark:text-oat/60">
                Expiration
              </label>
              <input
                id="stripe-test-expiry"
                autoComplete="cc-exp"
                inputMode="numeric"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                placeholder="MM / YY"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="stripe-test-cvc" className="mb-2 block font-label text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink/65 dark:text-oat/60">
                Security code
              </label>
              <input
                id="stripe-test-cvc"
                autoComplete="cc-csc"
                inputMode="numeric"
                value={cvc}
                onChange={(event) => setCvc(event.target.value)}
                placeholder="CVC"
                className={fieldClass}
              />
            </div>
          </div>

          {error && <p className="text-[0.82rem] leading-relaxed text-red-700 dark:text-red-300" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-full border border-ink/15 px-5 py-3 font-label text-[0.82rem] font-semibold text-ink/75 hover:border-hermes dark:border-oat/20 dark:text-oat/75">
              Cancel
            </button>
            <button type="submit" className="btn-hermes inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-label text-[0.82rem] font-semibold shadow-hermes-md">
              <i className="ph-bold ph-lock-key" aria-hidden="true" />
              Pay ${amount.toFixed(2)}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
