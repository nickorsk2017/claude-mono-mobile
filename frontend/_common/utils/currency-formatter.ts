export function formatCurrency(
  priceInCents: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string {
  const priceInDollars = priceInCents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(priceInDollars);
}

export function formatRelativeDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const now = new Date();
  const differenceInMs = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) return 'Today';
  if (differenceInDays === 1) return 'Yesterday';
  if (differenceInDays < 7) return `${differenceInDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
