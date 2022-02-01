import React from 'react'
import get from 'lodash/get'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { View } from 'react-native'
import Typography from '../Typography'
import { AvailableAsset, Farm, FarmType } from '../../types/assets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { useSettingsContext } from '../../contexts/SettingsContext'

interface MyFarmItemProps {
  farm: Farm
  availableAssetsMap: { [symbol: string]: AvailableAsset }
}

const MyFarmItem: React.FC<MyFarmItemProps> = ({ farm, availableAssetsMap }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currency, currencyRate } = useSettingsContext()

  let poolName = ''
  if (farm.type === FarmType.Long) {
    poolName = `${farm.symbol} - UST`
  } else {
    poolName = farm.symbol
  }

  const assets = [
    { amount: farm.balance * farm.rate.token, denom: farm.symbol },
    { amount: farm.balance * farm.rate.ust, denom: getSymbolFromDenom('uusd') },
  ].filter((a) => a.amount > 0)

  return (
    <View style={styles.container}>
      <View style={{ width: 26 * theme.baseSpace }}>
        <Typography style={styles.title} type="Small" color={theme.palette.grey[7]}>
          {t('name')}
        </Typography>
        <Typography bold>{poolName}</Typography>
        <Typography
          style={[styles.title, { marginTop: 2 * theme.baseSpace }]}
          type="Small"
          color={theme.palette.grey[7]}
        >
          {t('apr')}
        </Typography>
        <Typography bold>{formatPercentage(farm.apr)}</Typography>
      </View>
      <View style={{ flex: 1, marginLeft: 2 * theme.baseSpace }}>
        <Typography style={styles.title} type="Small" color={theme.palette.grey[7]}>
          {t('assets')}
        </Typography>
        {assets.map((a) => (
          <Typography key={a.denom} bold type="Small">
            {formatCurrency(a.amount, a.denom)} {a.denom}
          </Typography>
        ))}
        <Typography style={{ marginTop: theme.baseSpace }} type="Small">
          {'= '}
          {formatCurrency(
            assets
              .map((a) => a.amount * get(availableAssetsMap, [a.denom, 'price'], 0))
              .reduce((a, b) => a + b, 0) * currencyRate,
            currency,
            true
          )}
        </Typography>
      </View>
      <View style={{ flex: 1, marginLeft: 2 * theme.baseSpace }}>
        <Typography style={styles.title} type="Small" color={theme.palette.grey[7]}>
          {t('rewards')}
        </Typography>
        {farm.rewards.map((a) => (
          <Typography key={a.denom} bold type="Small">
            {formatCurrency(a.amount, a.denom)} {a.denom}
          </Typography>
        ))}
        <Typography style={{ marginTop: theme.baseSpace }} type="Small">
          {'= '}
          {formatCurrency(
            farm.rewards
              .map((a) => a.amount * get(availableAssetsMap, [a.denom, 'price'], 0))
              .reduce((a, b) => a + b, 0) * currencyRate,
            currency,
            true
          )}
        </Typography>
      </View>
    </View>
  )
}

export default MyFarmItem
