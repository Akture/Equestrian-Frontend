export const MOCK_PURCHASES_KEY = 'aq-mock-purchased-folders';

export function readMockPurchases() {
  const stored = localStorage.getItem(MOCK_PURCHASES_KEY);
  if (!stored) return [];
  const purchases = JSON.parse(stored);
  if (!Array.isArray(purchases)) {
    throw new Error('Saved purchases are not in the expected format.');
  }
  return purchases;
}

export function writeMockPurchases(purchases) {
  localStorage.setItem(MOCK_PURCHASES_KEY, JSON.stringify(purchases));
}
