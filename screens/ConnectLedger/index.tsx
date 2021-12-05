import React from 'react'
import { Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Input from '../../components/Input'
import { useLocalesContext } from '../../contexts/LocalesContext'
import TerraApp from '@terra-money/ledger-terra-js'
import Button from '../../components/Button'
import connectLedger from '../../utils/connectLedger'

interface ConnectLedgerProps {
  onSubmit(app: TerraApp): void
}

const ConnectLedger: React.FC<ConnectLedgerProps> = ({ onSubmit }) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const connect = React.useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const terraApp = await connectLedger()
      await onSubmit(terraApp)
      setLoading(false)
    } catch (err: any) {
      console.log({ err })
      setLoading(false)
      setError(t('ledger error'))
    }
  }, [onSubmit, t])

  return (
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
        onPress={connect}
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
  )
}

export default ConnectLedger
