import { Coin } from '@terra-money/terra.js'
import { terraLCDClient as terra } from '../../utils/terraConfig'
import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies } from '../../types/misc'

interface AssetItemProps extends TouchableOpacityProps {
  asset?: Asset
  dropdown?: boolean
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, style, dropdown, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  const { currency } = useSettingsContext()

  const [swapRate, setSwapRate] = React.useState(new Coin(currency, 0))

  const calculateSwapRate = React.useCallback(async () => {
    if (dropdown || !asset) {
      return
    }
    const { amount, denom } = asset.coin
    const rate =
      denom === currency
        ? new Coin(denom, amount)
        : await terra.market.swapRate(new Coin(denom, amount), currency)
    setSwapRate(rate)
  }, [asset, currency, dropdown])

  React.useEffect(() => {
    calculateSwapRate()
  }, [calculateSwapRate])

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      {asset ? (
        <View style={styles.row}>
          <Image source={{ uri: t(`${asset.coin.denom} image`) }} style={styles.avatar} />
          {asset.apy ? (
            <View style={styles.badge}>
              <Typography color={theme.palette.white} type="Small">
                {formatPercentage(asset.apy)}
              </Typography>
            </View>
          ) : null}
          <View>
            <Typography type="H6">{t(`${asset.coin.denom} name`)}</Typography>
            <Typography>{t(`${asset.coin.denom} description`)}</Typography>
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <Icon name="help-circle" size={theme.baseSpace * 9.5} style={styles.avatar} />
          <Typography type="H5">{t('select asset')}</Typography>
        </View>
      )}
      {dropdown || !asset ? (
        <Icon name="chevron-down" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
      ) : (
        <View style={styles.rightAligned}>
          <Typography type="H6">{formatCurrency(asset.coin.amount, asset.coin.denom)}</Typography>
          <Typography>
            {formatCurrency(swapRate.amount.toString(), swapRate.denom as Currencies)}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default AssetItem
