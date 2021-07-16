import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies } from '../../types/misc'
import get from 'lodash/get'
import { darkBGIconMAssets } from '../../utils/terraConfig'

interface AssetItemProps extends TouchableOpacityProps {
  asset?: Asset
  dropdown?: boolean
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, style, dropdown, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.innerContainer}>
        {asset ? (
          <View style={styles.row}>
            <Image
              source={{ uri: asset.image }}
              style={[
                styles.avatar,
                darkBGIconMAssets.includes(asset.symbol) ? styles.darkBackground : {},
              ]}
            />
            {asset.apy ? (
              <View style={styles.badge}>
                <Typography color={theme.palette.white} type="Small">
                  {formatPercentage(asset.apy)}
                </Typography>
              </View>
            ) : null}
            <View>
              <Typography type="H6">{asset.symbol}</Typography>
              <Typography>{asset.name}</Typography>
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
              {asset.worth
                ? formatCurrency(
                    get(asset, 'worth.amount', 0).toString(),
                    asset.worth.denom as Currencies
                  )
                : ''}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default AssetItem
