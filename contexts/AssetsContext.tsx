import React from 'react'
import { Coin, MsgSwap, RawKey } from '@terra-money/terra.js'
import get from 'lodash/get'
import terra from '../utils/terraClient'
import openlogin from '../utils/torusClient'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset } from '../types/assets'
import { AnchorEarn, CHAINS, NETWORKS, DENOMS } from '@anchor-protocol/anchor-earn'

const getPrivKey = (privKey: string) => Buffer.from(privKey.slice(0, 32), 'utf8')

interface AssetsState {
  address: string
  assets: Asset[]
  swap(from: Coin, to: Coin): void
  depositSavings(amount: number): void
  withdrawSavings(amount: number): void
}

const initialState: AssetsState = {
  address: '',
  assets: [],

  swap: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress] = React.useState(initialState.address)
  const [assets, setAssets] = React.useState<Asset[]>(initialState.assets)

  const fetchAssets = React.useCallback(async () => {
    const key = new RawKey(getPrivKey(openlogin.privKey))
    const balances = await terra.bank.balance(key.accAddress)
    setAddress(key.accAddress)
    setAssets(transformCoinsToAssets(JSON.parse(balances.toJSON())))
  }, [])

  const initialize = React.useCallback(async () => {
    await openlogin.init()
    const store = get(openlogin, 'state.store.storage.openlogin_store', {})
    const loginProvider = JSON.parse(store).typeOfLogin
    if (openlogin.privKey) {
      fetchAssets()
    } else if (loginProvider) {
      // Logged in previously
      await openlogin.login({
        loginProvider,
        fastLogin: true,
        // relogin: true,
      })
    } else {
      // Not logged in
      await openlogin.login()
    }
  }, [fetchAssets])

  React.useEffect(() => {
    initialize()
  }, [initialize])

  const swap = React.useCallback(
    async (from: Coin, to: Coin) => {
      const key = new RawKey(getPrivKey(openlogin.privKey))
      const wallet = terra.wallet(key)
      const msg = new MsgSwap(key.accAddress, from, to.denom)
      // const rate = await terra.market.swapRate(new Coin('uluna', '1'), from.denom)
      const tx = await wallet.createAndSignTx({
        msgs: [msg],
        // TODO: some currencies not accepted as gas fee
        // feeDenoms: [from.denom],
        // gasPrices: {
        //   [from.denom]:
        //     rate.amount.toNumber() * Number(get(terra, 'config.gasPrices.uluna', '0.15')),
        // },
      })
      const result = await terra.tx.broadcast(tx)
      fetchAssets()
      return result
    },
    [fetchAssets]
  )

  const depositSavings = React.useCallback(async (amount: number) => {
    const anchorEarn = new AnchorEarn({
      chain: CHAINS.TERRA,
      network: NETWORKS.TEQUILA_0004,
      privateKey: getPrivKey(openlogin.privKey),
    })
    const deposit = await anchorEarn.deposit({
      amount: amount.toString(),
      currency: DENOMS.UST,
    })
    return deposit
  }, [])

  const withdrawSavings = React.useCallback(async (amount: number) => {
    const anchorEarn = new AnchorEarn({
      chain: CHAINS.TERRA,
      network: NETWORKS.TEQUILA_0004,
      privateKey: getPrivKey(openlogin.privKey),
    })
    const withdraw = await anchorEarn.withdraw({
      amount: amount.toString(),
      currency: DENOMS.UST,
    })
    return withdraw
  }, [])

  return (
    <AssetsContext.Provider
      value={{
        address,
        assets,
        swap,
        depositSavings,
        withdrawSavings,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

const useAssetsContext = (): AssetsState => React.useContext(AssetsContext)

export { AssetsProvider, useAssetsContext }
