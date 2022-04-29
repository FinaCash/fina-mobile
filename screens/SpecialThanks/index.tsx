import React from 'react'
import { FlatList, View, Image } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'

const specialThanks = [
  {
    name: 'Coingecko',
    image:
      'https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png',
    description: 'Free crypto price API',
  },
]

const SpecialThanks: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)

  return (
    <>
      <HeaderBar back title={t('special thanks')} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.name}
        data={specialThanks}
        renderItem={({ item }) => (
          <View style={styles.innerContainer}>
            <View style={styles.topContainer}>
              <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View>
                  <Typography style={styles.gutterBottom} type="H6">
                    {item.name}
                  </Typography>
                  <Typography type="Small" color={theme.palette.grey[7]}>
                    {item.description}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </>
  )
}

export default SpecialThanks
