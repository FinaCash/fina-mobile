/* eslint-disable no-undef */
import TerraApp from '@terra-money/ledger-terra-js'
import { CreateTxOptions, Key, PublicKey, SignatureV2, Wallet } from '@terra-money/terra.js'
import { Actions } from 'react-native-router-flux'
import { WalletTypes } from '../types/assets'
import { defaultPrefix, terraLCDClient } from './terraConfig'
import LedgerKey from './LedgerKey'

const sortedObject: any = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(sortedObject)
  }
  const sortedKeys = Object.keys(obj).sort()
  const result: any = {}
  // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
  sortedKeys.forEach((key) => {
    result[key] = sortedObject(obj[key])
  })
  return result
}

export const getPasswordOrLedgerApp = (
  onSubmit: (password?: string, terraApp?: TerraApp) => Promise<void>,
  type: WalletTypes
) => {
  if (type === 'ledger') {
    Actions.ConnectLedger({ onSubmit: (terraApp: TerraApp) => onSubmit('', terraApp) })
  } else {
    Actions.Password({ onSubmit: (password: string) => onSubmit(password) })
  }
}

const signAndBroadcastTx = async (
  mnemonicKey: Key,
  terraApp: TerraApp | undefined,
  hdPath: number[],
  options: CreateTxOptions,
  address: string,
  simulate?: boolean
) => {
  let key: Key = mnemonicKey
  if (terraApp) {
    const pubkeyResponse = await terraApp.getAddressAndPubKey(hdPath, defaultPrefix)
    const pk = Buffer.from(pubkeyResponse.compressed_pk as any)
    const publicKey = PublicKey.fromAmino({
      type: 'tendermint/PubKeySecp256k1',
      value: pk.toString('base64'),
    })
    key = new LedgerKey(publicKey, terraApp, hdPath, defaultPrefix)
  }
  const wallet = new Wallet(terraLCDClient, key)
  if (simulate) {
    const tx = await wallet.createTx(options, address)
    return tx
  }
  const signedTx = await wallet.createAndSignTx(
    terraApp ? { ...options, signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON } : options
  )
  const result = await terraLCDClient.tx.broadcast(signedTx)
  if (result.height === 0 || !result.raw_log.match(/^\[/)) {
    throw new Error(result.raw_log)
  }
  return result
}

export default signAndBroadcastTx
