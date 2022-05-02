import React from 'react'
import { FontAwesome as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { KeyboardAvoidingView, View, Image, ScrollView, Keyboard } from 'react-native'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import AssetAmountInput from '../../components/AssetAmountInput'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { defaultValidatorAddress } from '../../utils/terraConfig'
import { Actions } from 'react-native-router-flux'
import { Validator } from '../../types/assets'
import { formatPercentage } from '../../utils/formatNumbers'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'
import ConfirmRedelegateModal from '../../components/ConfirmModals/ConfirmRedelegateModal'

interface RedelegateProps {
  validator: Validator
  amount: number
}

const Redelegate: React.FC<RedelegateProps> = ({ validator, amount: totalAmount }) => {
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const { availableAssets, validators, redelegate } = useAssetsContext()
  const { styles, theme } = useStyles(getStyles)
  const [confirmRedelegationModalOpen, setConfirmRedelegationModalOpen] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [toValidator, setToValidator] = React.useState(
    validators.find((v) => v.address === defaultValidatorAddress)
  )

  const availableAsset = availableAssets.find((a) => a.coin.denom === 'uluna')!

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'redelegate',
        amount: Number(amount),
        fromValidator: validator,
        toValidator,
        symbol: availableAsset.symbol,
        price: availableAsset.price,
      }
      try {
        const tx = await redelegate(
          { denom: 'uluna', amount: Number(amount) },
          validator!.address,
          toValidator!.address,
          password,
          terraApp
        )
        Actions.Success({
          message,
          txHash: tx.txhash,
          onClose: () => Actions.jump('Earn'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.jump('Earn'),
        })
      }
    },
    [redelegate, amount, validator, toValidator, availableAsset]
  )

  React.useEffect(() => {
    if (confirmRedelegationModalOpen) {
      Keyboard.dismiss()
    }
  }, [confirmRedelegationModalOpen])

  return (
    <>
      <HeaderBar back title={t('redelegate')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView>
          <AssetAmountInput
            validator={validator}
            stakedAmount={totalAmount / 10 ** 6}
            availableAsset={availableAsset}
            amount={amount}
            setAmount={setAmount}
            assetItemProps={{ disabled: true }}
            inputProps={{ autoFocus: true }}
            bottomElement={
              <View style={styles.validatorContainer}>
                <Typography type="Large" bold>
                  {t('to')}
                </Typography>
                <Button
                  style={styles.validatorButton}
                  bgColor={theme.palette.grey[1]}
                  onPress={() =>
                    Actions.SelectValidator({
                      onSelect: (v: Validator) => {
                        setToValidator(v)
                        Actions.pop()
                      },
                    })
                  }
                >
                  <View style={styles.row}>
                    {toValidator && toValidator.image ? (
                      <Image source={{ uri: toValidator.image }} style={styles.avatar} />
                    ) : (
                      <Icon
                        name="user-circle"
                        style={styles.avatar}
                        size={styles.avatar.width}
                        color={theme.palette.grey[5]}
                      />
                    )}
                    <View>
                      <Typography type="H6" color={theme.fonts.H1.color}>
                        {toValidator ? toValidator.name : t('validator')}
                      </Typography>
                      {toValidator ? (
                        <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                          {t('validator commission and vp', {
                            commission: formatPercentage(toValidator.commission),
                            votingPower: formatPercentage(toValidator.votingPower),
                          })}
                        </Typography>
                      ) : null}
                    </View>
                  </View>
                  <Icon
                    name="chevron-right"
                    color={theme.palette.grey[5]}
                    size={theme.baseSpace * 4}
                  />
                </Button>
              </View>
            }
          />
        </ScrollView>
        <Button
          disabled={!Number(amount) || Number(amount) * 10 ** 6 > totalAmount || !toValidator}
          style={styles.button}
          size="Large"
          onPress={() => setConfirmRedelegationModalOpen(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      {toValidator ? (
        <ConfirmRedelegateModal
          open={confirmRedelegationModalOpen}
          onClose={() => setConfirmRedelegationModalOpen(false)}
          amount={Number(amount)}
          fromValidator={validator}
          toValidator={toValidator}
          onConfirm={() => {
            setConfirmRedelegationModalOpen(false)
            getPasswordOrLedgerApp(onSubmit, type)
          }}
        />
      ) : null}
    </>
  )
}

export default Redelegate
