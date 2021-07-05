import React from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import PinCodeInput from 'react-native-smooth-pincode-input'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface PasscodeProps {
  title: string
  onSubmit(passcode: string): void
  confirmationRequired?: boolean
}

const Passcode: React.FC<PasscodeProps> = ({ title, onSubmit, confirmationRequired }) => {
  const inputRef = React.useRef(null)
  const { styles, theme } = useStyles(getStyles)
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [confirmCode, setConfirmCode] = React.useState('')

  const submit = React.useCallback(
    async (input: string) => {
      setLoading(true)
      try {
        if (confirmationRequired && !isConfirming) {
          setIsConfirming(true)
          return
        }
        if (confirmationRequired && isConfirming && code !== input) {
          throw new Error('incorrect confirm code')
        }
        await onSubmit(input)
      } catch (err) {
        console.log(err)
        ;(inputRef.current as any).shake()
        setLoading(false)
        if (isConfirming) {
          setConfirmCode('')
        } else {
          setCode('')
        }
      }
    },
    [onSubmit, code, inputRef, isConfirming, setIsConfirming, confirmationRequired]
  )
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => Actions.pop()}>
        <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
      </TouchableOpacity>
      <Typography style={styles.title} type="H2">
        {title}
      </Typography>
      <PinCodeInput
        ref={inputRef}
        placeholder={<View style={styles.placeholderDot} />}
        mask={<View style={styles.maskDot} />}
        maskDelay={1000}
        password={true}
        cellStyle={null}
        cellStyleFocused={null}
        value={isConfirming ? confirmCode : code}
        onTextChange={isConfirming ? setConfirmCode : setCode}
        onFulfill={submit}
        codeLength={6}
        autoFocus
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: theme.baseSpace * 12 }} size="large" />
      ) : null}
    </View>
  )
}

export default Passcode
