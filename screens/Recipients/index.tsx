import React from 'react'
import { FlatList, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Toast from 'react-native-root-toast'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Recipient } from '../../types/recipients'
import { Actions } from 'react-native-router-flux'
import useSendToken from '../../utils/useSendToken'
import RecipientItem from '../../components/RecipientItem'

const Recipients: React.FC = () => {
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const sendToken = useSendToken()
  const { styles, theme } = useStyles(getStyles)

  const { recipients, addRecipient, deleteRecipient, updateRecipient } = useRecipientsContext()

  const onItemPress = React.useCallback(
    (item: Recipient) => {
      showActionSheetWithOptions(
        {
          options: [t('transfer'), t('edit'), t('remove'), t('cancel')],
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2,
        },
        (index) => {
          if (index === 0) {
            sendToken({ recipient: item })
          } else if (index === 1) {
            Actions.UpdateRecipient({
              recipient: item,
              onSave: (recipient: Recipient) => {
                updateRecipient(recipient)
                Actions.pop()
                Toast.show(t('recipient updated'))
              },
            })
          } else if (index === 2) {
            Alert.alert(t('remove'), t('confirm remove recipient'), [
              {
                text: t('cancel'),
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: t('confirm'),
                onPress: () => {
                  deleteRecipient(item.address)
                  Toast.show(t('recipient deleted'))
                },
                style: 'destructive',
              },
            ])
          }
        }
      )
    },
    [t, deleteRecipient, sendToken, updateRecipient, showActionSheetWithOptions]
  )

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
          <RecipientItem recipient={item} onPress={() => onItemPress(item)} />
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
