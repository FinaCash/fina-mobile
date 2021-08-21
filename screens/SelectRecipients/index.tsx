import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import Constants from 'expo-constants'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Recipient } from '../../types/recipients'

interface SelectRecipientsProps {
  onSelect(recipient: Recipient): void
}

const SelectRecipients: React.FC<SelectRecipientsProps> = ({ onSelect }) => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const { recipients } = useRecipientsContext()

  return (
    <>
      <HeaderBar back title={t('recipients')} />
      <FlatList
        style={styles.list}
        keyExtractor={(item) => item.address}
        data={recipients}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
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
      />
    </>
  )
}

export default SelectRecipients
