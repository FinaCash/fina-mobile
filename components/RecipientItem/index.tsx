import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { Recipient } from '../../types/recipients'
import Typography from '../Typography'
import getStyles from './styles'
import { defaultAvatarUrl } from '../../utils/terraConfig'

interface RecipientItemProps extends TouchableOpacityProps {
  recipient: Recipient
}

const RecipientItem: React.FC<RecipientItemProps> = ({ recipient, ...props }) => {
  const { styles } = useStyles(getStyles)
  return (
    <TouchableOpacity style={styles.item} {...props}>
      <Image source={{ uri: recipient.image || defaultAvatarUrl }} style={styles.avatar} />
      <View style={styles.rightContainer}>
        <Typography type="H6">{recipient.name}</Typography>
        <Typography numberOfLines={1}>{recipient.address}</Typography>
        <Typography>{recipient.memo}</Typography>
      </View>
    </TouchableOpacity>
  )
}

export default RecipientItem
