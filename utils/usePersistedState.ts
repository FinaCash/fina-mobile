import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import get from 'lodash/get'

const usePersistedState = <P>(
  key: string,
  initialValue: P,
  options?: { secure?: boolean }
): [P, React.Dispatch<React.SetStateAction<P>>, boolean] => {
  const [value, setValue] = React.useState(initialValue)
  const [loaded, setLoaded] = React.useState(false)
  const retrievePersistedValue = React.useCallback(async () => {
    try {
      const persistedString = await (get(options, 'secure', false)
        ? SecureStore.getItemAsync
        : AsyncStorage.getItem)(key)
      if (!persistedString) {
        setLoaded(true)
        return
      }
      const persistedValue = JSON.parse(persistedString)
      setValue(persistedValue)
      setLoaded(true)
    } catch (err: any) {
      // Does nothing
    }
  }, [options, key])

  React.useEffect(() => {
    retrievePersistedValue()
  }, [])

  React.useEffect(() => {
    const valueString = JSON.stringify(value)
    if (valueString) {
      ;(get(options, 'secure', false) ? SecureStore.setItemAsync : AsyncStorage.setItem)(
        key,
        valueString
      )
    } else {
      ;(get(options, 'secure', false) ? SecureStore.deleteItemAsync : AsyncStorage.removeItem)(key)
    }
  }, [value, key, options])

  return [value, setValue, loaded]
}

export default usePersistedState
