import React from 'react'
import { View } from 'react-native'
import { PieChart } from 'react-native-svg-charts'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useStyles from '../../theme/useStyles'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'

const colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c']

interface AssetsDonutChartProps {
  assets: Array<{ type: string; value: number }>
}

const AssetsDonutChart: React.FC<AssetsDonutChartProps> = ({ assets }) => {
  const { styles } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const { t } = useLocalesContext()

  const total = React.useMemo(() => assets.map((a) => a.value).reduce((a, b) => a + b, 0), [assets])
  return (
    <View style={styles.container}>
      <PieChart
        style={styles.chart}
        data={assets.map((a, i) => ({ value: a.value, key: a.type, svg: { fill: colors[i] } }))}
        innerRadius="85%"
        padAngle={5 / 360}
      />
      <Typography style={styles.title} type="H2">
        {t('total')}
      </Typography>
      <Typography type="H4">{formatCurrency(total, currency)}</Typography>
      <View style={styles.legends}>
        {assets.map((a, i) => (
          <View style={styles.legend} key={a.type}>
            <View style={[styles.colorPad, { backgroundColor: colors[i] }]} />
            <Typography type="Base">
              {t(a.type)} {formatCurrency(a.value, currency)} ({formatPercentage(a.value / total)})
            </Typography>
          </View>
        ))}
      </View>
    </View>
  )
}

export default AssetsDonutChart
