import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import Toast from 'react-native-root-toast'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Recipient } from '../../types/recipients'
import { Actions } from 'react-native-router-flux'

const Recipients: React.FC = () => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)

  const { recipients, addRecipient, deleteRecipient, updateRecipient } = useRecipientsContext()

  return (
    <>
      <HeaderBar
        title={t('recipients')}
        rightButton={{
          icon: <Icon name="user-plus" color={theme.palette.white} size={theme.baseSpace * 5} />,
          onPress: () =>
            Actions.UpdateRecipient({
              onSave: (recipient: Recipient) => {
                addRecipient(recipient)
                Actions.pop()
                Toast.show(t('recipient added'))
              },
            }),
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
              Actions.UpdateRecipient({
                recipient: item,
                onSave: (recipient: Recipient) => {
                  updateRecipient(recipient)
                  Actions.pop()
                  Toast.show(t('recipient updated'))
                },
                onDelete: (recipient: Recipient) => {
                  deleteRecipient(recipient.address)
                  Actions.pop()
                  Toast.show(t('recipient deleted'))
                },
              })
            }}
          >
            <Image
              source={{ uri: item.image || Constants.manifest?.extra?.defaultAvatarUrl }}
              style={styles.avatar}
            />
            <View>
              <Typography type="H6">{item.name}</Typography>
              <Typography>{item.address}</Typography>
              <Typography>{item.memo}</Typography>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Button
            style={styles.button}
            size="Large"
            onPress={() =>
              Actions.UpdateRecipient({
                onSave: (recipient: Recipient) => {
                  addRecipient(recipient)
                  Actions.pop()
                  Toast.show(t('recipient added'))
                },
              })
            }
          >
            {t('add recipient')}
          </Button>
        }
      />
    </>
  )
}

export default Recipients
