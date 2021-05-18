import React from 'react'
import { RawKey } from '@terra-money/terra.js'
import get from 'lodash/get'
import terra, { terraApiRequester } from '../utils/terraClient'
import openlogin from '../utils/torusClient'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset } from '../types/assets'

const getPrivKey = (privKey: string) => Buffer.from(privKey.slice(0, 32), 'utf8')

interface AssetsState {
  address: string
  assets: Asset[]
}

const initialState: AssetsState = {
  address: '',
  assets: [],
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress] = React.useState(initialState.address)
  const [assets, setAssets] = React.useState<Asset[]>(initialState.assets)

  const fetchAssets = React.useCallback(async (privKey: Buffer) => {
    const wallet = new RawKey(privKey)
    const balances = await terra.bank.balance(wallet.accAddress)
    setAddress(wallet.accAddress)
    setAssets(transformCoinsToAssets(JSON.parse(balances.toJSON())))
  }, [])

  const login = React.useCallback(
    async (provider: string) => {
      await openlogin.login({
        loginProvider: provider,
        fastLogin: true,
      })
    },
    [fetchAssets]
  )

  const initialize = React.useCallback(async () => {
    await openlogin.init()
    const store = get(openlogin, 'state.store.storage.openlogin_store', {})
    const loginProvider = JSON.parse(store).typeOfLogin
    if (openlogin.privKey) {
      fetchAssets(getPrivKey(openlogin.privKey))
    } else if (loginProvider) {
      await openlogin.login({
        loginProvider,
        fastLogin: true,
        relogin: true,
      })
      openlogin.request
    } else {
      await openlogin.login()
    }
  }, [fetchAssets])

  React.useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <AssetsContext.Provider
      value={{
        address,
        assets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

const useAssetsContext = (): AssetsState => React.useContext(AssetsContext)

export { AssetsProvider, useAssetsContext }
