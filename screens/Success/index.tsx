import React from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import getStyles from './styles'
import CheckIcon from '../../assets/images/icons/check.svg'
import { Asset, AvailableAsset, Farm, Validator } from '../../types/assets'
import useStyles from '../../theme/useStyles'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AssetItem from '../../components/AssetItem'
import Typography from '../../components/Typography'
import { formatCurrency } from '../../utils/formatNumbers'
import { terraScopeUrl } from '../../utils/terraConfig'
import Button from '../../components/Button'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import RewardsItem from '../../components/RewardsItem'
import AvailableAssetItem from '../../components/AvailableAssetItem'
import StakingItem from '../../components/StakingItem'
import { getTokenAssetDetail } from '../../utils/transformAssets'
import { useAssetsContext } from '../../contexts/AssetsContext'
import FarmItem from '../../components/FarmItem'
import JSONTree from 'react-native-json-tree'
import jsonTree from '../../theme/jsonTree'
import { useSettingsContext } from '../../contexts/SettingsContext'

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
        more?: number
        rewardsValue?: number
      }
    | {
        type: 'provide collateral' | 'withdraw collateral'
        availableAsset: AvailableAsset
        amount: number
      }
    | {
        type: 'borrow' | 'repay'
        asset: Asset
      }
    | {
        type: 'delegate' | 'undelegate'
        amount: number
        validator: Validator
        symbol: string
        price: number
      }
    | {
        type: 'redelegate'
        amount: number
        fromValidator: Validator
        toValidator: Validator
        symbol: string
        price: number
      }
    | {
        type: 'provide liquidity'
        asset: Asset
        pairAsset: Asset
      }
    | {
        type: 'withdraw liquidity'
        availableAsset: AvailableAsset
        pairAsset: AvailableAsset
        farm: Farm
        amount: number
      }
    | {
        type: 'claim farm rewards'
        farms: Farm[]
      }
    | {
        type: 'wallet connect'
        msgs: string[]
        fee: string
      }
  error?: string
  txHash?: string
  onClose(): void
}

const Success: React.FC<SuccessProps> = ({ message, error, txHash, onClose }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { availableAssets } = useAssetsContext()
  const { recipients } = useRecipientsContext()
  const { theme: themeType } = useSettingsContext()
  const recipient =
    message.type === 'send' ? recipients.find((r) => r.address === message.address) : undefined

  const totalRewardTokens = React.useMemo(() => {
    if (message.type !== 'claim farm rewards') {
      return []
    }
    const tokens: { [denom: string]: number } = {}
    message.farms.forEach((farm) =>
      farm.rewards.forEach((r) => {
        if (tokens[r.denom]) {
          tokens[r.denom] += r.amount
        } else {
          tokens[r.denom] = r.amount
        }
      })
    )
    return Object.keys(tokens).map((denom) => ({ denom, amount: tokens[denom] }))
  }, [message])

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
              <AssetItem disabled asset={message.asset} hideAmount hideBorder />
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
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <AssetItem disabled asset={message.from} hideBorder hideApr />
              <Icon
                name="arrow-down"
                size={theme.baseSpace * 8}
                color={theme.fonts.H6.color}
                style={styles.arrow}
              />
              <AssetItem asset={message.to} hideBorder hideApr />
            </>
          ) : null}
          {message.type === 'claim' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <RewardsItem disabled hideValue hideBorder {...message} />
            </>
          ) : null}
          {message.type === 'provide collateral' || message.type === 'withdraw collateral' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <AvailableAssetItem
                disabled
                availableAsset={message.availableAsset}
                amount={message.amount}
              />
            </>
          ) : null}
          {message.type === 'borrow' || message.type === 'repay' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <AssetItem disabled asset={message.asset} hideBorder />
            </>
          ) : null}
          {message.type === 'delegate' || message.type === 'undelegate' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <StakingItem
                validator={message.validator}
                amount={message.amount * 10 ** 6}
                symbol={message.symbol}
                price={message.price}
                hideBorder
              />
            </>
          ) : null}
          {message.type === 'redelegate' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <StakingItem
                validator={message.fromValidator}
                amount={message.amount * 10 ** 6}
                symbol={message.symbol}
                price={message.price}
                hideBorder
              />
              <Icon
                name="arrow-down"
                size={theme.baseSpace * 8}
                color={theme.fonts.H6.color}
                style={styles.arrow}
              />
              <StakingItem
                validator={message.toValidator}
                amount={message.amount * 10 ** 6}
                symbol={message.symbol}
                price={message.price}
                hideBorder
              />
            </>
          ) : null}
          {message.type === 'provide liquidity' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <AssetItem disabled asset={message.asset} hideBorder hideApr />
              <Icon
                name="plus"
                size={theme.baseSpace * 8}
                color={theme.fonts.H6.color}
                style={styles.arrow}
              />
              <AssetItem asset={message.pairAsset} hideBorder hideApr />
            </>
          ) : null}
          {message.type === 'withdraw liquidity' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              <FarmItem
                asset={message.availableAsset}
                pairAsset={message.pairAsset}
                farmType={message.farm.type}
                balance={message.amount * 10 ** 6}
                rate={message.farm.rate}
                dex={message.farm.dex}
                hideBorder
              />
            </>
          ) : null}
          {message.type === 'claim farm rewards' ? (
            <>
              <Typography type="H6" style={styles.title2}>
                {t(message.type)}
              </Typography>
              {totalRewardTokens.map((reward, i) => (
                <AssetItem
                  key={reward.denom}
                  disabled
                  hideBorder={i === totalRewardTokens.length - 1}
                  asset={
                    getTokenAssetDetail(
                      { denom: reward.denom, amount: String(reward.amount) },
                      availableAssets
                    )!
                  }
                />
              ))}
            </>
          ) : null}
          {message.type === 'wallet connect' ? (
            <ScrollView
              style={{ height: theme.baseSpace * 60, paddingRight: theme.baseSpace * 20 }}
            >
              <JSONTree
                data={message.msgs.map((m) => JSON.parse(m))}
                hideRoot
                shouldExpandNode={() => true}
                theme={jsonTree}
                invertTheme={themeType === 'light'}
              />
            </ScrollView>
          ) : null}
        </View>
        <Typography style={styles.title} type="H6">
          {error || t('transaction sent')}
        </Typography>
        {txHash ? (
          <TouchableOpacity
            onPress={() => {
              WebBrowser.openBrowserAsync(`${terraScopeUrl}/tx/${txHash}`)
            }}
          >
            <Typography
              style={{ textAlign: 'center', marginTop: theme.baseSpace * 8 }}
              color={theme.palette.lightPrimary}
            >
              {txHash}
            </Typography>
          </TouchableOpacity>
        ) : null}
      </View>
      <Button onPress={onClose} size="Large">
        {t('close')}
      </Button>
    </View>
  )
}

export default Success
