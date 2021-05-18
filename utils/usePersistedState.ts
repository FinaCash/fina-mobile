import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const usePersistedState = <P>(
  key: string,
  initialValue: P
): [P, React.Dispatch<React.SetStateAction<P>>, boolean] => {
  const [value, setValue] = React.useState(initialValue)
  const [loaded, setLoaded] = React.useState(false)
  const retrievePersistedValue = React.useCallback(async () => {
    try {
      const persistedString = await AsyncStorage.getItem(key)
      if (!persistedString) {
        setLoaded(true)
        return
      }
      const persistedValue = JSON.parse(persistedString)
      setValue(persistedValue)
      setLoaded(true)
    } catch (err) {
      // Does nothing
    }
  }, [])
  React.useEffect(() => {
    retrievePersistedValue()
  }, [])

  React.useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(value))
  }, [value])
  return [value, setValue, loaded]
}

export default usePersistedState
