import { Coin } from '@terra-money/terra.js'
import { getMirrorAssetImage, terraLCDClient as terra } from '../../utils/terraConfig'
import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { MirrorAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies } from '../../types/misc'

interface MirrorAssetItemProps extends TouchableOpacityProps {
  mAsset: MirrorAsset
}

const MirrorAssetItem: React.FC<MirrorAssetItemProps> = ({ mAsset, style, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  const { currency } = useSettingsContext()

  // const [swapRate, setSwapRate] = React.useState(new Coin(currency, 0))

  // const calculateSwapRate = React.useCallback(async () => {
  //   if (dropdown || !asset) {
  //     return
  //   }
  //   const { amount, denom } = asset.coin
  //   const rate =
  //     denom === currency
  //       ? new Coin(denom, amount)
  //       : await terra.market.swapRate(new Coin(denom, amount), currency)
  //   setSwapRate(rate)
  // }, [asset, currency, dropdown])

  // React.useEffect(() => {
  //   calculateSwapRate()
  // }, [calculateSwapRate])

  const deltaPercent = (mAsset.price - mAsset.prevPrice) / mAsset.prevPrice

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.row}>
        <Image source={{ uri: getMirrorAssetImage(mAsset.symbol) }} style={styles.avatar} />
        <View>
          <Typography type="H6">{mAsset.symbol}</Typography>
          <Typography numberOfLines={2}>{mAsset.name}</Typography>
        </View>
      </View>

      <View style={styles.rightAligned}>
        <Typography type="H6">{formatCurrency(mAsset.price, Currencies.USD)}</Typography>
        <Typography>{formatPercentage(deltaPercent, 2)}</Typography>
      </View>
    </TouchableOpacity>
  )
}

export default MirrorAssetItem
