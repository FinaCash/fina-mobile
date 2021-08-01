import React from 'react'
import { Image, View } from 'react-native'
import Typography from '../../components/Typography'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Button from '../../components/Button'
import useStateHistory from '../../utils/useStateHistory'
import Input from '../../components/Input'
import { Actions } from 'react-native-router-flux'
import { MnemonicKey } from '@terra-money/terra.js'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { ScrollView } from 'react-native'

enum ContentStage {
  Start = 'start',
  CreateWallet = 'create wallet',
  ImportWallet = 'import wallet',
}

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { styles } = useStyles(getStyles)
  const { t } = useTranslation()
  const { login } = useAssetsContext()
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
              onPress={() => setStage(ContentStage.ImportWallet)}
              size="Large"
              style={styles.button}
            >
              {t('import wallet')}
            </Button>
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
              <Button onPress={back} size="Large" style={styles.rowButton}>
                {t('back')}
              </Button>
              <Button
                onPress={() =>
                  Actions.Password({
                    title: t('please enter password'),
                    onSubmit,
                    confirmationRequired: true,
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
