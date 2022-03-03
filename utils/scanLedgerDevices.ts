import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import { PermissionsAndroid, Platform } from 'react-native'

const scanLedgerDevices = async (onAdd: (device: any) => void) => {
  let observe = { unsubscribe: () => {} }
  let subscription = { unsubscribe: () => {} }
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.ACCESS_COARSE_LOCATION',
    ] as any)

    if (
      !Object.values(granted)
        .map((a) => a === 'granted' || a === 'never_ask_again')
        .reduce((a, b) => a && b, true)
    ) {
      throw new Error('ble not available')
    }
  }

  observe = TransportBLE.observeState({
    next: (a: any) => {
      observe.unsubscribe()
      if (!a.available) {
        throw new Error('ble not available')
      } else {
        subscription = TransportBLE.listen({
          next: (e: any) => {
            subscription.unsubscribe()
            if (e.type === 'add') {
              onAdd(e.descriptor)
            }
          },
          error: (e: any) => console.log(e),
        })
      }
    },
    error: (e: any) => console.log(e),
  })
  return () => {
    observe.unsubscribe()
    subscription.unsubscribe()
  }
}

export default scanLedgerDevices
