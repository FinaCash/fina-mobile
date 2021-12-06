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
      }
    }
    const observe = TransportBLE.observeState({
      next: (e: any) => {
        console.log(e)
        observe.unsubscribe()
        if (!e.available) {
          reject(e)
        } else {
          const subscription = TransportBLE.listen({
            next: async (e: any) => {
              subscription.unsubscribe()
              if (e.type === 'add') {
                try {
                  const transport = await TransportBLE.open(e.descriptor.id)
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
