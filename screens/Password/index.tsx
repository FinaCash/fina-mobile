import React from 'react'
import { ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Input from '../../components/Input'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface PasswordProps {
  isSetting: boolean
  onSubmit(password: string): void
  confirmationRequired?: boolean
}

const Password: React.FC<PasswordProps> = ({ isSetting, onSubmit, confirmationRequired }) => {
  const inputRef = React.useRef(null)
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [confirmCode, setConfirmCode] = React.useState('')
  const [error, setError] = React.useState('')

  const submit = React.useCallback(async () => {
    try {
      setError('')
      if (confirmationRequired && !isConfirming) {
        setIsConfirming(true)
        setTimeout(() => (inputRef.current as any).focus(), 100)
        return
      }
      if (confirmationRequired && isConfirming && code !== confirmCode) {
        throw new Error('incorrect confirm code')
      }
      setLoading(true)
      await onSubmit(code)
    } catch (err) {
      setLoading(false)
      setError(t(err.message))
      if (isConfirming) {
        setConfirmCode('')
      } else {
        setCode('')
      }
      setTimeout(() => (inputRef.current as any).focus(), 100)
    }
  }, [onSubmit, code, confirmCode, isConfirming, setIsConfirming, confirmationRequired, t])

  let title = ''
  if (isConfirming) {
    title = t('please confirm password')
  } else if (isSetting) {
    title = t('please enter password')
  } else {
    title = t('please enter your password')
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => Actions.pop()}>
        <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.white} />
      </TouchableOpacity>
      <Typography color={theme.palette.white} style={styles.title} type="H6">
        {title}
      </Typography>
      <Input
        inputRef={inputRef}
        size="XLarge"
        secureTextEntry
        value={isConfirming ? confirmCode : code}
        onChangeText={isConfirming ? setConfirmCode : setCode}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
        error={error}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: theme.baseSpace * 12 }} size="large" />
      ) : null}
    </KeyboardAvoidingView>
  )
}

export default Password
