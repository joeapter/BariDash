export function formatPrice(value: number, locale: string) {
  const resolvedLocale = locale === 'he' ? 'he-IL' : 'en-US';

  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency: 'ILS',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2
  }).format(value);
}
