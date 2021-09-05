import React from 'react'
import { ScrollView } from 'react-native'
import { useLocalesContext } from '../../contexts/LocalesContext'
import useStyles from '../../theme/useStyles'
import { AssetTypes } from '../../types/assets'
import Button from '../Button'
import getStyles from './styles'

interface AssetFilterProps {
  currentFilter: string
  onChange(type: string): void
  withOverview?: boolean
}

const AssetFilter: React.FC<AssetFilterProps> = ({ currentFilter, onChange, withOverview }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollView}
      contentContainerStyle={styles.filterContainer}
    >
      {(withOverview ? ['overview', ...Object.values(AssetTypes)] : Object.values(AssetTypes)).map(
        (v) => (
          <Button
            key={v}
            borderRadius={2}
            style={styles.filterButton}
            bgColor={currentFilter === v ? theme.palette.grey[1] : 'transparent'}
            color={currentFilter === v ? theme.palette.primary : theme.palette.white}
            onPress={() => onChange(v as any)}
          >
            {t(v)}
          </Button>
        )
      )}
    </ScrollView>
  )
}

export default AssetFilter
