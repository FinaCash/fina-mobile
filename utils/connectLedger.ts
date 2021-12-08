import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import TerraApp from '@terra-money/ledger-terra-js'
import { deafultHdPath, defaultPrefix } from './terraConfig'

let terraApp: TerraApp
let deviceId: string

const connectLedger = () =>
  new Promise<TerraApp>(async (resolve, reject) => {
    if (terraApp) {
      console.log(1)
      const result = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
      console.log(2, result)
      if (result.bech32_address) {
        resolve(terraApp)
        return
      } else if (deviceId) {
        console.log(3)
        const transport = await TransportBLE.open(deviceId)
        console.log(4)
        terraApp = new TerraApp(transport)
        console.log(5)
        const result2 = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
        console.log(6, result2)
        if (result2.bech32_address) {
          resolve(terraApp)
          return
        }
      }
    }
    console.log(7)
    const observe = TransportBLE.observeState({
      next: (e: any) => {
        console.log(8, e)
        observe.unsubscribe()
        if (!e.available) {
          reject(e)
        } else {
          const subscription = TransportBLE.listen({
            next: async (e: any) => {
              console.log(9, e)
              subscription.unsubscribe()
              if (e.type === 'add') {
                try {
                  deviceId = e.descriptor.id
                  const transport = await TransportBLE.open(deviceId)
                  console.log(10)
                  terraApp = new TerraApp(transport)
                  console.log(11)
                  const result = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
                  console.log(12, result)
                  if (!result.bech32_address) {
                    throw new Error(result.error_message)
                  }
                  resolve(terraApp)
                } catch (err) {
                  reject(err)
                }
              }
            },
            complete: (e: any) => {
              console.log(e)
              observe.unsubscribe()
              subscription.unsubscribe()
            },
            error: async (err: any) => {
              observe.unsubscribe()
              subscription.unsubscribe()
              reject(err)
            },
          })
        }
      },
      complete: () => {
        observe.unsubscribe()
      },
      error: async (err: any) => {
        observe.unsubscribe()
        reject(err)
      },
    })
  })

export default connectLedger
