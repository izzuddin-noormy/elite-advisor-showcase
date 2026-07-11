export type Currency = 'USD' | 'MYR' | 'CNY';

// Prices are stored in MYR. Rates express how many target-currency units per 1 MYR.
const ratesFromMYR: Record<Currency, number> = {
  MYR: 1,
  USD: 1 / 4.75, // 4.75 MYR = 1 USD
  CNY: 7.25 / 4.75, // via USD
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  MYR: 'RM',
  CNY: '¥',
};

/** Convert a price stored in MYR (number or string) to the target currency string. */
export const convertPrice = (myrPrice: string | number, targetCurrency: Currency): string => {
  const numericPrice = typeof myrPrice === 'number' ? myrPrice : parseFloat(String(myrPrice).replace(/[^0-9.]/g, ''));
  if (isNaN(numericPrice)) return String(myrPrice);

  const converted = numericPrice * ratesFromMYR[targetCurrency];
  const symbol = currencySymbols[targetCurrency];
  return `${symbol}${Math.round(converted).toLocaleString('en-US')}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currencySymbols[currency];
};

/** Format a MYR amount as RM with thousands separators. */
export const formatMYR = (amount: number): string => {
  return `RM${Math.round(amount).toLocaleString('en-US')}`;
};
