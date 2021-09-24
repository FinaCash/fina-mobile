import React from 'react'
import { Coin, MsgSwap, MnemonicKey, MsgSend, Wallet } from '@terra-money/terra.js'
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
import { useSettingsContext } from './SettingsContext'
import {
  fetchAassetRate,
  fetchAnchorBalances,
  fetchAvailableCurrencies,
  fetchAvailableMirrorAssets,
  fetchMirrorBalance,
} from '../utils/fetches'
import sortBy from 'lodash/sortBy'
import { useAccountsContext } from './AccountsContext'

interface AssetsState {
  assets: Asset[]
  fetchAssets(): void
  availableAssets: AvailableAsset[]
  availableCurrencies: string[]
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
  depositSavings(market: MARKET_DENOMS, amount: number, password: string, simulate?: boolean): void
  withdrawSavings(market: MARKET_DENOMS, amount: number, password: string, simulate?: boolean): void
}

const initialState: AssetsState = {
  assets: [],
  fetchAssets: () => null,
  availableAssets: [],
  availableCurrencies: ['uusd'],
  swap: () => null,
  send: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const { decryptSecretPhrase, address } = useAccountsContext()
  const [assets, setAssets] = usePersistedState<Asset[]>('assets', initialState.assets)
  const [availableAssets, setAvailableAssets] = usePersistedState<AvailableAsset[]>(
    'availableAssets',
    initialState.availableAssets
  )
  const [availableCurrencies, setAvailableCurrencies] = usePersistedState<string[]>(
    'availableCurrencies',
    initialState.availableCurrencies
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
    setAssets(sortBy(result, ['type', 'symbol']))
  }, [address, setAssets, availableAssets, currency])

  React.useEffect(() => {
    if (address && availableAssets) {
      fetchAssets()
    }
  }, [address, availableAssets, currency])

  React.useEffect(() => {
    fetchAvailableMirrorAssets().then(async (mAssets) => {
      const tokens = Object.values(supportedTokens).filter(
        (t) => !mAssets.find((m: any) => m.symbol === t.symbol)
      )
      const tokenAssets = []
      for (let i = 0; i < tokens.length; i += 1) {
        const result = await tokens[i].priceFetcher()
        tokenAssets.push({
          type: AssetTypes.Tokens,
          name: tokens[i].name,
          symbol: tokens[i].symbol,
          coin: { denom: tokens[i].denom },
          image: tokens[i].image,
          description: '',
          priceHistories: [],
          ...result,
        })
      }
      setAvailableAssets(sortBy([...tokenAssets, ...mAssets], ['-type', 'symbol']))
    })
    fetchAvailableCurrencies().then(setAvailableCurrencies)
  }, [])

  const swap = React.useCallback(
    async (
      from: { denom: string; amount: number },
      toDenom: string,
      password: string,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptSecretPhrase(password),
      })
      const wallet = terra.wallet(key)
      const mAssets = availableAssets.filter(
        (a) => a.type === AssetTypes.Investments || a.symbol === 'MIR'
      )
      let msg
      // Buy ANC
      if (toDenom === 'ANC') {
        msg = (
          await anchorClient.anchorToken.buyANC(String(from.amount)).generateWithAddress(address)
        )[0]
        // Sell ANC
      } else if (from.denom === 'ANC') {
        msg = (
          await anchorClient.anchorToken.sellANC(String(from.amount)).generateWithAddress(address)
        )[0]
        // Buy mAsset
      } else if (mAssets.find((a) => a.symbol === toDenom)) {
        const mirror = new Mirror({ ...mirrorOptions, key })
        msg = mirror.assets[toDenom].pair.swap(
          {
            amount: (Number(from.amount) * 10 ** 6).toString(),
            info: UST,
          },
          {}
        )
        msg.sender = address
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
        msg.sender = address
      } else {
        msg = new MsgSwap(
          address,
          new Coin(from.denom, (Number(from.amount) * 10 ** 6).toString()),
          toDenom
        )
      }
      if (simulate) {
        const tx = await wallet.createTx({
          msgs: [msg as any],
        })
        return tx
      }
      const tx = await wallet.createAndSignTx({
        msgs: [msg as any],
      })
      const result = await terra.tx.broadcast(tx)
      if (result.height === 0 || !result.raw_log.match(/^\[/)) {
        throw new Error(result.raw_log)
      }
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSecretPhrase, availableAssets, address]
  )

  const send = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      toAddress: string,
      memo: string,
      password: string,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptSecretPhrase(password),
      })
      const wallet = terra.wallet(key)
      const rawtx = {
        msgs: [new MsgSend(address, toAddress, { [coin.denom]: coin.amount * 10 ** 6 })],
        memo,
      }
      if (simulate) {
        const tx = await wallet.createTx(rawtx)
        return tx
      }
      const tx = await wallet.createAndSignTx(rawtx)
      const result = await terra.tx.broadcast(tx)
      if (result.height === 0 || !result.raw_log.match(/^\[/)) {
        throw new Error(result.raw_log)
      }
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSecretPhrase, address]
  )

  const depositSavings = React.useCallback(
    async (market: MARKET_DENOMS, amount: number, password: string, simulate?: boolean) => {
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptSecretPhrase(password),
      })
      const wallet = new Wallet(terra, key)
      const ops = anchorClient.earn.depositStable({ market, amount: String(amount) })
      if (simulate) {
        const tx = await wallet.createTx({
          msgs: ops.generateWithAddress(address) as any,
        })
        return tx
      }
      const result = await ops.execute(wallet as any, {})
      if (result.height === 0 || !result.raw_log.match(/^\[/)) {
        throw new Error(result.raw_log)
      }
      fetchAssets()
      return result
    },
    [decryptSecretPhrase, fetchAssets, address]
  )

  const withdrawSavings = React.useCallback(
    async (market: MARKET_DENOMS, amountInBase: number, password: string, simulate?: boolean) => {
      const rate = await fetchAassetRate(market)
      const amount = amountInBase / rate
      const key = new MnemonicKey({
        mnemonic: simulate ? '' : decryptSecretPhrase(password),
      })
      const wallet = new Wallet(terra, key)
      const ops = anchorClient.earn.withdrawStable({ market, amount: String(amount) })
      if (simulate) {
        const tx = await wallet.createTx({
          msgs: ops.generateWithAddress(address) as any,
        })
        return tx
      }
      const result = await ops.execute(wallet as any, {})
      if (result.height === 0 || !result.raw_log.match(/^\[/)) {
        throw new Error(result.raw_log)
      }
      fetchAssets()
      return result
    },
    [decryptSecretPhrase, fetchAssets, address]
  )

  // On logout
  React.useEffect(() => {
    if (!address) {
      setAssets(initialState.assets)
      setAvailableAssets(initialState.availableAssets)
      setAvailableCurrencies(initialState.availableCurrencies)
    }
  }, [address, setAssets, setAvailableAssets, setAvailableCurrencies])

  return (
    <AssetsContext.Provider
      value={{
        assets,
        fetchAssets,
        availableAssets,
        availableCurrencies,
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
