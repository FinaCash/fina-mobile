import React from 'react'
import {
  TouchableOpacity,
  TextInput as Input,
  TextInputProps as InputProps,
  View,
  ViewStyle,
} from 'react-native'
import { FontAwesome5 as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface TextInputProps extends InputProps {
  containerStyle?: ViewStyle
  inputRef?: any
  onClear?(): void
}

const TextInput: React.FC<TextInputProps> = ({
  clearButtonMode,
  placeholderTextColor,
  containerStyle,
  inputRef,
  onChangeText,
  onClear,
  ...props
}) => {
  const innerRef = React.useRef<any>()
  const { styles, theme } = useStyles(getStyles)
  const clear = React.useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.clear()
    } else if (innerRef && innerRef.current) {
      innerRef.current.clear()
    }
    if (onChangeText) {
      onChangeText('')
    }
    if (onClear) {
      onClear()
    }
  }, [innerRef, inputRef, onClear, onChangeText])
  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        {...props}
        placeholderTextColor={theme.palette.grey[2]}
        ref={inputRef || innerRef}
        onChangeText={onChangeText}
      />
      {clearButtonMode ? (
        <TouchableOpacity onPress={clear} style={styles.clearButton}>
          <Icon name="times" color={theme.palette.white} size={theme.baseSpace * 3} />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default React.forwardRef<any, TextInputProps>((props, ref) => (
  <TextInput {...props} inputRef={ref} />
))
