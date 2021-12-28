import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import TerraApp from '@terra-money/ledger-terra-js'
import { deafultHdPath, defaultPrefix } from './terraConfig'

let terraApp: TerraApp
let deviceId: string

const connectLedger = () =>
  new Promise<TerraApp>(async (resolve, reject) => {
    if (terraApp) {
      const result = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
      if (result.bech32_address) {
        resolve(terraApp)
        return
      } else if (deviceId) {
        const transport = await TransportBLE.open(deviceId)
        terraApp = new TerraApp(transport)
        const result2 = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
        if (result2.bech32_address) {
          resolve(terraApp)
          return
        }
      }
    }
    const observe = TransportBLE.observeState({
      next: (e: any) => {
        observe.unsubscribe()
        if (!e.available) {
          reject(e)
        } else {
          const subscription = TransportBLE.listen({
            next: async (e: any) => {
              subscription.unsubscribe()
              if (e.type === 'add') {
                try {
                  deviceId = e.descriptor.id
                  const transport = await TransportBLE.open(deviceId)
                  terraApp = new TerraApp(transport)
                  const result = await terraApp.getAddressAndPubKey(deafultHdPath, defaultPrefix)
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
