import { Currencies } from '../types/misc'

export const formatCurrency = (amount: string | number, denom: string) =>
  Object.values(Currencies).includes(denom as any)
    ? new Intl.NumberFormat('en', {
        maximumFractionDigits: 2,
      }).format((Number(amount) || 0) / 10 ** 6)
    : new Intl.NumberFormat('en', {
        maximumFractionDigits: 6,
      }).format((Number(amount) || 0) / 10 ** 6)

export const formatPercentage = (percent: number, digits?: number): string =>
  new Intl.NumberFormat('en', {
    style: 'percent',
    maximumFractionDigits: digits || 0,
  }).format(percent || 0)
