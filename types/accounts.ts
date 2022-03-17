import { WalletTypes } from './assets'

export interface Account {
  id: string
  name: string
  address: string
  hdPath: number[]
  type: WalletTypes
  encryptedSeedPhrase: string
}
