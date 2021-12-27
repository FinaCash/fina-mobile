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
import { format } from 'date-fns'

export interface StakingItemProps extends TouchableOpacityProps {
  validator: Validator
  toValidator?: Validator
  amount: number
  symbol: string
  price: number
  completion?: number
  hideBorder?: boolean
  hideValue?: boolean
}

const StakingItem: React.FC<StakingItemProps> = ({
  validator,
  toValidator,
  amount,
  symbol,
  price,
  completion,
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
            {toValidator ? (
              toValidator.image ? (
                <Image source={{ uri: toValidator.image }} style={styles.toAvatar} />
              ) : (
                <Icon
                  name="user-circle"
                  style={styles.avatar}
                  size={styles.avatar.width}
                  color={theme.palette.grey[5]}
                />
              )
            ) : null}
            <View>
              <View style={styles.row}>
                <Typography
                  type="H6"
                  style={toValidator ? styles.name : undefined}
                  numberOfLines={1}
                >
                  {validator.name}
                </Typography>
                {toValidator ? <Typography type="H6"> → </Typography> : null}
                {toValidator ? (
                  <Typography type="H6" style={styles.name} numberOfLines={1}>
                    {toValidator.name}
                  </Typography>
                ) : null}
              </View>
              <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                {completion
                  ? t('complete at', { completion: format(completion, 'yyyy-MM-dd, HH:mm') })
                  : t('validator commission and vp', {
                      commission: formatPercentage((toValidator || validator).commission, 2),
                      votingPower: formatPercentage((toValidator || validator).votingPower, 2),
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
      </View>
    </TouchableOpacity>
  )
}

export default StakingItem
