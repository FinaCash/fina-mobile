import React from 'react'
import { Image, View } from 'react-native'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Button from '../../components/Button'
import useStateHistory from '../../utils/useStateHistory'
import Input from '../../components/Input'
import { Actions } from 'react-native-router-flux'
import { MnemonicKey } from '@terra-money/terra.js'
import { ScrollView } from 'react-native'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import connectLedger from '../../utils/connectLedger'

enum ContentStage {
  Start = 'start',
  CreateWallet = 'create wallet',
  ImportWallet = 'import wallet',
}

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { login } = useAccountsContext()
  const [stage, setStage, back] = useStateHistory(ContentStage.Start)
  const [phraseInput, setPhraseInput] = React.useState('')

  const onSubmit = React.useCallback(
    async (password: string) => {
      await login(phraseInput, password)
      Actions.replace('Main')
    },
    [phraseInput, login]
  )

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <View>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
        <Typography type="Large" style={styles.slogan}>
          {t('slogan')}
        </Typography>
      </View>
      <View style={styles.contentContainer}>
        {stage === ContentStage.Start ? (
          <>
            <Button
              onPress={() => {
                setStage(ContentStage.CreateWallet)
                const { mnemonic } = new MnemonicKey()
                setPhraseInput(mnemonic)
              }}
              size="Large"
              style={styles.button}
            >
              {t('create wallet')}
            </Button>
            <Button
              onPress={() => setStage(ContentStage.ImportWallet)}
              size="Large"
              style={[styles.button, styles.borderButton]}
              color={theme.palette.primary}
            >
              {t('import wallet')}
            </Button>
            <Button
              onPress={() => connectLedger()}
              size="Large"
              style={[styles.button, styles.borderButton]}
              color={theme.palette.primary}
            >
              {t('connect ledger')}
            </Button>
          </>
        ) : null}
        {stage === ContentStage.ImportWallet || stage === ContentStage.CreateWallet ? (
          <>
            <Input
              style={styles.phraseInput}
              multiline
              placeholder={t('enter secret recovery phrase')}
              autoCapitalize="none"
              value={phraseInput}
              onChangeText={setPhraseInput}
              editable={stage === ContentStage.ImportWallet}
            />
            {stage === ContentStage.CreateWallet ? (
              <Typography type="Small" style={styles.securityReminder}>
                {t('store phrase securely')}
              </Typography>
            ) : null}
            <View style={styles.row}>
              <Button
                onPress={() => {
                  back()
                  setPhraseInput('')
                }}
                size="Large"
                style={[styles.rowButton, styles.borderButton]}
                color={theme.palette.primary}
              >
                {t('back')}
              </Button>
              <Button
                onPress={() =>
                  Actions.Password({
                    onSubmit,
                    confirmationRequired: true,
                    isSetting: true,
                  })
                }
                size="Large"
                style={styles.rowButton}
              >
                {t('confirm')}
              </Button>
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  )
}

export default Login
