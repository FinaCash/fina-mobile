import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import { Recipient } from '../../types/recipients'
import { TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { Actions } from 'react-native-router-flux'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { formatCurrency } from '../../utils/formatNumbers'

const baseCurrency = 'uusd'

const Borrow: React.FC = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()

  const innerBarStyle = {
    backgroundColor: theme.palette.green,
    width: '60%',
  }

  return (
    <>
      <HeaderBar title={t('borrow')} subtitle={t('powered by anchor protocol')} />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <View>
              <Typography type="Mini">{t('collateral value')}</Typography>
              <Typography type="Large" bold>
                $10,000
              </Typography>
            </View>
            <View>
              <Typography type="Mini">{t('borrowed value')}</Typography>
              <Typography type="Large" bold>
                $10,000
              </Typography>
            </View>
            <TouchableOpacity>
              <Typography color={theme.palette.green} type="Mini">
                {t('net APR')}
              </Typography>
              <Typography color={theme.palette.green} type="Large" bold>
                24.38%
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>{/*  */}</View>
          <View style={styles.outerBar}>
            <View style={[styles.innerBar, innerBarStyle]} />
          </View>
          <View style={styles.spacedRow}>
            <Typography type="Small">{t('LTV')}</Typography>
            <Typography type="Small">
              {t('borrow limit', { amount: formatCurrency(10000 * 10 ** 6, baseCurrency, true) })}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default Borrow
