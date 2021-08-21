import React from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import getStyles from './styles'
import CheckIcon from '../../assets/images/icons/check.svg'
import { Asset } from '../../types/assets'
import useStyles from '../../theme/useStyles'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AssetItem from '../../components/AssetItem'
import Typography from '../../components/Typography'
import useTranslation from '../../locales/useTranslation'
import { formatCurrency } from '../../utils/formatNumbers'
import Button from '../../components/Button'

interface SuccessProps {
  message:
    | {
        type: 'send'
        asset: Asset
        amount: number
        address: string
      }
    | {
        type: 'swap'
        from: Asset
        to: Asset
      }

  onClose(): void
}

const Success: React.FC<SuccessProps> = ({ message, onClose }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.greyConteiner}>
          <LinearGradient
            style={styles.checkContainer}
            colors={theme.gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
          >
            <CheckIcon fill={theme.palette.white} />
          </LinearGradient>
          {message.type === 'send' ? (
            <>
              <AssetItem asset={message.asset} hideAmount hideBorder />
              <View style={[styles.row, styles.borderBottom]}>
                <Typography type="Large" color={theme.palette.grey[7]}>
                  {t('amount')}
                </Typography>
                <Typography type="Large">
                  {formatCurrency(message.amount * 10 ** 6, '')} {message.asset.symbol}
                </Typography>
              </View>
              <View style={styles.row}>
                <Typography type="Large" color={theme.palette.grey[7]}>
                  {t('to')}
                </Typography>
                <View style={styles.alignRight}>
                  <Typography type="Large" style={styles.marginBottom}>
                    {t('new address')}
                  </Typography>
                  <Typography type="Small" color={theme.palette.grey[7]}>
                    {message.address}
                  </Typography>
                </View>
              </View>
            </>
          ) : null}
          {message.type === 'swap' ? (
            <>
              <AssetItem asset={message.from} hideBorder />
              <Icon
                name="arrow-down"
                size={theme.baseSpace * 8}
                color={theme.palette.grey[10]}
                style={styles.arrow}
              />
              <AssetItem asset={message.to} hideBorder />
            </>
          ) : null}
        </View>
        <Typography style={styles.title} type="H6">
          {t('transaction sent')}
        </Typography>
      </View>
      <Button onPress={onClose} size="Large">
        {t('close')}
      </Button>
    </View>
  )
}

export default Success
