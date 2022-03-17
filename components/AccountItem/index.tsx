import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
// import LedgerIcon from '../../assets/images/ledger.svg'
import useStyles from '../../theme/useStyles'
import { Account } from '../../types/accounts'
import Typography from '../Typography'
import getStyles from './styles'

interface AccountItemProps extends TouchableOpacityProps {
  account: Account
}

const AccountItem: React.FC<AccountItemProps> = ({ account, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <TouchableOpacity style={styles.item} {...props}>
      {/* {account.type === 'ledger' ? (
        <LedgerIcon
          width={theme.baseSpace * 10}
          height={theme.baseSpace * 10}
          style={styles.avatar}
        />
      ) : (
        <Icon size={theme.baseSpace * 10} style={styles.avatar} name="file-text" />
      )} */}
      <View style={styles.rightContainer}>
        <Typography type="H6">{account.name}</Typography>
        <Typography type="Small" numberOfLines={1}>
          {account.address}
        </Typography>
      </View>
      <Icon size={6 * theme.baseSpace} color={theme.fonts.Base.color} name="chevron-right" />
    </TouchableOpacity>
  )
}

export default AccountItem
