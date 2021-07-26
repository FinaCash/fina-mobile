import React from 'react'
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
  asset: Asset
  amount: number
  address: string
  onClose(): void
}

const Success: React.FC<SuccessProps> = ({ asset, amount, address, onClose }) => {
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
          <AssetItem asset={asset} hideAmount />
          <View style={[styles.row, styles.borderBottom]}>
            <Typography type="Large" color={theme.palette.grey[7]}>
              {t('amount')}
            </Typography>
            <Typography type="Large">
              {formatCurrency(amount * 10 ** 6, '')} {asset.symbol}
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
                {address}
              </Typography>
            </View>
          </View>
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
