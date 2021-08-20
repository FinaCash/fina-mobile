import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { KeyboardAvoidingView } from 'react-native'
import Button from '../../components/Button'
import AssetAmountInput from '../../components/AssetAmountInput'

interface SelectAmountProps {
  asset: Asset
  onSubmit(amount: number): void
}

const SelectAmount: React.FC<SelectAmountProps> = ({ asset, onSubmit }) => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const [amount, setAmount] = React.useState('')

  return (
    <>
      <HeaderBar back title={t('amount')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AssetAmountInput
          asset={asset}
          amount={amount}
          setAmount={setAmount}
          assetItemProps={{ disabled: true }}
          inputProps={{ autoFocus: true }}
        />
        <Button
          disabled={!Number(amount) || Number(amount) * 10 ** 6 > Number(asset.coin.amount)}
          style={styles.button}
          size="Large"
          onPress={() => onSubmit(Number(amount))}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
    </>
  )
}

export default SelectAmount
