import React from 'react'
import { Image, View } from 'react-native'
import { validateMnemonic } from 'bip39'
import { StatusBar } from 'expo-status-bar'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Button from '../../components/Button'
import useStateHistory from '../../utils/useStateHistory'
import Input from '../../components/Input'
import { Actions } from 'react-native-router-flux'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import TerraApp from '@terra-money/ledger-terra-js'
import { deafultHdPath, defaultPrefix } from '../../utils/terraConfig'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { MnemonicKey } from '@terra-money/terra.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Logo = require('../../assets/images/logo.png')
const LogoWhite = require('../../assets/images/logo_white.png')

enum ContentStage {
  Start = 'start',
  CreateWallet = 'create wallet',
  ImportWallet = 'import wallet',
  SelectHDPath = 'select hd path',
}

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { login } = useAccountsContext()
  const { theme: uiTheme } = useSettingsContext()
  const [stage, setStage, back, isPrevAvailable, prevStage] = useStateHistory(ContentStage.Start)
  const [phraseInput, setPhraseInput] = React.useState('')
  const [error, setError] = React.useState('')
  // HD Path
  const [account, setAccount] = React.useState('0')
  const [index, setIndex] = React.useState('0')

  const onSubmit = React.useCallback(
    async (password: string) => {
      try {
        await login(
          phraseInput,
          password,
          undefined,
          undefined,
          Number(account) || 0,
          Number(index) || 0
        )
        Actions.replace('Main')
      } catch (err: any) {
        setError(err.message)
      }
    },
    [phraseInput, login, account, index]
  )

  const onConnectLedger = React.useCallback(
    async (terraApp: TerraApp) => {
      const hdPath = [
        deafultHdPath[0],
        deafultHdPath[1],
        Number(account) || 0,
        deafultHdPath[3],
        Number(index) || 0,
      ]
      await terraApp.showAddressAndPubKey(hdPath, defaultPrefix)
      const result = await terraApp.getAddressAndPubKey(hdPath, defaultPrefix)
      await login(
        '',
        '',
        result.bech32_address,
        undefined,
        Number(account) || 0,
        Number(index) || 0
      )
      Actions.pop()
      Actions.replace('Main')
    },
    [login, account, index]
  )

  React.useEffect(() => {
    if (stage === ContentStage.Start) {
      setError('')
      setPhraseInput('')
    }
  }, [stage])

  return (
    <>
      <StatusBar style={uiTheme === 'light' ? 'dark' : 'light'} />
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.palette.background }}
        contentContainerStyle={styles.container}
      >
        <View style={{ alignItems: 'center' }}>
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
          {stage === ContentStage.Start ? (
            <View>
              <Typography style={styles.btnDescription}>{t('new to wallet')}</Typography>
              <Button
                onPress={async () => {
                  setStage(ContentStage.CreateWallet)
                  const { mnemonic } = new MnemonicKey()
                  setPhraseInput(mnemonic)
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
                onPress={() => setStage(ContentStage.ImportWallet)}
                size="Large"
                style={[styles.button, styles.borderButton]}
                color={theme.palette.borderButton}
              >
                {t('import wallet')}
              </Button>
              <Button
                onPress={() => {
                  setStage(ContentStage.SelectHDPath)
                }}
                size="Large"
                style={[styles.button, styles.borderButton]}
                color={theme.palette.borderButton}
              >
                {t('connect ledger')}
              </Button>
            </View>
          ) : null}
          {stage === ContentStage.ImportWallet || stage === ContentStage.CreateWallet ? (
            <>
              <Input
                style={styles.phraseInput}
                multiline
                placeholder={t('enter seed phrase')}
                autoCapitalize="none"
                value={phraseInput}
                onChangeText={setPhraseInput}
                editable={stage === ContentStage.ImportWallet}
                error={error}
                size="Large"
              />
              <View style={{ height: theme.baseSpace * 8 }} />
              {stage === ContentStage.CreateWallet ? (
                <Typography type="Small" style={styles.securityReminder}>
                  {t('store phrase securely')}
                </Typography>
              ) : null}
              <View style={styles.row}>
                <Button
                  onPress={back}
                  size="Large"
                  style={[styles.rowButton, styles.borderButton]}
                  color={theme.palette.borderButton}
                >
                  {t('back')}
                </Button>
                <Button
                  onPress={() => {
                    if (!validateMnemonic(phraseInput)) {
                      setError(t('invalid seed phrase'))
                    } else {
                      Actions.Password({
                        onSubmit,
                        confirmationRequired: true,
                        isSetting: true,
                      })
                    }
                  }}
                  size="Large"
                  style={styles.rowButton}
                >
                  {t('confirm')}
                </Button>
              </View>
              <Button
                onPress={() => {
                  if (!validateMnemonic(phraseInput)) {
                    setError(t('invalid seed phrase'))
                  } else {
                    setStage(ContentStage.SelectHDPath)
                  }
                }}
                bgColor="transparent"
                color={theme.palette.lightPrimary}
              >
                {t('custom hd path')}
              </Button>
            </>
          ) : null}
          {stage === ContentStage.SelectHDPath ? (
            <>
              <View style={styles.hdContainer}>
                <Typography style={{ marginBottom: theme.baseSpace }}>{t('hd path')}</Typography>
                <View style={styles.row}>
                  <Typography type="H6">m/44/330/</Typography>
                  <Input
                    style={styles.numberInput}
                    textStyle={{ textAlign: 'center' }}
                    keyboardType="numeric"
                    value={account}
                    onChangeText={setAccount}
                  />
                  <Typography type="H6">/0/</Typography>
                  <Input
                    style={styles.numberInput}
                    textStyle={{ textAlign: 'center' }}
                    keyboardType="numeric"
                    value={index}
                    onChangeText={setIndex}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <Button
                  onPress={back}
                  size="Large"
                  style={[styles.rowButton, styles.borderButton]}
                  color={theme.palette.borderButton}
                >
                  {t('back')}
                </Button>
                <Button
                  onPress={() => {
                    if (prevStage === ContentStage.Start) {
                      Actions.ConnectLedger({
                        onSubmit: onConnectLedger,
                      })
                    } else {
                      Actions.Password({
                        onSubmit,
                        confirmationRequired: true,
                        isSetting: true,
                      })
                    }
                  }}
                  size="Large"
                  style={styles.rowButton}
                >
                  {t('confirm')}
                </Button>
              </View>
            </>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}

export default Login
