/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import TerraApp from '@terra-money/ledger-terra-js'
import Button from '../../components/Button'
import BottomModal from '../../components/BottomModal'
import scanLedgerDevices from '../../utils/scanLedgerDevices'
import { defaultHdPath, defaultPrefix } from '../../utils/terraConfig'

let unsubscribe = () => {}
let terraApp: TerraApp
let deviceId = ''

interface ConnectLedgerProps {
  onSubmit(app: TerraApp): void
}

const ConnectLedger: React.FC<ConnectLedgerProps> = ({ onSubmit }) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)

  const [isScanning, setIsScanning] = React.useState(false)
  const [devices, setDevices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const scan = React.useCallback(async () => {
    setError('')
    if (terraApp) {
      setLoading(true)
      const result = await terraApp.getAddressAndPubKey(defaultHdPath, defaultPrefix)
      if (result.bech32_address) {
        await onSubmit(terraApp)
        setLoading(false)
        return
      } else if (deviceId) {
        const transport = await TransportBLE.open(deviceId)
        terraApp = new TerraApp(transport)
        const result2 = await terraApp.getAddressAndPubKey(defaultHdPath, defaultPrefix)
        if (result2.bech32_address) {
          await onSubmit(terraApp)
          setLoading(false)
          return
        }
      }
    }
    setLoading(false)
    setIsScanning(true)
    unsubscribe = await scanLedgerDevices((d) => setDevices((ds: any) => [...ds, d]))
  }, [onSubmit])

  const connect = React.useCallback(
    async (device: any) => {
      try {
        setError('')
        setIsScanning(false)
        setLoading(true)
        deviceId = device.id
        const transport = await TransportBLE.open(deviceId)
        terraApp = new TerraApp(transport)
        const result = await terraApp.getAddressAndPubKey(defaultHdPath, defaultPrefix)
        if (result.bech32_address) {
          await onSubmit(terraApp)
          setLoading(false)
        } else {
          throw new Error('ledger error')
        }
      } catch (err: any) {
        console.log({ err })
        setLoading(false)
        setError(t('ledger error'))
      }
    },
    [onSubmit, t]
  )

  React.useEffect(() => {
    if (!isScanning) {
      unsubscribe()
      setDevices([])
    }
  }, [isScanning])

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => Actions.pop()}>
          <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.white} />
        </TouchableOpacity>
        <Image style={styles.image} source={require('../../assets/images/bluetooth.png')} />
        <Typography color={theme.palette.white} style={styles.title} type="H6">
          {t('connect ledger')}
        </Typography>
        <Typography style={styles.instruction} color={theme.palette.white}>
          {t('connect ledger instruction 1')}
        </Typography>
        <Typography style={styles.instruction} color={theme.palette.white}>
          {t('connect ledger instruction 2')}
        </Typography>
        <Typography style={styles.instruction} color={theme.palette.white}>
          {t('connect ledger instruction 3')}
        </Typography>
        <Button
          style={styles.button}
          size="Large"
          bgColor={theme.palette.white}
          color={theme.palette.primary}
          onPress={scan}
          loading={loading}
        >
          {t(error ? 'try again' : 'connect')}
        </Button>
        {error ? (
          <Typography style={styles.error} color={theme.palette.red}>
            {t(error)}
          </Typography>
        ) : null}
        {loading ? (
          <Typography style={styles.error} color={theme.palette.white}>
            {t('check ledger')}
          </Typography>
        ) : null}
      </KeyboardAvoidingView>
      <BottomModal
        title={t('select ledger device')}
        open={isScanning}
        onClose={() => setIsScanning(false)}
        modalHeight={theme.baseSpace * 80 + theme.bottomSpace}
        flatListProps={{
          data: devices,
          keyExtractor: (d) => d.id,
          renderItem: ({ item, index }) => (
            <Button
              bgColor={theme.palette.background}
              size="Large"
              color={theme.fonts.H1.color}
              onPress={() => connect(item)}
              style={{
                borderBottomWidth: 1,
                borderTopWidth: index === 0 ? 1 : 0,
                borderBottomColor: theme.palette.border,
                borderTopColor: theme.palette.border,
              }}
            >
              {item.name}
            </Button>
          ),
        }}
      />
    </>
  )
}

export default ConnectLedger
