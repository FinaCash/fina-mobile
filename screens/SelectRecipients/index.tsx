import React from 'react'
import { FlatList } from 'react-native'
import HeaderBar from '../../components/HeaderBar'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Recipient } from '../../types/recipients'
import RecipientItem from '../../components/RecipientItem'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface SelectRecipientsProps {
  onSelect(recipient: Recipient): void
}

const SelectRecipients: React.FC<SelectRecipientsProps> = ({ onSelect }) => {
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const { recipients } = useRecipientsContext()

  return (
    <>
      <HeaderBar back title={t('recipients')} />
      <FlatList
        style={styles.list}
        keyExtractor={(item) => item.address}
        data={recipients}
        renderItem={({ item }) => <RecipientItem recipient={item} onPress={() => onSelect(item)} />}
      />
    </>
  )
}

export default SelectRecipients
