import React from 'react'
import { SectionList, TouchableOpacity, View, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import get from 'lodash/get'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getCurrencyFromDenom } from '../../utils/transformAssets'

const Settings: React.FC = () => {
  const { logout } = useAccountsContext()
  const { t, locale } = useTranslation()
  const { styles, theme: themeStyle } = useStyles(getStyles)
  const { theme, currency } = useSettingsContext()

  const sections = [
    {
      title: t('preference'),
      data: [
        {
          icon: theme === 'dark' ? 'moon' : 'sun',
          title: t('theme'),
          value: t(theme),
        },
        {
          icon: 'globe',
          title: t('language'),
          value: t(locale),
        },
        {
          icon: 'dollar-sign',
          title: t('currency'),
          value: getCurrencyFromDenom(currency),
        },
      ],
    },
    {
      title: t('account'),
      data: [
        {
          icon: 'eye',
          title: t('view secret recovery phrase'),
          value: '',
        },
        {
          icon: 'lock',
          title: t('change password'),
          value: '',
        },
        {
          icon: 'log-out',
          title: t('logout'),
          value: '',
          onPress: () => {
            Alert.alert(t('logout'), t('confirm logout'), [
              {
                text: t('cancel'),
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: t('confirm'),
                onPress: logout,
                style: 'destructive',
              },
            ])
          },
        },
      ],
    },
  ]

  return (
    <>
      <HeaderBar title={t('settings')} />
      <SectionList
        style={styles.list}
        keyExtractor={(item) => item.title}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.itemContainer}>
            <Typography type="Large" bold>
              {title}
            </Typography>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={item.onPress}>
            <View style={styles.row}>
              <Icon
                style={styles.icon}
                name={item.icon as any}
                size={6 * themeStyle.baseSpace}
                color={themeStyle.palette.grey[10]}
              />
              <Typography>{item.title}</Typography>
            </View>
            <View style={styles.row}>
              <Typography>{item.value}</Typography>
              <Icon
                style={styles.arrow}
                name="chevron-right"
                size={6 * themeStyle.baseSpace}
                color={themeStyle.palette.grey[10]}
              />
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Typography style={styles.version}>
            v{get(Constants, 'manifest.version', '0.0.0')}
          </Typography>
        }
      />
    </>
  )
}

export default Settings
