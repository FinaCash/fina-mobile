import React from 'react'
import { SectionList, TouchableOpacity, View, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import get from 'lodash/get'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getCurrencyFromDenom } from '../../utils/transformAssets'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { ThemeType } from '../../types/misc'
import { Actions } from 'react-native-router-flux'
import { useLocalesContext } from '../../contexts/LocalesContext'

const supportedThemes = Object.values(ThemeType)

const Settings: React.FC = () => {
  const { logout } = useAccountsContext()
  const { t, locale, setLocale, supportedLocales } = useLocalesContext()
  const { styles, theme: themeStyle } = useStyles(getStyles)
  const { theme, currency, setTheme } = useSettingsContext()
  const { showActionSheetWithOptions } = useActionSheet()

  const sections = [
    {
      title: t('preference'),
      data: [
        {
          icon: theme === 'dark' ? 'moon' : 'sun',
          title: t('theme'),
          value: t(theme),
          onPress: () => {
            showActionSheetWithOptions(
              {
                options: [...supportedThemes.map((l) => t(l)), t('cancel')],
                cancelButtonIndex: supportedThemes.length,
              },
              (index) => {
                if (index < supportedThemes.length) {
                  setTheme(supportedThemes[index])
                  Actions.jump('Settings')
                }
              }
            )
          },
        },
        {
          icon: 'globe',
          title: t('language'),
          value: t(locale),
          onPress: () => {
            showActionSheetWithOptions(
              {
                options: [...supportedLocales.map((l) => t(l)), t('cancel')],
                cancelButtonIndex: supportedLocales.length,
              },
              (index) => {
                if (index < supportedLocales.length) {
                  setLocale(supportedLocales[index])
                  Actions.jump('Settings')
                }
              }
            )
          },
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
