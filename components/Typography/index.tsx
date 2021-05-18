import React from 'react'
import { Text, TextProps, TextStyle } from 'react-native'
import useStyles from '../../theme/useStyles'

interface TypographyProps extends TextProps {
  type?: FontType
  children: React.ReactNode
  color?: string
  bold?: boolean
  style?: TextStyle | TextStyle[]
}

const Typography: React.FC<TypographyProps> = ({
  type = 'Base',
  color,
  children,
  bold,
  style,
  ...props
}) => {
  const { theme } = useStyles()
  return (
    <Text
      style={[
        theme.fonts[type],
        color ? { color } : {},
        bold ? { fontFamily: 'MontserratBold' } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  )
}

export default Typography
