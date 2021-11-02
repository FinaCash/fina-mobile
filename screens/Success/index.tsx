import React from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import getStyles from './styles'
import CheckIcon from '../../assets/images/icons/check.svg'
import { Asset, AvailableAsset } from '../../types/assets'
import useStyles from '../../theme/useStyles'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AssetItem from '../../components/AssetItem'
import Typography from '../../components/Typography'
import { formatCurrency } from '../../utils/formatNumbers'
import Button from '../../components/Button'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import RewardsItem from '../../components/RewardsItem'
import AvailableAssetItem from '../../components/AvailableAssetItem'

interface SuccessProps {
  message:
    | {
        type: 'send'
        asset: Asset
        amount: number
        address: string
        memo: string
      }
    | {
        type: 'swap'
        from: Asset
        to: Asset
      }
    | {
        type: 'claim'
        availableAsset: AvailableAsset
        rewards: number
        apr: number
      }
    | {
        type: 'provide collateral' | 'withdraw collateral'
        availableAsset: AvailableAsset
        amount: number
      }
  error?: string
  onClose(): void
}

const Success: React.FC<SuccessProps> = ({ message, error, onClose }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { recipients } = useRecipientsContext()
  const recipient =
    message.type === 'send' ? recipients.find((r) => r.address === message.address) : undefined
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.greyConteiner}>
          <LinearGradient
            style={styles.checkContainer}
            colors={error ? theme.gradients.error : theme.gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
          >
            {error ? (
              <Icon name="x" color={theme.palette.white} size={theme.baseSpace * 10} />
            ) : (
              <CheckIcon fill={theme.palette.white} />
            )}
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
                    {recipient ? recipient.name : t('new address')}
                  </Typography>
                  <Typography type="Small" color={theme.palette.grey[7]}>
                    {message.address}
                  </Typography>
                </View>
              </View>
              <View style={[styles.row, styles.borderBottom]}>
                <Typography type="Large" color={theme.palette.grey[7]}>
                  {t('memo')}
                </Typography>
                <Typography type="Large">{message.memo}</Typography>
              </View>
            </>
          ) : null}
          {message.type === 'swap' ? (
            <>
              <AssetItem asset={message.from} hideBorder hideApr />
              <Icon
                name="arrow-down"
                size={theme.baseSpace * 8}
                color={theme.palette.grey[10]}
                style={styles.arrow}
              />
              <AssetItem asset={message.to} hideBorder hideApr />
            </>
          ) : null}
          {message.type === 'claim' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t('claim')}
              </Typography>
              <RewardsItem
                availableAsset={message.availableAsset}
                apr={message.apr}
                rewards={message.rewards}
                hideValue
                hideBorder
              />
            </>
          ) : null}
          {message.type === 'provide collateral' || message.type === 'withdraw collateral' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <AvailableAssetItem availableAsset={message.availableAsset} amount={message.amount} />
            </>
          ) : null}
        </View>
        <Typography style={styles.title} type="H6">
          {error || t('transaction sent')}
        </Typography>
      </View>
      <Button onPress={onClose} size="Large">
        {t('close')}
      </Button>
    </View>
  )
}

export default Success
