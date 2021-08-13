import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import Toast from 'react-native-root-toast'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import RecipientModal from '../../components/RecipientModal'
import { Recipient } from '../../types/recipients'

const Recipients: React.FC = () => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)

  const { recipients, addRecipient, deleteRecipient, updateRecipient } = useRecipientsContext()

  const [isRecipientModalOpen, setIsRecipientModalOpen] = React.useState(false)
  const [edittingRecipient, setEdittingRecipient] = React.useState<Recipient | undefined>()

  return (
    <>
      <HeaderBar
        title={t('recipients')}
        rightButton={{
          icon: <Icon name="user-plus" color={theme.palette.white} size={theme.baseSpace * 5} />,
          onPress: () => setIsRecipientModalOpen(true),
        }}
      />
      <FlatList
        style={styles.list}
        keyExtractor={(item) => item.address}
        data={recipients}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setEdittingRecipient(item)
              setIsRecipientModalOpen(true)
            }}
          >
            <Image
              source={{ uri: item.image || Constants.manifest?.extra?.defaultAvatarUrl }}
              style={styles.avatar}
            />
            <View>
              <Typography type="H6">{item.name}</Typography>
              <Typography>{item.address}</Typography>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Button style={styles.button} size="Large" onPress={() => setIsRecipientModalOpen(true)}>
            {t('add recipient')}
          </Button>
        }
      />
      <RecipientModal
        open={isRecipientModalOpen}
        onClose={() => {
          setIsRecipientModalOpen(false)
          setEdittingRecipient(undefined)
        }}
        recipient={edittingRecipient}
        onSave={(recipient) => {
          if (edittingRecipient) {
            updateRecipient(recipient)
          } else {
            addRecipient(recipient)
          }
          setIsRecipientModalOpen(false)
          setEdittingRecipient(undefined)
          Toast.show(t(edittingRecipient ? 'recipient updated' : 'recipient added'))
        }}
        onDelete={(recipient) => {
          deleteRecipient(recipient.address)
          setIsRecipientModalOpen(false)
          setEdittingRecipient(undefined)
          Toast.show(t('recipient deleted'))
        }}
      />
    </>
  )
}

export default Recipients
