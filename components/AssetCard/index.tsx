import { Coin } from '@terra-money/terra.js'
import terra from '../../utils/terraClient'
import React from 'react'
import { Image, TouchableOpacityProps, View } from 'react-native'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Card from '../Card'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies } from '../../types/misc'

interface AssetCardProps extends TouchableOpacityProps {
  asset: Asset
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  const { currency } = useSettingsContext()

  const [swapRate, setSwapRate] = React.useState(new Coin(currency, 0))

  const calculateSwapRate = React.useCallback(async () => {
    const { amount, denom } = asset.coin
    const rate =
      denom === currency
        ? new Coin(denom, amount)
        : await terra.market.swapRate(new Coin(denom, amount), currency)
    setSwapRate(rate)
  }, [asset, currency])

  React.useEffect(() => {
    calculateSwapRate()
  }, [calculateSwapRate])

  return (
    <Card style={styles.container} {...props}>
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
          <Typography type="H5">{t(`${asset.coin.denom} name`)}</Typography>
          <Typography>{t(`${asset.coin.denom} description`)}</Typography>
        </View>
      </View>
      <View style={styles.rightAligned}>
        <Typography type="H5">{formatCurrency(asset.coin.amount, asset.coin.denom)}</Typography>
        <Typography>
          {formatCurrency(swapRate.amount.toString(), swapRate.denom as Currencies)}
        </Typography>
      </View>
    </Card>
  )
}

export default AssetCard
