import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import BackIcon from '../../assets/images/icons/back.svg'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Typography from '../Typography'

interface HeaderBarProps {
  title: string
  back?: boolean
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, back }) => {
  const { theme, styles } = useStyles(getStyles)
  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 5]}
      colors={theme.gradients.primary}
      style={styles.container}
    >
      {back ? (
        <TouchableOpacity style={styles.leftButton} onPress={() => Actions.pop()}>
          <BackIcon />
        </TouchableOpacity>
      ) : null}
      <Typography color={theme.palette.white} type="H6">
        {title}
      </Typography>
    </LinearGradient>
  )
}

export default HeaderBar
