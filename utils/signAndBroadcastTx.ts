import { CreateTxOptions, Key, Wallet } from '@terra-money/terra.js'
import { terraLCDClient } from './terraConfig'

const signAndBroadcastTx = async (
  key: Key,
  options: CreateTxOptions,
  address: string,
  simulate?: boolean
) => {
  const wallet = new Wallet(terraLCDClient, key)
  if (simulate) {
    const tx = await wallet.createTx(options, address)
    return tx
  }
  const signedTx = await wallet.createAndSignTx(options)
  const result = await terraLCDClient.tx.broadcast(signedTx)
  if (result.height === 0 || !result.raw_log.match(/^\[/)) {
    throw new Error(result.raw_log)
  }
  return result
}

export default signAndBroadcastTx
