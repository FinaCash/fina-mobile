import { getCurrencyFromDenom } from './transformAssets'

export const formatCurrency = (
  amount: string | number,
  denom: string,
  withSymbol?: boolean,
  hideAmount?: boolean
) => {
  const result = new Intl.NumberFormat('en', {
    maximumSignificantDigits: withSymbol ? undefined : 6,
    maximumFractionDigits: withSymbol ? 2 : undefined,
    style: withSymbol ? 'currency' : undefined,
    currency: withSymbol ? getCurrencyFromDenom(denom) : undefined,
    notation: (Number(amount) || 0) > 10 ** 12 ? 'compact' : undefined,
  }).format((Number(amount) || 0) / 10 ** 6)
  return hideAmount ? result.replace(/[0-9,.]/g, '') + '****' : result
}

export const getCurrencySymbol = (denom: string) =>
  formatCurrency(0, denom, true).replace(/[0-9.,]/g, '')

export const formatPercentage = (percent: number, digits?: number): string =>
  new Intl.NumberFormat('en', {
    style: 'percent',
    maximumFractionDigits: digits || 0,
  }).format(percent || 0)
