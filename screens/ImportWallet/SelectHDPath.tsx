import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import { ScrollView, View } from 'react-native'
import { MnemonicKey } from '@terra-money/terra.js'
import { defaultHdPath, defaultPrefix } from '../../utils/terraConfig'
import TerraApp from '@terra-money/ledger-terra-js'

interface SelectHDPathProps {
  onSubmit(hdPath: number[]): void
  seed?: string
  terraApp?: TerraApp
}

const SelectHDPath: React.FC<SelectHDPathProps> = ({ onSubmit, seed, terraApp }) => {
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  // HD Path
  const [account, setAccount] = React.useState(String(defaultHdPath[2]))
  const [index, setIndex] = React.useState(String(defaultHdPath[4]))

  const [address, setAddress] = React.useState('')

  const [loading, setLoading] = React.useState(false)

  const hdPath = React.useMemo(
    () => [defaultHdPath[0], defaultHdPath[1], Number(account), defaultHdPath[3], Number(index)],
    [account, index]
  )

  React.useEffect(() => {
    try {
      if (!account || !index) {
        throw new Error()
      }
      if (seed) {
        const key = new MnemonicKey({
          mnemonic: seed,
          coinType: hdPath[1],
          account: hdPath[2],
          index: hdPath[4],
        })
        setAddress(key.accAddress)
      } else if (terraApp) {
        terraApp
          .getAddressAndPubKey(hdPath, defaultPrefix)
          .then((result) => setAddress(result.bech32_address))
      }
    } catch (err) {
      setAddress('')
    }
  }, [account, index, seed, terraApp, hdPath])

  return (
    <>
      <HeaderBar back title={t('hd path')} />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <View style={styles.hdContainer}>
          <Typography style={styles.label} bold>
            {t('select hd path')}
          </Typography>
          <View style={styles.row}>
            <Typography type="Large">m/44/330/</Typography>
            <Input
              style={styles.numberInput}
              textStyle={{ textAlign: 'center' }}
              keyboardType="numeric"
              value={account}
              onChangeText={setAccount}
            />
            <Typography type="Large">/0/</Typography>
            <Input
              style={styles.numberInput}
              textStyle={{ textAlign: 'center' }}
              keyboardType="numeric"
              value={index}
              onChangeText={setIndex}
            />
          </View>
        </View>
        <Typography style={styles.label} bold>
          {t('address')}
        </Typography>
        <Typography>{address}</Typography>
        <View style={styles.marginTop} />
        <View style={styles.marginTop} />
        <Button
          disabled={!address}
          loading={loading}
          style={[styles.marginTop, styles.label]}
          onPress={async () => {
            setLoading(true)
            await onSubmit(hdPath)
            setLoading(false)
          }}
          size="Large"
        >
          {t('confirm')}
        </Button>
        {terraApp && loading ? <Typography>{t('check ledger')}</Typography> : null}
      </ScrollView>
    </>
  )
}

export default SelectHDPath
