import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import { Validator } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

export interface StakingItemProps extends TouchableOpacityProps {
  validator: Validator
  amount: number
  symbol: string
  price: number
  hideBorder?: boolean
  hideValue?: boolean
}

const StakingItem: React.FC<StakingItemProps> = ({
  validator,
  amount,
  symbol,
  price,
  hideBorder,
  hideValue,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currency, currencyRate } = useSettingsContext()

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            {validator.image ? (
              <Image source={{ uri: validator.image }} style={styles.avatar} />
            ) : (
              <Icon
                name="user-circle"
                style={styles.avatar}
                size={styles.avatar.width}
                color={theme.palette.grey[5]}
              />
            )}
            <View>
              <Typography type="H6">{validator.name}</Typography>
              <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                {t('validator commission and vp', {
                  commission: formatPercentage(validator.commission),
                  votingPower: formatPercentage(validator.votingPower),
                })}
              </Typography>
            </View>
          </View>

          {hideValue ? null : (
            <View style={styles.rightAligned}>
              <Typography style={styles.gutterBottom} type="H6">
                {formatCurrency(amount, symbol)}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {price ? formatCurrency(price * amount * currencyRate, currency, true) : ''}
              </Typography>
            </View>
          )}
        </View>

        {/* <View style={styles.aprContainer}>
          <View>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('apr')}
            </Typography>
            <Typography bold>{formatPercentage(apr, 2)}</Typography>
          </View>
          <View style={styles.alignRight}>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('pending rewards')}
            </Typography>
            <Typography bold>{formatCurrency(rewards, '')}</Typography>
          </View>
          {hideValue ? null : (
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('usd value')}
              </Typography>
              <Typography bold>
                {formatCurrency(rewards * availableAsset.price, 'uusd', true)}
              </Typography>
            </View>
          )}
        </View> */}
      </View>
    </TouchableOpacity>
  )
}

export default StakingItem
