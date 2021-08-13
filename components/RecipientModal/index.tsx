import React from 'react'
import { Modalize } from 'react-native-modalize'
import { TouchableOpacity, View, Image, Alert } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import Constants from 'expo-constants'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import CloseIcon from '../../assets/images/icons/close.svg'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import useTranslation from '../../locales/useTranslation'
import { Recipient } from '../../types/recipients'
import Input from '../Input'
import { Actions } from 'react-native-router-flux'
import isAddressValid from '../../utils/isAddressValid'

interface RecipientModalProps {
  open: boolean
  onClose(): void
  recipient?: Recipient
  onSave(recipient: Recipient): void
  onDelete?(recipient: Recipient): void
}

const RecipientModal: React.FC<RecipientModalProps> = ({
  open,
  onClose,
  recipient: defaultRecipient = { image: '', name: '', address: '' },
  onSave,
  onDelete,
}) => {
  const modalizeRef = React.useRef<Modalize>(null)
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()

  const [recipient, setRecipient] = React.useState(defaultRecipient)

  React.useEffect(() => {
    if (open) {
      modalizeRef.current?.open()
      setRecipient(defaultRecipient)
    } else {
      modalizeRef.current?.close()
    }
  }, [open])

  const setImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status === 'granted') {
      const original = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      })
      if (original.cancelled) {
        return
      }
      const result = await ImageManipulator.manipulateAsync(
        original.uri,
        [
          {
            resize: {
              width: 24 * theme.baseSpace,
              height: 24 * theme.baseSpace,
            },
          },
        ],
        { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
      )
      setRecipient((r) => ({ ...r, image: `data:image/png;base64,${result.base64}` }))
    }
  }

  const isNewRecipient = !!defaultRecipient.name

  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={styles.modal}
      withHandle={false}
      scrollViewProps={{ scrollEnabled: false }}
      modalHeight={theme.baseSpace * 100 + theme.bottomSpace}
      onClosed={onClose}
    >
      <View style={styles.confirmHeader}>
        <Typography type="H6">
          {isNewRecipient ? t('edit recipient') : t('add recipient')}
        </Typography>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon fill={theme.palette.grey[9]} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={setImage}>
          <Image
            source={{ uri: recipient.image || Constants.manifest?.extra?.defaultAvatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.splitRow}>
        <Typography type="Large" bold>
          {t('name')}
        </Typography>
      </View>
      <Input
        style={styles.input}
        placeholder={t('name placeholder')}
        size="Large"
        value={recipient.name}
        onChangeText={(name: string) => setRecipient((r) => ({ ...r, name }))}
      />
      <View style={styles.splitRow}>
        <Typography type="Large" bold>
          {t('recipient address')}
        </Typography>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() =>
              Actions.ScanQRCode({
                onScan: (address: string) => setRecipient((r) => ({ ...r, address })),
              })
            }
          >
            <QRCodeIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
          </TouchableOpacity>
        </View>
      </View>
      <Input
        style={styles.input}
        placeholder={t('recipient address placeholder')}
        size="Large"
        autoCorrect={false}
        autoCapitalize="none"
        value={recipient.address}
        onChangeText={(address: string) => setRecipient((r) => ({ ...r, address }))}
        endAdornment={
          <TouchableOpacity
            onPress={async () => {
              const address = await Clipboard.getStringAsync()
              setRecipient((r) => ({ ...r, address }))
            }}
          >
            <Typography bold color={theme.palette.secondary}>
              {t('paste')}
            </Typography>
          </TouchableOpacity>
        }
      />
      <View style={styles.buttonsRow}>
        {isNewRecipient ? (
          <Button
            style={styles.button}
            size="Large"
            disabled={!recipient.name || !recipient.address}
            onPress={() =>
              Alert.alert(t('remove'), t('confirm remove recipient'), [
                {
                  text: t('cancel'),
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: t('confirm'),
                  onPress: () => onDelete && defaultRecipient && onDelete(defaultRecipient),
                },
              ])
            }
            bgColor={theme.palette.red}
          >
            {t('remove')}
          </Button>
        ) : null}
        <Button
          style={styles.button}
          size="Large"
          disabled={!recipient.name || !isAddressValid(recipient.address)}
          onPress={() => onSave(recipient)}
        >
          {t('save')}
        </Button>
      </View>
    </Modalize>
  )
}

export default RecipientModal
