const SUCCESS_CARD = '4242424242424242';
const DECLINED_CARD = '4000000000009995';
const AUTHENTICATION_REQUIRED_CARD = '4000002500003155';

export function validateStripeTestPayment({ cardNumber, expiry, cvc }) {
  const number = cardNumber.replace(/\D/g, '');
  if (number === DECLINED_CARD) {
    return { ok: false, message: 'The Stripe test card was declined. Try the successful test card below.' };
  }
  if (number === AUTHENTICATION_REQUIRED_CARD) {
    return { ok: false, message: 'This Stripe test card requires additional authentication, which is not enabled in this mock checkout.' };
  }
  if (number !== SUCCESS_CARD) {
    return { ok: false, message: 'Use the successful Stripe test card shown below.' };
  }

  const expiryMatch = expiry.match(/^\s*(\d{2})\s*\/\s*(\d{2}|\d{4})\s*$/);
  if (!expiryMatch) {
    return { ok: false, message: 'Enter the expiration date as MM/YY.' };
  }
  const month = Number(expiryMatch[1]);
  const yearPart = Number(expiryMatch[2]);
  const year = yearPart < 100 ? 2000 + yearPart : yearPart;
  const now = new Date();
  if (month < 1 || month > 12 || year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return { ok: false, message: 'Enter a valid future expiration date.' };
  }
  if (!/^\d{3,4}$/.test(cvc.trim())) {
    return { ok: false, message: 'Enter a three- or four-digit security code.' };
  }
  return { ok: true, last4: '4242' };
}
