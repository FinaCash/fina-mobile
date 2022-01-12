import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

const scanLedgerDevices = (onAdd: (device: any) => void) => {
  let observe = { unsubscribe: () => {} }
  let subscription = { unsubscribe: () => {} }
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
        })
      }
    },
  })
  return () => {
    observe.unsubscribe()
    subscription.unsubscribe()
  }
}

export default scanLedgerDevices
