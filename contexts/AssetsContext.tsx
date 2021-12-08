import React from 'react'
import {
  Coin,
  MsgSwap,
  MnemonicKey,
  MsgSend,
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
  MsgWithdrawDelegatorReward,
} from '@terra-money/terra.js'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import {
  terraLCDClient as terra,
  mirrorOptions,
  anchorClient,
  supportedTokens,
  anchorAddressProvider,
} from '../utils/terraConfig'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset, AssetTypes, AvailableAsset, BorrowInfo } from '../types/assets'
import {
  COLLATERAL_DENOMS,
  fabricateTerraswapSwapbLuna,
  fabricateTerraswapSwapLuna,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js'
import usePersistedState from '../utils/usePersistedState'
import {
  fetchAassetRate,
  fetchAnchorBalances,
  fetchAnchorCollaterals,
  fetchAvailableCollaterals,
  fetchAvailableCurrencies,
  fetchAvailableMirrorAssets,
  fetchMirrorBalance,
} from '../utils/fetches'
import sortBy from 'lodash/sortBy'
import { useAccountsContext } from './AccountsContext'
import signAndBroadcastTx from '../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'

interface AssetsState {
  assets: Asset[]
  fetchAssets(): void
  availableAssets: AvailableAsset[]
  availableCurrencies: string[]
  borrowInfo: BorrowInfo
  swap(
    from: { denom: string; amount: number },
    toDenom: string,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  send(
    coin: { denom: string; amount: number },
    address: string,
    memo: string,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  depositSavings(
    market: MARKET_DENOMS,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  withdrawSavings(
    market: MARKET_DENOMS,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  borrow(
    market: MARKET_DENOMS,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  repay(
    market: MARKET_DENOMS,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  claimBorrowRewards(
    market: MARKET_DENOMS,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  provideCollateral(
    market: MARKET_DENOMS,
    symbol: string,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  withdrawCollateral(
    market: MARKET_DENOMS,
    symbol: string,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  stake(
    coin: { denom: string; amount: number },
    validator: string,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  redelegate(
    coin: { denom: string; amount: number },
    fromValidator: string,
    toValidator: string,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  unstake(
    coin: { denom: string; amount: number },
    validator: string,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  claimStakingRewards(
    validators: string[],
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
}

const initialState: AssetsState = {
  assets: [],
  fetchAssets: () => null,
  availableAssets: [],
  availableCurrencies: ['uusd'],
  borrowInfo: {
    collateralValue: 0,
    borrowLimit: 0,
    borrowedValue: 0,
    borrowRate: 0,
    rewardsRate: 0,
    pendingRewards: 0,
  },
  swap: () => null,
  send: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
  borrow: () => null,
  repay: () => null,
  claimBorrowRewards: () => null,
  provideCollateral: () => null,
  withdrawCollateral: () => null,
  stake: () => null,
  unstake: () => null,
  redelegate: () => null,
  claimStakingRewards: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const { decryptSeedPhrase, address, hdPath } = useAccountsContext()
  const [assets, setAssets] = usePersistedState<Asset[]>('assets', initialState.assets)
  const [availableAssets, setAvailableAssets] = usePersistedState<AvailableAsset[]>(
    'availableAssets',
    initialState.availableAssets
  )
  const [availableCurrencies, setAvailableCurrencies] = usePersistedState<string[]>(
    'availableCurrencies',
    initialState.availableCurrencies
  )
  const [borrowInfo, setBorrowInfo] = usePersistedState<BorrowInfo>(
    'borrowInfo',
    initialState.borrowInfo
  )

  const fetchAssets = React.useCallback(async () => {
    // Fetch available assets
    const mAssets = await fetchAvailableMirrorAssets()
    const availableCollaterals = await fetchAvailableCollaterals()
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
        // priceHistories: [],
        ...result,
      })
    }
    const availableResult = sortBy(
      [...tokenAssets, ...mAssets, ...availableCollaterals],
      ['-type', 'symbol']
    )
    setAvailableAssets(availableResult)
    const currenciesResult = await fetchAvailableCurrencies()
    setAvailableCurrencies(currenciesResult)
    // Fetch my assets
    const balances = await terra.bank.balance(address)
    const anchorBalances = await fetchAnchorBalances(address)
    const mAssetsBalances = await fetchMirrorBalance(address)
    const { collaterals, ...borrowInfoResult } = await fetchAnchorCollaterals(address)
    const result = await transformCoinsToAssets(
      [...JSON.parse(balances[0].toJSON()), ...anchorBalances, ...mAssetsBalances, ...collaterals],
      availableResult
    )
    setAssets(
      sortBy(result, [
        (r) => {
          switch (r.type) {
            case AssetTypes.Currents:
              return 0
            case AssetTypes.Savings:
              return 1
            case AssetTypes.Tokens:
              return 2
            case AssetTypes.Investments:
              return 3
            case AssetTypes.Collaterals:
              return 4
          }
        },
        'symbol',
      ])
    )
    setBorrowInfo(borrowInfoResult)
  }, [address, setAssets, setBorrowInfo, setAvailableAssets, setAvailableCurrencies])

  React.useEffect(() => {
    if (address) {
      fetchAssets()
    }
  }, [address])

  const swap = React.useCallback(
    async (
      from: { denom: string; amount: number },
      toDenom: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const mAssets = availableAssets.filter(
        (a) => a.type === AssetTypes.Investments || a.symbol === 'MIR'
      )
      let msg
      // Buy Collateral
      if (toDenom.match(/^B/)) {
        msg = fabricateTerraswapSwapLuna({
          address,
          amount: String(from.amount),
          denom: from.denom,
        })(anchorAddressProvider)[0]
        // Sell Collateral
      } else if (from.denom.match(/^B/)) {
        msg = fabricateTerraswapSwapbLuna({
          address,
          amount: String(from.amount),
        })(anchorAddressProvider)[0]
        // Buy ANC
      } else if (toDenom === 'ANC') {
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
        // Native
      } else {
        msg = new MsgSwap(
          address,
          new Coin(from.denom, (Number(from.amount) * 10 ** 6).toString()),
          toDenom
        )
      }
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: [msg as any] },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, availableAssets, address, hdPath]
  )

  const send = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      toAddress: string,
      memo: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        {
          msgs: [new MsgSend(address, toAddress, { [coin.denom]: coin.amount * 10 ** 6 })],
          memo,
        },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath]
  )

  const depositSavings = React.useCallback(
    async (
      market: MARKET_DENOMS,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.earn.depositStable({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const withdrawSavings = React.useCallback(
    async (
      market: MARKET_DENOMS,
      amountInBase: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const rate = await fetchAassetRate(market)
      const amount = amountInBase / rate
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.earn.withdrawStable({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const borrow = React.useCallback(
    async (
      market: MARKET_DENOMS,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.borrow.borrow({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const repay = React.useCallback(
    async (
      market: MARKET_DENOMS,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.borrow.repay({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const claimBorrowRewards = React.useCallback(
    async (market: MARKET_DENOMS, password?: string, terraApp?: TerraApp, simulate?: boolean) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.anchorToken.claimUSTBorrowRewards({ market })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address]
  )

  const provideCollateral = React.useCallback(
    async (
      market: MARKET_DENOMS,
      symbol: string,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.borrow.provideCollateral({
        market,
        amount: String(amount),
        collateral: (COLLATERAL_DENOMS as any)[`U${symbol.toUpperCase()}`],
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const withdrawCollateral = React.useCallback(
    async (
      market: MARKET_DENOMS,
      symbol: string,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const ops = anchorClient.borrow.withdrawCollateral({
        market,
        amount: String(amount),
        collateral: (COLLATERAL_DENOMS as any)[`U${symbol.toUpperCase()}`],
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath]
  )

  const stake = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      validator: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: [new MsgDelegate(address, validator, new Coin(coin.denom, coin.amount))] },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath]
  )

  const unstake = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      validator: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        { msgs: [new MsgUndelegate(address, validator, new Coin(coin.denom, coin.amount))] },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath]
  )

  const redelegate = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      fromValidator: string,
      toValidator: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        {
          msgs: [
            new MsgBeginRedelegate(
              address,
              fromValidator,
              toValidator,
              new Coin(coin.denom, coin.amount)
            ),
          ],
        },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath]
  )

  const claimStakingRewards = React.useCallback(
    async (validators: string[], password?: string, terraApp?: TerraApp, simulate?: boolean) => {
      const key = new MnemonicKey({
        mnemonic: !password ? '' : decryptSeedPhrase(password),
      })
      const result = await signAndBroadcastTx(
        key,
        terraApp,
        hdPath,
        {
          msgs: validators.map((validator) => new MsgWithdrawDelegatorReward(address, validator)),
        },
        address,
        simulate
      )
      fetchAssets()
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath]
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
        availableAssets,
        availableCurrencies,
        borrowInfo,
        fetchAssets,
        swap,
        send,
        depositSavings,
        withdrawSavings,
        borrow,
        repay,
        claimBorrowRewards,
        provideCollateral,
        withdrawCollateral,
        stake,
        unstake,
        redelegate,
        claimStakingRewards,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

const useAssetsContext = (): AssetsState => React.useContext(AssetsContext)

export { AssetsProvider, useAssetsContext }
