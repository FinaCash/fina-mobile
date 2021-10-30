import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import get from 'lodash/get'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

export interface CollateralItemProps extends TouchableOpacityProps {
  asset: Asset
  hideBorder?: boolean
}

const CollateralItem: React.FC<CollateralItemProps> = ({ asset, hideBorder, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currency } = useSettingsContext()

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            <View>
              <Typography type="H6">{asset.symbol}</Typography>
              <Typography type="Small" numberOfLines={2}>
                {asset.name}
              </Typography>
            </View>
          </View>

          <View style={styles.rightAligned}>
            <Typography type="H6">
              {formatCurrency(String(asset.price! * 10 ** 6), currency, true)}
            </Typography>
          </View>
        </View>
        {asset ? (
          <View style={styles.aprContainer}>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('not provided')}
              </Typography>
              <Typography bold>
                {formatCurrency(
                  get(asset, 'notProvided', 0).toString(),
                  get(asset, 'coin.denom', '')
                )}
              </Typography>
            </View>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('provided')}
              </Typography>
              <Typography bold>
                {formatCurrency(get(asset, 'provided', 0).toString(), get(asset, 'coin.denom', ''))}
              </Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('collateral max ltv')}
              </Typography>
              <Typography color={theme.palette.green} bold>
                {formatPercentage(get(asset, 'maxLtv', 0), 0)}
              </Typography>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default CollateralItem
