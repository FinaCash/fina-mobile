import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import PinCodeInput from 'react-native-smooth-pincode-input'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import useTranslation from '../../locales/useTranslation'
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
  const { t } = useTranslation()
  const [code, setCode] = React.useState('')
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
        value={code}
        onTextChange={setCode}
        onFulfill={() => console.log('done')}
        codeLength={6}
        autoFocus
      />
    </View>
  )
}

export default Passcode
