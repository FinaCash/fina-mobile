import React from 'react'
import { SectionList, TouchableOpacity, View, Alert, Switch } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import get from 'lodash/get'
import Toast from 'react-native-root-toast'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useSettingsContext } from '../../contexts/SettingsContext'
import {
  getCurrencyFromDenom,
  getCurrentAssetDetail,
  getSymbolFromDenom,
} from '../../utils/transformAssets'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { ThemeType } from '../../types/misc'
import { Actions } from 'react-native-router-flux'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Asset } from '../../types/assets'

const supportedThemes = Object.values(ThemeType)

const Settings: React.FC = () => {
  const { login, logout, decryptSeedPhrase, type } = useAccountsContext()
  const { t, locale, setLocale, supportedLocales } = useLocalesContext()
  const { styles, theme: themeStyle } = useStyles(getStyles)
  const {
    theme,
    currency,
    setTheme,
    setCurrency,
    systemDefaultTheme,
    setSystemDefaultTheme,
    hideSmallBalance,
    setHideSmallBalance,
  } = useSettingsContext()
  const { availableCurrencies } = useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()

  const sections = [
    {
      title: t('preference'),
      data: [
        {
          icon: theme === 'dark' ? 'moon' : 'sun',
          title: t('theme'),
          value: systemDefaultTheme ? t('system default') : t(theme),
          onPress: () => {
            showActionSheetWithOptions(
              {
                options: [t('system default'), ...supportedThemes.map((l) => t(l)), t('cancel')],
                cancelButtonIndex: supportedThemes.length + 1,
              },
              (index) => {
                if (index === 0) {
                  setSystemDefaultTheme(true)
                } else if (index < supportedThemes.length + 1) {
                  setSystemDefaultTheme(false)
                  setTheme(supportedThemes[index - 1])
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
                }
              }
            )
          },
        },
        {
          icon: 'dollar-sign',
          title: t('currency'),
          value: `${getSymbolFromDenom(currency)} (${getCurrencyFromDenom(currency)})`,
          onPress: () =>
            Actions.SelectAsset({
              assets: availableCurrencies.map((c) =>
                getCurrentAssetDetail({ denom: c.denom, amount: '0' })
              ),
              assetItemProps: { hideAmount: true },
              onSelect: (a: Asset) => {
                Actions.pop()
                setTimeout(() => {
                  setCurrency(a.coin.denom)
                }, 500)
              },
            }),
        },
        {
          icon: 'eye-off',
          title: t('hide small balance'),
          value: hideSmallBalance,
          toggle: true,
          onChange: (v: boolean) => {
            setHideSmallBalance(v)
          },
        },
      ],
    },
    {
      title: t('account'),
      data: [
        type !== 'ledger'
          ? {
              icon: 'eye',
              title: t('view seed phrase'),
              value: '',
              onPress: () => {
                Actions.Password({
                  onSubmit: (password: string) => {
                    const phrase = decryptSeedPhrase(password)
                    if (phrase) {
                      Alert.alert(t('seed phrase'), phrase, [
                        {
                          text: t('close'),
                          onPress: () => Actions.pop(),
                          style: 'cancel',
                        },
                      ])
                    }
                  },
                })
              },
            }
          : null,
        type !== 'ledger'
          ? {
              icon: 'lock',
              title: t('change password'),
              value: '',
              onPress: () => {
                Actions.Password({
                  onSubmit: (oldPassword: string) => {
                    const phrase = decryptSeedPhrase(oldPassword)
                    if (phrase) {
                      Actions.pop()
                      Actions.Password({
                        onSubmit: async (password: string) => {
                          await login(phrase, password)
                          Toast.show(t('password updated'))
                        },
                        confirmationRequired: true,
                        newPassword: true,
                        isSetting: true,
                      })
                    }
                  },
                })
              },
            }
          : null,
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
      ].filter((a) => a),
    },
  ]

  return (
    <>
      <HeaderBar title={t('settings')} />
      <SectionList
        style={styles.list}
        keyExtractor={(item) => (item ? item.title : '')}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.itemContainer}>
            <Typography type="Large" bold>
              {title}
            </Typography>
          </View>
        )}
        renderItem={({ item }) =>
          item ? (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={item.onPress}
              disabled={item.toggle}
            >
              <View style={styles.row}>
                <Icon
                  style={styles.icon}
                  name={item.icon as any}
                  size={6 * themeStyle.baseSpace}
                  color={themeStyle.fonts.Base.color}
                />
                <Typography>{item.title}</Typography>
              </View>
              {item.toggle ? (
                <Switch value={item.value} onValueChange={item.onChange} />
              ) : (
                <View style={styles.row}>
                  <Typography>{item.value}</Typography>
                  <Icon
                    style={styles.arrow}
                    name="chevron-right"
                    size={6 * themeStyle.baseSpace}
                    color={themeStyle.fonts.Base.color}
                  />
                </View>
              )}
            </TouchableOpacity>
          ) : null
        }
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
