import React from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { AssetTypes, MirrorAsset } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import AssetItem from '../../components/AssetItem'
import { Currencies } from '../../types/misc'
import Button from '../../components/Button'
import MirrorAssetItem from '../../components/MirrorAssetItem'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { mirrorOptions } from '../../utils/terraConfig'
import { getCurrentAssetDetail } from '../../utils/transformAssets'

const mirror = new Mirror(mirrorOptions)

interface MirrorSwapProps {
  asset: MirrorAsset
  mode: 'buy' | 'sell'
}

const MirrorSwap: React.FC<MirrorSwapProps> = ({ asset: defaultAsset, mode }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  const { swapMAsset } = useAssetsContext()

  const [asset, setAsset] = React.useState(defaultAsset)

  const [fromAmount, setFromAmount] = React.useState('')
  const [toAmount, setToAmount] = React.useState('')

  const currentAsset = {
    type: AssetTypes.Currents,
    coin: {
      denom: Currencies.USD,
      amount: (Number(mode === 'buy' ? fromAmount : toAmount) * 10 ** 6).toString(),
    },
  }

  const changeAmount = React.useCallback(
    async (a: string, which: 'from' | 'to') => {
      try {
        ;(which === 'from' ? setFromAmount : setToAmount)(a)
        const simulation = {
          amount: (Number(a) * 10 ** 6).toString(),
          info: {},
        }
        if ((which === 'from' && mode === 'buy') || (which === 'to' && mode === 'sell')) {
          simulation.info = UST
        } else {
          simulation.info = {
            token: { contract_addr: mirror.assets[asset.symbol].token.contractAddress },
          }
        }

        const result = await mirror.assets[asset.symbol].pair[
          which === 'from' ? 'getSimulation' : 'getReverseSimulation'
        ](simulation as any)
        ;(which === 'from' ? setToAmount : setFromAmount)(
          (
            Number((result as any).offer_amount || (result as any).return_amount) /
            10 ** 6
          ).toString()
        )
      } catch (err) {
        ;(which === 'from' ? setToAmount : setFromAmount)('')
      }
    },
    [asset, mode]
  )

  // const selectAsset = React.useCallback(
  //   () => {
  //     const values = Object.values(Currencies)
  //     const options = [...values.map((c) => t(`${c} name`)), t('cancel')]
  //     showActionSheetWithOptions(
  //       {
  //         options,
  //         cancelButtonIndex: options.length - 1,
  //       },
  //       (index) => {
  //         if (index === options.length - 1) {
  //           return
  //         }
  //         ;(which === 'from' ? setFrom : setTo)(values[index])
  //         changeAmount(
  //           which === 'to' ? fromAmount : toAmount,
  //           which === 'from' ? 'to' : 'from',
  //         )
  //       }
  //     )
  //   },
  //   [t, fromAmount, toAmount, changeAmount]
  // )

  const onSubmit = React.useCallback(
    async (password: string) => {
      if (fromAmount) {
        await swapMAsset(asset.symbol, Number(fromAmount), mode, password)
      }
      Actions.pop()
    },
    [asset, fromAmount, mode]
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography type="H3">{t('exchange')}</Typography>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
        </TouchableOpacity>
      </View>
      {mode === 'buy' ? (
        <AssetItem style={styles.from} asset={getCurrentAssetDetail(currentAsset.coin)} dropdown />
      ) : (
        <MirrorAssetItem mAsset={asset} />
      )}
      <View style={styles.centered}>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={theme.palette.grey[3]}
          onChangeText={(a) => changeAmount(a, 'from')}
          value={fromAmount}
        />
        <Icon name="arrow-down" size={theme.fonts.H1.fontSize} color={theme.palette.grey[10]} />
      </View>
      {mode === 'sell' ? (
        <AssetItem style={styles.from} asset={getCurrentAssetDetail(currentAsset.coin)} dropdown />
      ) : (
        <MirrorAssetItem mAsset={asset} />
      )}
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor={theme.palette.grey[3]}
        onChangeText={(a) => changeAmount(a, 'to')}
        value={toAmount}
      />
      <Button
        style={styles.button}
        size="Large"
        onPress={() => Actions.Password({ onSubmit, title: t('please enter your password') })}
      >
        Confirm
      </Button>
    </ScrollView>
  )
}

export default MirrorSwap
