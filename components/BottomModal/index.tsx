import React from 'react'
import { Modalize, ModalizeProps } from 'react-native-modalize'
import { TouchableOpacity, View } from 'react-native'
import CloseIcon from '../../assets/images/icons/close.svg'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'

interface BottomModalProps extends ModalizeProps {
  title: string
  open: boolean
  onClose(): void
}

const BottomModal: React.FC<BottomModalProps> = ({
  title,
  children,
  open,
  onClose,
  flatListProps,
  sectionListProps,
  ...props
}) => {
  const modalizeRef = React.useRef<Modalize>(null)
  const { styles, theme } = useStyles(getStyles)

  React.useEffect(() => {
    if (open) {
      modalizeRef.current?.open()
    } else {
      modalizeRef.current?.close()
    }
  }, [open])

  const header = (
    <View style={styles.confirmHeader}>
      <Typography type="H6">{title}</Typography>
      <TouchableOpacity onPress={onClose}>
        <CloseIcon fill={theme.fonts.H6.color} />
      </TouchableOpacity>
    </View>
  )

  return flatListProps || sectionListProps ? (
    <Modalize
      ref={modalizeRef}
      modalStyle={styles.modal}
      withHandle={false}
      onClosed={onClose}
      useNativeDriver
      flatListProps={flatListProps ? { ListHeaderComponent: header, ...flatListProps } : undefined}
      sectionListProps={
        sectionListProps ? { ListHeaderComponent: header, ...sectionListProps } : undefined
      }
      {...props}
    />
  ) : (
    <Modalize
      ref={modalizeRef}
      modalStyle={styles.modal}
      withHandle={false}
      scrollViewProps={{ scrollEnabled: false }}
      onClosed={onClose}
      useNativeDriver
      {...props}
    >
      {header}
      {children}
    </Modalize>
  )
}

export default BottomModal
