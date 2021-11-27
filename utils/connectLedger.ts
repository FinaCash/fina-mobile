import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

const connectLedger = () => {
  const subscription = TransportBLE.observeState({
    next: (e) => {
      console.log('next', e)
    },
    complete: (e) => {
      console.log('complete', e)
    },
    error: (e) => {
      console.log('error', e)
    },
  })
}

export default connectLedger
