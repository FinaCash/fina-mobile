import React from 'react'
import { Coin, MsgSwap, MnemonicKey } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import get from 'lodash/get'
import terra from '../utils/terraClient'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset } from '../types/assets'
import { AnchorEarn, CHAINS, NETWORKS, DENOMS } from '@anchor-protocol/anchor-earn'
import usePersistedState from '../utils/usePersistedState'

interface AssetsState {
  address: string
  assets: Asset[]
  loaded: boolean
  login(secretPhrase: string, password: string): void
  swap(from: Coin, to: Coin, password: string): void
  depositSavings(amount: number, password: string): void
  withdrawSavings(amount: number, password: string): void
}

const initialState: AssetsState = {
  address: '',
  assets: [],
  loaded: false,
  login: () => null,
  swap: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address, {
    secure: true,
  })
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

  const fetchAssets = React.useCallback(async () => {
    const balances = await terra.bank.balance(address)
    const anchorEarn = new AnchorEarn({
      chain: CHAINS.TERRA,
      network: NETWORKS.TEQUILA_0004,
      address,
    })
    const userBalance = await anchorEarn.balance({
      currencies: [DENOMS.UST],
    })
    const market = await anchorEarn.market({
      currencies: [DENOMS.UST],
    })
    setAssets(
      transformCoinsToAssets([
        ...JSON.parse(balances.toJSON()),
        {
          denom: 'ausd',
          amount: (
            Number(get(userBalance, 'total_deposit_balance_in_ust', '0')) *
            10 ** 6
          ).toString(),
          apy: Number(get(market, 'markets[0].APY', 0)),
        },
      ])
    )
  }, [address, setAssets])

  React.useEffect(() => {
    if (address) {
      fetchAssets()
    }
  }, [address])

  const login = React.useCallback(
    async (secretPhrase: string, password: string) => {
      const key = new MnemonicKey({ mnemonic: secretPhrase })
      setAddress(key.accAddress)
      setEncryptedSecretPhrase(CryptoJS.AES.encrypt(secretPhrase, password).toString())
    },
    [setAddress, setEncryptedSecretPhrase]
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
      console.log(result)
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
        loaded,
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
