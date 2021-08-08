import { getCurrencyFromDenom } from './transformAssets'

export const formatCurrency = (amount: string | number, denom: string, withSymbol?: boolean) =>
  new Intl.NumberFormat('en', {
    maximumSignificantDigits: withSymbol ? undefined : 6,
    maximumFractionDigits: withSymbol ? 2 : undefined,
    style: withSymbol ? 'currency' : undefined,
    currency: withSymbol ? getCurrencyFromDenom(denom) : undefined,
  }).format((Number(amount) || 0) / 10 ** 6)

export const getCurrencySymbol = (denom: string) =>
  formatCurrency(0, denom, true).replace(/[0-9.,]/g, '')

export const formatPercentage = (percent: number, digits?: number): string =>
  new Intl.NumberFormat('en', {
    style: 'percent',
    maximumFractionDigits: digits || 0,
  }).format(percent || 0)
