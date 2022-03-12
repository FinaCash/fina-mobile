import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import { ScrollView, TextInput } from 'react-native'
import { sampleSize, times } from 'lodash'

interface ConfirmSeedPhraseProps {
  onSubmit(): void
  seed: string
}

const ConfirmSeedPhrase: React.FC<ConfirmSeedPhraseProps> = ({ onSubmit, seed }) => {
  const ref = React.useRef<TextInput>()
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const [num] = React.useState(sampleSize(times(24), 2))
  const [word1, setWord1] = React.useState('')
  const [word2, setWord2] = React.useState('')
  const [error1, setError1] = React.useState('')
  const [error2, setError2] = React.useState('')
  const seedArr = React.useMemo(() => seed.split(' '), [seed])

  const confirm = React.useCallback(() => {
    let hasErr = false
    setError1('')
    setError2('')
    if (seedArr[num[0]] !== word1) {
      setError1(t('invalid seed phrase'))
      hasErr = true
    }
    if (seedArr[num[1]] !== word2) {
      setError2(t('invalid seed phrase'))
      hasErr = true
    }
    if (!hasErr) {
      onSubmit()
    }
  }, [onSubmit, seedArr, num, word1, word2, t])

  return (
    <>
      <HeaderBar back title={t('confirm seed phrase')} />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <Typography bold style={styles.label}>
          {t('word #x', { x: num[0] + 1 })}
        </Typography>
        <Input
          style={styles.input}
          size="Large"
          autoFocus
          value={word1}
          onChangeText={setWord1}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => ref.current?.focus()}
        />
        {error1 ? <Typography style={styles.error}>{error1}</Typography> : null}
        <Typography bold style={styles.label}>
          {t('word #x', { x: num[1] + 1 })}
        </Typography>
        <Input
          inputRef={ref}
          style={styles.input}
          size="Large"
          value={word2}
          onChangeText={setWord2}
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={confirm}
        />
        {error2 ? <Typography style={styles.error}>{error2}</Typography> : null}
        <Button style={styles.marginTop} disabled={!word1 || !word2} onPress={confirm} size="Large">
          {t('confirm')}
        </Button>
      </ScrollView>
    </>
  )
}

export default ConfirmSeedPhrase
