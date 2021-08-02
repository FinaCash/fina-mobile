import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies, CurrencySymbols } from '../../types/misc'
import get from 'lodash/get'

interface AssetItemProps extends TouchableOpacityProps {
  asset: Asset
  hideApr?: boolean
  hideAmount?: boolean
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, hideApr, hideAmount, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()

  return (
    <TouchableOpacity {...props}>
      <View style={styles.innerContainer}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            <View>
              <Typography style={styles.gutterBottom} type="H6">
                {asset.symbol}
              </Typography>
              <Typography color={theme.palette.grey[7]}>{asset.name}</Typography>
            </View>
          </View>
          {(!asset.apr || hideApr) && !hideAmount ? (
            <View style={styles.rightAligned}>
              <Typography style={styles.gutterBottom} type="H6">
                {formatCurrency(asset.coin.amount, asset.coin.denom)}
              </Typography>
              <Typography color={theme.palette.grey[7]}>
                {asset.worth
                  ? formatCurrency(
                      get(asset, 'worth.amount', 0).toString(),
                      asset.worth.denom as Currencies,
                      true
                    )
                  : ''}
              </Typography>
            </View>
          ) : null}
        </View>
        {asset.apr && !hideApr ? (
          <View style={styles.aprContainer}>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('amount (symbol)', {
                  symbol: (CurrencySymbols as any)[`u${asset.coin.denom.slice(-3)}`],
                })}
              </Typography>
              <Typography bold>
                {formatCurrency(
                  get(asset, 'worth.amount', 0).toString(),
                  get(asset, 'worth.denom', '') as Currencies
                )}
              </Typography>
            </View>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t(asset.autoCompound ? 'apy' : 'apr', {
                  symbol: (CurrencySymbols as any)[asset.coin.denom],
                })}
              </Typography>
              <Typography bold>{formatPercentage(asset.apr, 2)}</Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('rewards')}
              </Typography>
              <Typography color={theme.palette.green} bold>
                {asset.autoCompound
                  ? t('auto compounded')
                  : formatCurrency(
                      get(asset, 'rewards.amount', 0).toString(),
                      get(asset, 'rewards.denom', '') as Currencies
                    )}
              </Typography>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default AssetItem
