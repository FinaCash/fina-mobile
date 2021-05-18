import { Currencies, CurrencySymbols } from '../types/misc'

export const formatCurrency = (amount: string | number, denom: Currencies) =>
  `${CurrencySymbols[denom]}${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(
    (Number(amount) || 0) / 10 ** 6
  )}`

export const formatPercentage = (percent: number): string =>
  new Intl.NumberFormat('en', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(percent || 0)
