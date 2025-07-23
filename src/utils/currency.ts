export type Currency = 'USD' | 'MYR' | 'CNY';

// Exchange rates (these would typically come from an API)
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  MYR: 4.75, // 1 USD = 4.75 MYR
  CNY: 7.25  // 1 USD = 7.25 CNY
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  MYR: 'RM',
  CNY: '¥'
};

export const convertPrice = (usdPrice: string, targetCurrency: Currency): string => {
  // Remove $ and commas, convert to number
  const numericPrice = parseFloat(usdPrice.replace(/[$,]/g, ''));
  
  if (isNaN(numericPrice)) return usdPrice;
  
  const convertedPrice = numericPrice * exchangeRates[targetCurrency];
  const symbol = currencySymbols[targetCurrency];
  
  // Format with appropriate decimals and commas
  if (targetCurrency === 'USD') {
    return `${symbol}${convertedPrice.toLocaleString('en-US')}`;
  } else {
    return `${symbol}${Math.round(convertedPrice).toLocaleString('en-US')}`;
  }
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currencySymbols[currency];
};