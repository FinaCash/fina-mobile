import React from 'react'
import { Coin, MsgSwap, MnemonicKey } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import terra from '../utils/terraClient'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset } from '../types/assets'
import { AnchorEarn, CHAINS, NETWORKS, DENOMS } from '@anchor-protocol/anchor-earn'
import usePersistedState from '../utils/usePersistedState'

interface AssetsState {
  address: string
  assets: Asset[]
  login(secretPhrase: string, password: string): void
  swap(from: Coin, to: Coin, password: string): void
  depositSavings(amount: number, password: string): void
  withdrawSavings(amount: number, password: string): void
}

const initialState: AssetsState = {
  address: '',
  assets: [],
  login: () => null,
  swap: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress] = usePersistedState('address', initialState.address, { secure: true })
  const [assets, setAssets] = usePersistedState<Asset[]>('assets', initialState.assets, {
    secure: true,
  })
  const [encryptedSecretPhrase, setEncryptedSecretPhrase] = usePersistedState(
    'encryptedSecretPhrase',
    '',
    {
      secure: true,
    }
  )

  const fetchAssets = React.useCallback(
    async (defaultAddress?: string) => {
      const balances = await terra.bank.balance(defaultAddress || address)
      setAssets(transformCoinsToAssets(JSON.parse(balances.toJSON())))
    },
    [address, setAssets]
  )

  const login = React.useCallback(
    async (secretPhrase: string, password: string) => {
      const key = new MnemonicKey({ mnemonic: secretPhrase })
      setAddress(key.accAddress)
      setEncryptedSecretPhrase(CryptoJS.AES.decrypt(secretPhrase, password).toString())
      await fetchAssets(key.accAddress)
    },
    [setAddress, setEncryptedSecretPhrase, fetchAssets]
  )

  const swap = React.useCallback(
    async (from: Coin, to: Coin, password: string) => {
      const key = new MnemonicKey({
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
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
    [fetchAssets, encryptedSecretPhrase]
  )

  const depositSavings = React.useCallback(
    async (amount: number, password: string) => {
      const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.TEQUILA_0004,
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const deposit = await anchorEarn.deposit({
        amount: amount.toString(),
        currency: DENOMS.UST,
      })
      return deposit
    },
    [encryptedSecretPhrase]
  )

  const withdrawSavings = React.useCallback(
    async (amount: number, password: string) => {
      const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.TEQUILA_0004,
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const withdraw = await anchorEarn.withdraw({
        amount: amount.toString(),
        currency: DENOMS.UST,
      })
      return withdraw
    },
    [encryptedSecretPhrase]
  )

  return (
    <AssetsContext.Provider
      value={{
        address,
        assets,
        login,
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
