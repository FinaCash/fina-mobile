import React from 'react'
import { validateMnemonic } from 'bip39'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import { ScrollView, TextInput } from 'react-native'

interface EnterSeedPhraseProps {
  onSubmit(name: string, seed: string): void
  seed?: string
}

const EnterSeedPhrase: React.FC<EnterSeedPhraseProps> = ({ onSubmit, seed: defaultSeed }) => {
  const ref = React.useRef<TextInput>()
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const [name, setName] = React.useState('')
  const [seed, setSeed] = React.useState(defaultSeed || '')
  const [error, setError] = React.useState('')

  const confirm = React.useCallback(() => {
    if (!validateMnemonic(seed)) {
      setError(t('invalid seed phrase'))
    } else {
      onSubmit(name, seed)
    }
  }, [onSubmit, name, seed, t])

  return (
    <>
      <HeaderBar back title={t('import wallet')} />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <Typography bold style={styles.label}>
          {t('wallet nickname')}
        </Typography>
        <Input
          style={styles.input}
          size="Large"
          placeholder={t('name placeholder')}
          autoFocus
          value={name}
          onChangeText={setName}
          returnKeyType={defaultSeed ? 'go' : 'next'}
          onSubmitEditing={defaultSeed ? confirm : () => ref.current?.focus()}
        />
        <Typography bold style={styles.label}>
          {t('seed phrase')}
        </Typography>
        <Input
          inputRef={ref}
          style={styles.seedInput}
          multiline
          placeholder={t('enter seed phrase')}
          autoCapitalize="none"
          size="Large"
          editable={!defaultSeed}
          value={seed}
          onChangeText={(t) => {
            setSeed(t)
            setError('')
          }}
          returnKeyType="go"
          onSubmitEditing={confirm}
          blurOnSubmit
        />
        {error ? <Typography style={styles.error}>{error}</Typography> : null}
        {defaultSeed ? (
          <Typography style={styles.warning}>{t('store phrase securely')}</Typography>
        ) : null}
        <Button
          style={styles.marginTop}
          disabled={!name || !seed || !!error}
          onPress={confirm}
          size="Large"
        >
          {t('confirm')}
        </Button>
      </ScrollView>
    </>
  )
}

export default EnterSeedPhrase
