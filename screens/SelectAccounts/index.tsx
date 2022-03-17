import React from 'react'
import { FlatList, SectionList, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAccountsContext } from '../../contexts/AccountsContext'
import AccountItem from '../../components/AccountItem'
import Typography from '../../components/Typography'

const SelectAccounts: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { accounts, setCurrenctAccountId } = useAccountsContext()

  const sections = [
    {
      title: t('ledger'),
      data: accounts.filter((a) => a.type === 'ledger'),
    },
    {
      title: t('seed phrase'),
      data: accounts.filter((a) => a.type === 'seed'),
    },
  ].filter((s) => s.data.length)

  return (
    <>
      <HeaderBar
        title={t('account')}
        back
        rightButton={{
          icon: <Icon name="user-plus" color={theme.palette.white} size={theme.baseSpace * 5} />,
          onPress: () => Actions.Login({ back: true }),
        }}
      />
      <SectionList
        style={styles.list}
        keyExtractor={(item) => item.address}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.titleContainer}>
            <Typography type="Large" color={theme.palette.grey[7]}>
              {title}
            </Typography>
          </View>
        )}
        renderItem={({ item }) => (
          <AccountItem
            account={item}
            onPress={() => {
              setCurrenctAccountId(item.id)
              Actions.pop()
            }}
          />
        )}
      />
    </>
  )
}

export default SelectAccounts
