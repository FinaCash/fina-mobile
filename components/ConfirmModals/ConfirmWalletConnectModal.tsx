import React from 'react'
import { ActivityIndicator, View, ScrollView } from 'react-native'
import keyBy from 'lodash/keyBy'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import { formatCurrency } from '../../utils/formatNumbers'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import JSONTree from 'react-native-json-tree'
import BottomModal from '../BottomModal'
import { useSettingsContext } from '../../contexts/SettingsContext'
import jsonTree from '../../theme/jsonTree'

interface ConfirmWalletConnectModalProps {
  open: boolean
  onClose(): void
  msgs: string[]
  fee: string
  onConfirm(): void
}

const ConfirmWalletConnectModal: React.FC<ConfirmWalletConnectModalProps> = ({
  open,
  onClose,
  msgs,
  fee: defaultFee,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { theme: themeType } = useSettingsContext()
  const { t } = useLocalesContext()
  const fee = defaultFee ? keyBy(JSON.parse(defaultFee).amount, 'denom') : {}

  return (
    <BottomModal
      title={t('confirm transacrtion')}
      open={open}
      onClose={onClose}
      modalHeight={
        theme.baseSpace * 104 + Object.keys(fee).length * 2 * theme.baseSpace + theme.bottomSpace
      }
    >
      <ScrollView style={{ height: theme.baseSpace * 60, paddingRight: theme.baseSpace * 20 }}>
        <JSONTree
          data={msgs.map((m) => JSON.parse(m))}
          hideRoot
          shouldExpandNode={() => true}
          theme={jsonTree}
          invertTheme={themeType === 'light'}
        />
      </ScrollView>
      <View style={[styles.confirmMiodalRow, styles.borderBottom]}>
        <Typography type="Large" color={theme.palette.grey[7]}>
          {t('transaction fee')}
        </Typography>
        <View style={styles.alignRight}>
          {Object.keys(fee).length ? (
            Object.values(fee).map((f) => (
              <Typography key={f.denom} type="Large">
                {formatCurrency(f.amount, '')} {getSymbolFromDenom(f.denom)}
              </Typography>
            ))
          ) : (
            <ActivityIndicator size="small" color={theme.fonts.H1.color} />
          )}
        </View>
      </View>
      <Button style={styles.modalButton} size="Large" onPress={onConfirm}>
        {t('confirm')}
      </Button>
    </BottomModal>
  )
}

export default ConfirmWalletConnectModal
