import React from 'react'
import { Coin, MsgSwap, MnemonicKey, MsgSend, Wallet } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import {
  terraLCDClient as terra,
  mirrorOptions,
  anchorClient,
  supportedTokens,
} from '../utils/terraConfig'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset, AssetTypes, AvailableAsset } from '../types/assets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'
import { useSettingsContext } from './SettingsContext'
import {
  fetchAnchorBalances,
  fetchAvailableCurrencies,
  fetchAvailableMirrorAssets,
  fetchCoingeckoPrice,
  fetchMirrorBalance,
} from '../utils/fetches'

interface AssetsState {
  address: string
  assets: Asset[]
  availableAssets: AvailableAsset[]
  availableCurrencies: string[]
  loaded: boolean
  login(secretPhrase: string, password: string): void
  logout(): void
  swap(
    from: { denom: string; amount: number },
    toDenom: string,
    password: string,
    simulate?: boolean
  ): void
  send(
    coin: { denom: string; amount: number },
    address: string,
    memo: string,
    password: string,
    simulate?: boolean
  ): void
  depositSavings(market: MARKET_DENOMS, amount: number, password: string): void
  withdrawSavings(market: MARKET_DENOMS, amount: number, password: string): void
}

const initialState: AssetsState = {
  address: '',
  assets: [],
  availableAssets: [],
  availableCurrencies: ['uusd'],
  loaded: false,
  login: () => null,
  logout: () => null,
  swap: () => null,
  send: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
}

const decryptMnemonic = (encryptedSecretPhrase: string, password: string) => {
  try {
    const mnemonic = CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(
      CryptoJS.enc.Utf8
    )
    if (!mnemonic) {
      throw new Error('incorrect password')
    }
    return mnemonic
  } catch (err) {
    throw new Error('incorrect password')
  }
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address)
  const [assets, setAssets] = usePersistedState<Asset[]>('assets', initialState.assets)
  const [availableAssets, setAvailableAssets] = React.useState<AvailableAsset[]>(
    initialState.availableAssets
  )
  const [availableCurrencies, setAvailableCurrencies] = React.useState<string[]>(
    initialState.availableCurrencies
  )
  const [encryptedSecretPhrase, setEncryptedSecretPhrase] = usePersistedState(
    'encryptedSecretPhrase',
    '',
    {
      secure: true,
    }
  )
  const { currency } = useSettingsContext()

  const fetchAssets = React.useCallback(async () => {
    const balances = await terra.bank.balance(address)
    const anchorBalances = await fetchAnchorBalances(address)
    const mAssetsBalances = await fetchMirrorBalance(address)
    const result = await transformCoinsToAssets(
      [...JSON.parse(balances.toJSON()), ...anchorBalances, ...mAssetsBalances],
      availableAssets,
      currency
    )
    setAssets(result)
  }, [address, setAssets, fetchMirrorBalance, availableAssets, currency])

  React.useEffect(() => {
    if (address && availableAssets) {
      fetchAssets()
    }
  }, [address, availableAssets])

  React.useEffect(() => {
    fetchAvailableMirrorAssets().then(async (mAssets) => {
      const tokens = Object.values(supportedTokens).filter(
        (t) => !mAssets.find((m: any) => m.symbol === t.symbol)
      )
      const tokenAssets = []
      for (let i = 0; i < tokens.length; i += 1) {
        const price = await fetchCoingeckoPrice(tokens[i].coingeckoId)
        tokenAssets.push({
          type: AssetTypes.Tokens,
          name: tokens[i].name,
          symbol: tokens[i].symbol,
          image: tokens[i].image,
          description: '',
          price: price.usd * 10 ** 6,
          prevPrice: (price.usd * 10 ** 6) / (1 + price.usd_24h_change / 100),
          priceHistories: [],
        })
      }
      setAvailableAssets([...tokenAssets, ...mAssets])
    })
    fetchAvailableCurrencies().then(setAvailableCurrencies)
  }, [])

  const login = React.useCallback(
    async (secretPhrase: string, password: string) => {
      const key = new MnemonicKey({ mnemonic: secretPhrase })
      setAddress(key.accAddress)
      setEncryptedSecretPhrase(CryptoJS.AES.encrypt(secretPhrase, password).toString())
    },
    [setAddress, setEncryptedSecretPhrase]
  )

  const logout = React.useCallback(() => {
    setAddress(initialState.address)
    setAssets(initialState.assets)
    setEncryptedSecretPhrase('')
    Actions.reset('Login')
  }, [])

  const swap = React.useCallback(
    async (
      from: { denom: string; amount: number },
      toDenom: string,
      password: string,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = terra.wallet(key)
      const mAssets = availableAssets.filter(
        (a) => a.type === AssetTypes.Investments || a.symbol === 'MIR'
      )
      let msg
      // Buy mAsset
      if (mAssets.find((a) => a.symbol === toDenom)) {
        const mirror = new Mirror({ ...mirrorOptions, key })
        msg = mirror.assets[toDenom].pair.swap(
          {
            amount: (Number(from.amount) * 10 ** 6).toString(),
            info: UST,
          },
          {}
        )
        // Sell mAsset
      } else if (mAssets.find((a) => a.symbol === from.denom)) {
        const mirror = new Mirror({ ...mirrorOptions, key })
        msg = mirror.assets[from.denom].pair.swap(
          {
            amount: (Number(from.amount) * 10 ** 6).toString(),
            info: {
              token: {
                contract_addr: mirror.assets[from.denom].token.contractAddress as string,
              },
            },
          },
          {}
        )
      } else {
        msg = new MsgSwap(
          address,
          new Coin(from.denom, (Number(from.amount) * 10 ** 6).toString()),
          toDenom
        )
      }
      if (simulate) {
        const tx = await wallet.createTx({
          msgs: [msg],
          gasAdjustment: 1.5,
        })
        return tx
      }
      const tx = await wallet.createAndSignTx({
        msgs: [msg],
        gasAdjustment: 1.5,
      })
      const result = await terra.tx.broadcast(tx)
      fetchAssets()
      return result
    },
    [fetchAssets, encryptedSecretPhrase, availableAssets, address]
  )

  const send = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      toAddress: string,
      memo: string,
      password: string,
      simulate?: boolean
    ) => {
      const msg = new MsgSend(address, toAddress, { [coin.denom]: coin.amount * 10 ** 6 })
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = terra.wallet(key)
      if (simulate) {
        const tx = await wallet.createTx({
          msgs: [msg],
          gasAdjustment: 1.5,
        })
        return tx
      }
      const tx = await wallet.createAndSignTx({
        msgs: [msg],
        gasAdjustment: 1.5,
        memo,
      })
      const result = await terra.tx.broadcast(tx)
      fetchAssets()
      return result
    },
    [fetchAssets, encryptedSecretPhrase, address]
  )

  const depositSavings = React.useCallback(
    async (market: MARKET_DENOMS, amount: number, password: string) => {
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = new Wallet(terra, key)
      const deposit = await anchorClient.earn
        .depositStable({ market, amount: String(amount) })
        .execute(wallet as any, {})
      fetchAssets()
      return deposit
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  const withdrawSavings = React.useCallback(
    async (market: MARKET_DENOMS, amount: number, password: string) => {
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = new Wallet(terra, key)
      const withdraw = await anchorClient.earn
        .withdrawStable({ market, amount: String(amount) })
        .execute(wallet as any, {})
      fetchAssets()
      return withdraw
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  return (
    <AssetsContext.Provider
      value={{
        address,
        assets,
        availableAssets,
        availableCurrencies,
        loaded,
        login,
        logout,
        swap,
        send,
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
