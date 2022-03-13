import React from 'react'
import { Image, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Button from '../../components/Button'
import { Actions } from 'react-native-router-flux'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import TerraApp from '@terra-money/ledger-terra-js'
import { defaultPrefix } from '../../utils/terraConfig'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { MnemonicKey } from '@terra-money/terra.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Logo = require('../../assets/images/logo.png')
const LogoWhite = require('../../assets/images/logo_white.png')

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { login } = useAccountsContext()
  const { theme: uiTheme } = useSettingsContext()

  const onSubmit = React.useCallback(
    async (password: string, name: string, seed: string, hdPath: number[]) => {
      await login(name, seed, password, undefined, hdPath)
      Actions.replace('Main')
    },
    [login]
  )

  const onConnectLedger = React.useCallback(
    async (terraApp: TerraApp, name: string) => {
      Actions.SelectHDPath({
        terraApp,
        onSubmit: async (hdPath: number[]) => {
          await terraApp.showAddressAndPubKey(hdPath, defaultPrefix)
          const result = await terraApp.getAddressAndPubKey(hdPath, defaultPrefix)
          await login(name, '', '', result.bech32_address, hdPath)
          Actions.replace('Main')
        },
      })
    },
    [login]
  )

  return (
    <>
      <StatusBar style={uiTheme === 'light' ? 'dark' : 'light'} />
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.palette.background }}
        contentContainerStyle={styles.container}
      >
        <View style={{ alignItems: 'center', marginHorizontal: theme.baseSpace * -4 }}>
          <Image style={styles.logo} source={uiTheme === 'light' ? Logo : LogoWhite} />
          <Typography type={theme.isSmallScreen ? 'H3' : 'H2'} style={styles.slogan}>
            {t('slogan 1')}
            <Typography type={theme.isSmallScreen ? 'H3' : 'H2'} color={theme.palette.lightPrimary}>
              {t('slogan highlight')}
            </Typography>
            {t('slogan 2')}
          </Typography>
          <Typography type={theme.isSmallScreen ? 'H3' : 'H2'}>{t('slogan 3')}</Typography>
        </View>
        <View style={styles.contentContainer}>
          <View>
            <Typography style={styles.btnDescription}>{t('new to wallet')}</Typography>
            <Button
              onPress={async () => {
                const { mnemonic } = new MnemonicKey()
                Actions.EnterSeedPhrase({
                  seed: mnemonic,
                  onSubmit: (name: string, seed: string) => {
                    Actions.ConfirmSeedPhrase({
                      seed,
                      onSubmit: () => {
                        Actions.SelectHDPath({
                          seed,
                          onSubmit: (hdPath: number[]) => {
                            Actions.Password({
                              onSubmit: (password: string) =>
                                onSubmit(password, name, seed, hdPath),
                              confirmationRequired: true,
                              isSetting: true,
                            })
                          },
                        })
                      },
                    })
                  },
                })
              }}
              size="Large"
              style={styles.button}
            >
              {t('create wallet')}
            </Button>
            <Typography style={[styles.btnDescription, { marginTop: theme.baseSpace * 4 }]}>
              {t('already have a wallet')}
            </Typography>
            <Button
              onPress={() => {
                // setStage(ContentStage.ImportWallet)
                Actions.EnterSeedPhrase({
                  onSubmit: (name: string, seed: string) => {
                    Actions.SelectHDPath({
                      seed,
                      onSubmit: (hdPath: number[]) => {
                        Actions.Password({
                          onSubmit: (password: string) => onSubmit(password, name, seed, hdPath),
                          confirmationRequired: true,
                          isSetting: true,
                        })
                      },
                    })
                  },
                })
              }}
              size="Large"
              style={[styles.button, styles.borderButton]}
              color={theme.palette.borderButton}
            >
              {t('import wallet')}
            </Button>
            <Button
              onPress={() => {
                Actions.EnterSeedPhrase({
                  disabledSeed: true,
                  onSubmit: (name: string) => {
                    Actions.ConnectLedger({
                      onSubmit: (terraApp: TerraApp) => onConnectLedger(terraApp, name),
                    })
                  },
                })
              }}
              size="Large"
              style={[styles.button, styles.borderButton]}
              color={theme.palette.borderButton}
            >
              {t('connect ledger')}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}

export default Login
