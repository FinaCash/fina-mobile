import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import { Recipient } from '../../types/recipients'
import {
  TouchableOpacity,
  View,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import Constants from 'expo-constants'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import useTranslation from '../../locales/useTranslation'
import Input from '../../components/Input'
import { Actions } from 'react-native-router-flux'
import isAddressValid from '../../utils/isAddressValid'

interface UpdateRecipientProps {
  recipient?: Recipient
  onSave(recipient: Recipient): void
  onDelete?(recipient: Recipient): void
}

const UpdateRecipient: React.FC<UpdateRecipientProps> = ({
  recipient: defaultRecipient = { image: '', name: '', address: '' },
  onSave,
  onDelete,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()

  const [recipient, setRecipient] = React.useState(defaultRecipient)

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
    <>
      <HeaderBar back title={isNewRecipient ? t('edit recipient') : t('add recipient')} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
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
          <View style={styles.splitRow}>
            <Typography type="Large" bold>
              {t('default memo')}
            </Typography>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() =>
                  Actions.ScanQRCode({
                    onScan: (memo: string) => setRecipient((r) => ({ ...r, memo })),
                  })
                }
              >
                <QRCodeIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
              </TouchableOpacity>
            </View>
          </View>
          <Input
            style={styles.input}
            placeholder={t('memo placeholder')}
            size="Large"
            autoCorrect={false}
            autoCapitalize="none"
            value={recipient.memo}
            onChangeText={(memo: string) => setRecipient((r) => ({ ...r, memo }))}
            endAdornment={
              <TouchableOpacity
                onPress={async () => {
                  const memo = await Clipboard.getStringAsync()
                  setRecipient((r) => ({ ...r, memo }))
                }}
              >
                <Typography bold color={theme.palette.secondary}>
                  {t('paste')}
                </Typography>
              </TouchableOpacity>
            }
          />
        </ScrollView>
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
      </KeyboardAvoidingView>
    </>
  )
}

export default UpdateRecipient
