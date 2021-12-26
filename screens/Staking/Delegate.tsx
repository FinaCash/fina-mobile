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
import ConfirmDelegateModal from '../../components/ConfirmModals/ConfirmDelegateModal'

interface DelegateProps {}

const Delegate: React.FC<DelegateProps> = () => {
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const { assets, validators, stake } = useAssetsContext()
  const { styles, theme } = useStyles(getStyles)
  const [confirmDelegationModalOpen, setConfirmDelegationModalOpen] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [validator, setValidator] = React.useState(
    validators.find((v) => v.address === defaultValidatorAddress)
  )

  const asset = assets.find((a) => a.coin.denom === 'uluna')!

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'delegate',
        amount: Number(amount),
        validator,
        symbol: asset.symbol,
        price: asset.price,
      }
      try {
        await stake(
          { denom: 'uluna', amount: Number(amount) },
          validator!.address,
          password,
          terraApp
        )
        Actions.Success({
          message,
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
    [stake, amount, validator, asset]
  )

  React.useEffect(() => {
    if (confirmDelegationModalOpen) {
      Keyboard.dismiss()
    }
  }, [confirmDelegationModalOpen])

  return (
    <>
      <HeaderBar back title={t('delegate')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView>
          <AssetAmountInput
            asset={asset}
            amount={amount}
            setAmount={setAmount}
            assetItemProps={{ disabled: true }}
            inputProps={{ autoFocus: true }}
            bottomElement={
              <View style={styles.validatorContainer}>
                <Typography type="Large" bold>
                  {t('validator')}
                </Typography>
                <Button
                  style={styles.validatorButton}
                  bgColor={theme.palette.grey[1]}
                  onPress={() =>
                    Actions.SelectValidator({
                      onSelect: (v: Validator) => {
                        setValidator(v)
                        Actions.pop()
                      },
                    })
                  }
                >
                  <View style={styles.row}>
                    {validator && validator.image ? (
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
                      <Typography type="H6">
                        {validator ? validator.name : t('validator')}
                      </Typography>
                      {validator ? (
                        <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                          {t('validator commission and vp', {
                            commission: formatPercentage(validator.commission),
                            votingPower: formatPercentage(validator.votingPower),
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
          disabled={
            !Number(amount) || Number(amount) * 10 ** 6 > Number(asset.coin.amount) || !validator
          }
          style={styles.button}
          size="Large"
          onPress={() => setConfirmDelegationModalOpen(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      {validator ? (
        <ConfirmDelegateModal
          open={confirmDelegationModalOpen}
          onClose={() => setConfirmDelegationModalOpen(false)}
          amount={Number(amount)}
          validator={validator}
          onConfirm={() => getPasswordOrLedgerApp(onSubmit, type)}
        />
      ) : null}
    </>
  )
}

export default Delegate
