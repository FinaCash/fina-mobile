import React from 'react'
import { FlatList, Alert, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Toast from 'react-native-root-toast'
import { useActionSheet } from '@expo/react-native-action-sheet'
import EmptyImage from '../../assets/images/emptyReceipient.svg'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Recipient } from '../../types/recipients'
import { Actions } from 'react-native-router-flux'
import useSendToken from '../../utils/useSendToken'
import RecipientItem from '../../components/RecipientItem'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Typography from '../../components/Typography'

const Recipients: React.FC = () => {
  const { t } = useLocalesContext()
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
        back
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyImage />
            <View style={styles.emptyText}>
              <Typography style={{ marginBottom: theme.baseSpace * 2 }} type="H4">
                {t('no receipient')}
              </Typography>
              <Typography type="Large" color={theme.palette.grey[7]}>
                {t('no receipient description')}
              </Typography>
            </View>
            <Button
              onPress={() =>
                Actions.UpdateRecipient({
                  onSave: (recipient: Recipient) => {
                    addRecipient(recipient)
                    Actions.pop()
                    Toast.show(t('recipient added'))
                  },
                })
              }
              size="Large"
              style={{ width: theme.baseSpace * 40 }}
            >
              {t('add recipient')}
            </Button>
          </View>
        }
      />
    </>
  )
}

export default Recipients
