import React from 'react'
import {
  Coin,
  MsgSwap,
  MsgSend,
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
  MsgWithdrawDelegatorReward,
  MsgExecuteContract,
  MnemonicKey,
  Int,
} from '@terra-money/terra.js'
import { Mirror, MirrorAirdrop, UST } from '@mirror-protocol/mirror.js'
import base64 from 'react-native-base64'
import {
  terraLCDClient as terra,
  mirrorOptions,
  anchorClient,
  supportedTokens,
  anchorAddressProvider,
  astroportGeneratorContract,
  extraterrestrialPriceApiUrl,
} from '../utils/terraConfig'
import { transformCoinsToAssets } from '../utils/transformAssets'
import {
  Asset,
  AssetTypes,
  AvailableAsset,
  BorrowInfo,
  Validator,
  StakingInfo,
  Airdrop,
  Farm,
} from '../types/assets'
import {
  COLLATERAL_DENOMS,
  fabricateAirdropClaim,
  fabricateExchangeSwapbLuna,
  fabricateExchangeSwapLuna,
  fabricateTerraswapSwapUSTbETH,
  fabricateTerraswapSwapbEth,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js'
import usePersistedState from '../utils/usePersistedState'
import {
  fetchAassetRate,
  fetchClaimableAirdrops,
  fetchAnchorBalances,
  fetchAnchorCollaterals,
  fetchAvailableCollaterals,
  fetchAvailableCurrencies,
  fetchAvailableMirrorAssets,
  fetchMirrorBalance,
  fetchLunaStakingInfo,
  fetchFarmingInfo,
} from '../utils/fetches'
import sortBy from 'lodash/sortBy'
import { useAccountsContext } from './AccountsContext'
import signAndBroadcastTx from '../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import flatten from 'lodash/flatten'
import uniqBy from 'lodash/uniqBy'
import get from 'lodash/get'

interface AssetsState {
  availableAssets: AvailableAsset[]
  assets: Asset[]
  fetchAvailableAssets(): void
  fetchFarmInfo(): void
  fetchAssets(): void
  fetchBorrowInfo(): void
  fetchStakingInfo(): void
  fetchAirdrops(): void
  availableCurrencies: { denom: string; price: number; hidden?: boolean }[]
  farmInfo: Farm[]
  borrowInfo: BorrowInfo
  stakingInfo: StakingInfo
  validators: Validator[]
  airdrops: Airdrop[]
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
  claimStakingRewards(password?: string, terraApp?: TerraApp, simulate?: boolean): void
  claimAirdrops(
    airdropsToClaim: Airdrop[],
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  provideLiquidity(
    farm: Farm,
    amount: number,
    ustAmount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  withdrawLiquidity(
    farm: Farm,
    amount: number,
    password?: string,
    terraApp?: TerraApp,
    simulate?: boolean
  ): void
  claimFarmRewards(farms: Farm[], password?: string, terraApp?: TerraApp, simulate?: boolean): void
}

const initialState: AssetsState = {
  availableAssets: [],
  assets: [],
  fetchAvailableAssets: () => null,
  fetchFarmInfo: () => null,
  fetchAssets: () => null,
  fetchBorrowInfo: () => null,
  fetchStakingInfo: () => null,
  fetchAirdrops: () => null,
  availableCurrencies: [{ denom: 'uusd', price: 1 }],
  borrowInfo: {
    collateralValue: 0,
    borrowLimit: 0,
    borrowedValue: 0,
    borrowRate: 0,
    rewardsRate: 0,
    pendingRewards: 0,
  },
  stakingInfo: {
    delegated: [],
    redelegating: [],
    unbonding: [],
    rewards: [],
    totalRewards: 0,
    stakingApr: 0,
  },
  farmInfo: [],
  validators: [],
  airdrops: [],
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
  claimAirdrops: () => null,
  provideLiquidity: () => null,
  withdrawLiquidity: () => null,
  claimFarmRewards: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const { decryptSeedPhrase, address, hdPath } = useAccountsContext()
  const [rawAssets, setRawAssets] = usePersistedState<
    { amount: string; denom: string; apr?: number; extra?: any }[]
  >('assets', [])
  const [availableAssets, setAvailableAssets] = usePersistedState<AvailableAsset[]>(
    'availableAssets',
    initialState.availableAssets
  )
  const [availableCurrencies, setAvailableCurrencies] = usePersistedState<
    { denom: string; price: number }[]
  >('availableCurrencies', initialState.availableCurrencies)
  const [farmInfo, setFarmInfo] = usePersistedState<Farm[]>('farmInfo', initialState.farmInfo)

  const assets = React.useMemo(
    () => transformCoinsToAssets(rawAssets, availableAssets, availableCurrencies),
    [rawAssets, availableAssets, availableCurrencies]
  )

  const [borrowInfo, setBorrowInfo] = usePersistedState<BorrowInfo>(
    'borrowInfo',
    initialState.borrowInfo
  )
  const [stakingInfo, setStakingInfo] = usePersistedState<StakingInfo>(
    'stakingInfo',
    initialState.stakingInfo
  )
  const [validators, setValidators] = usePersistedState<Validator[]>(
    'validators',
    initialState.validators
  )
  const [airdrops, setAirdrops] = usePersistedState<Airdrop[]>('airdrops', initialState.airdrops)

  const fetchAvailableAssets = React.useCallback(async () => {
    const mAssets = await fetchAvailableMirrorAssets()
    const availableCollaterals = await fetchAvailableCollaterals()
    const tokens = Object.values(supportedTokens)

    const tokenAssets = []
    const prices = await fetch(extraterrestrialPriceApiUrl).then((r) => r.json())
    for (let i = 0; i < tokens.length; i += 1) {
      const price = get(prices, ['prices', tokens[i].symbol, 'price'], 0)
      tokenAssets.push({
        type: AssetTypes.Tokens,
        name: tokens[i].name,
        symbol: tokens[i].symbol,
        coin: { denom: tokens[i].denom },
        image: tokens[i].image,
        price,
        prevPrice: price / (1 + get(prices, ['prices', tokens[i].symbol, 'pct_change_24h'], 0)),
      })
    }

    const availableResult = sortBy(
      [...tokenAssets, ...mAssets, ...availableCollaterals],
      ['-type', 'symbol']
    )
    setAvailableAssets(availableResult)
    const currenciesResult = await fetchAvailableCurrencies()
    setAvailableCurrencies(currenciesResult)
  }, [setAvailableAssets, setAvailableCurrencies])

  const fetchAssets = React.useCallback(async () => {
    // Fetch my assets
    const balances = await terra.bank.balance(address)
    const nativeBalances = JSON.parse(balances[0].toJSON())
    if (!nativeBalances.find((b: any) => b.denom === 'uluna')) {
      nativeBalances.push({ denom: 'uluna', amount: '0' })
    }
    const anchorBalances = await fetchAnchorBalances(address)
    const mAssetsBalances = await fetchMirrorBalance(address)
    const astroBalance = await fetch(
      `https://lcd.terra.dev/wasm/contracts/${supportedTokens.ASTRO.addresses.token}/store?query_msg={"balance":{"address":"${address}"}}`
    ).then((r) => r.json())
    setRawAssets((a) => {
      return uniqBy(
        [
          ...nativeBalances,
          ...anchorBalances,
          ...mAssetsBalances,
          { denom: 'ASTRO', amount: astroBalance.result.balance },
          ...a.filter((aa) => aa.denom.match(/^b/)), // Do not replace collaterals
        ],
        'denom'
      )
    })
  }, [address, setRawAssets])

  const fetchBorrowInfo = React.useCallback(async () => {
    const { collaterals, ...borrowInfoResult } = await fetchAnchorCollaterals(address)
    setRawAssets((a) => uniqBy([...collaterals, ...a], 'denom'))
    setBorrowInfo(borrowInfoResult)
  }, [address, setRawAssets, setBorrowInfo])

  const fetchStakingInfo = React.useCallback(async () => {
    const stakingResult = await fetchLunaStakingInfo(address)
    setValidators(stakingResult.validators)
    setStakingInfo(stakingResult.stakingInfo)
  }, [address, setValidators, setStakingInfo])

  const fetchAirdrops = React.useCallback(async () => {
    const airdropsResult = await fetchClaimableAirdrops(address)
    setAirdrops(airdropsResult)
  }, [address, setAirdrops])

  const fetchFarmInfo = React.useCallback(async () => {
    const result = await fetchFarmingInfo(address, availableAssets)
    setFarmInfo(result)
  }, [address, setFarmInfo, availableAssets])

  React.useEffect(() => {
    if (address) {
      fetchAvailableAssets()
      fetchAssets()
      fetchBorrowInfo()
      fetchStakingInfo()
      fetchAirdrops()
      fetchFarmInfo()
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
      const mAssets = availableAssets.filter(
        (a) => a.type === AssetTypes.Investments || a.symbol === 'MIR'
      )
      let msg
      // Buy Collateral
      if (toDenom.match(/^B/)) {
        msg = (toDenom === 'BLUNA' ? fabricateExchangeSwapLuna : fabricateTerraswapSwapUSTbETH)({
          address,
          amount: String(from.amount),
          denom: from.denom,
        })(anchorAddressProvider)[0]
        // Sell Collateral
      } else if (from.denom.match(/^B/)) {
        msg = (toDenom === 'BLUNA' ? fabricateExchangeSwapbLuna : fabricateTerraswapSwapbEth)({
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
        const key = new MnemonicKey()
        const mirror = new Mirror({
          ...mirrorOptions,
          key,
        })
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
        const key = new MnemonicKey()
        const mirror = new Mirror({
          ...mirrorOptions,
          key,
        })
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
      } else if (from.denom.match(/^u/) && toDenom.match(/^u/)) {
        msg = new MsgSwap(
          address,
          new Coin(from.denom, (Number(from.amount) * 10 ** 6).toString()),
          toDenom
        )
        // Buy Other Token
      } else if (from.denom === 'uusd' && Object.keys(supportedTokens).includes(toDenom)) {
        msg = new MsgExecuteContract(
          address,
          get(supportedTokens, [toDenom, 'addresses', 'pair'], ''),
          {
            swap: {
              belief_price: String(
                get(
                  availableAssets.find((a) => a.symbol === toDenom),
                  'price'
                )
              ),
              max_spread: '0.005',
              offer_asset: {
                amount: (Number(from.amount) * 10 ** 6).toFixed(0),
                info: {
                  native_token: {
                    denom: 'uusd',
                  },
                },
              },
            },
          },
          [new Coin('uusd', new Int((from.amount * 10 ** 6).toFixed(0)))]
        )
        // Sell Other Token
      } else if (toDenom === 'uusd' && Object.keys(supportedTokens).includes(from.denom)) {
        msg = new MsgExecuteContract(
          address,
          get(supportedTokens, [from.denom, 'addresses', 'token'], ''),
          {
            send: {
              amount: (Number(from.amount) * 10 ** 6).toFixed(0),
              contract: get(supportedTokens, [from.denom, 'addresses', 'pair'], ''),
              msg: base64.encode(
                `{"swap":{"max_spread":"0.005","belief_price":"${
                  1 /
                  get(
                    availableAssets.find((a) => a.symbol === from.denom),
                    'price',
                    1
                  )
                }"}}`
              ),
            },
          }
        )
      }
      console.log(msg)
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: [msg as any] },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchBorrowInfo()
      }
      return result
    },
    [fetchAssets, fetchBorrowInfo, decryptSeedPhrase, availableAssets, address, hdPath]
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
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [new MsgSend(address, toAddress, { [coin.denom]: coin.amount * 10 ** 6 })],
          memo,
        },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
      }
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
      const ops = anchorClient.earn.depositStable({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
      }
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
      const ops = anchorClient.earn.withdrawStable({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
      }
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
      const ops = anchorClient.borrow.borrow({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchBorrowInfo()
      }
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath, fetchBorrowInfo]
  )

  const repay = React.useCallback(
    async (
      market: MARKET_DENOMS,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const ops = anchorClient.borrow.repay({ market, amount: String(amount) })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchBorrowInfo()
      }
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath, fetchBorrowInfo]
  )

  const claimBorrowRewards = React.useCallback(
    async (market: MARKET_DENOMS, password?: string, terraApp?: TerraApp, simulate?: boolean) => {
      const ops = anchorClient.anchorToken.claimUSTBorrowRewards({ market })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchBorrowInfo()
      }
      return result
    },
    [decryptSeedPhrase, fetchAssets, address, hdPath, fetchBorrowInfo]
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
      const ops = anchorClient.borrow.provideCollateral({
        market,
        amount: String(amount),
        collateral: (COLLATERAL_DENOMS as any)[`U${symbol.toUpperCase()}`],
      })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchBorrowInfo()
      }
      return result
    },
    [decryptSeedPhrase, address, hdPath, fetchBorrowInfo]
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
      const ops = anchorClient.borrow.withdrawCollateral({
        market,
        amount: String(amount),
        collateral: (COLLATERAL_DENOMS as any)[`U${symbol.toUpperCase()}`],
      })
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs: ops.generateWithAddress(address) as any },
        address,
        simulate
      )
      if (!simulate) {
        fetchBorrowInfo()
      }
      return result
    },
    [decryptSeedPhrase, address, hdPath, fetchBorrowInfo]
  )

  const stake = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      validator: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [new MsgDelegate(address, validator, new Coin(coin.denom, coin.amount * 10 ** 6))],
        },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchStakingInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchStakingInfo]
  )

  const unstake = React.useCallback(
    async (
      coin: { denom: string; amount: number },
      validator: string,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [
            new MsgUndelegate(address, validator, new Coin(coin.denom, coin.amount * 10 ** 6)),
          ],
        },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchStakingInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchStakingInfo]
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
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [
            new MsgBeginRedelegate(
              address,
              fromValidator,
              toValidator,
              new Coin(coin.denom, coin.amount * 10 ** 6)
            ),
          ],
        },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchStakingInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchStakingInfo]
  )

  const claimStakingRewards = React.useCallback(
    async (password?: string, terraApp?: TerraApp, simulate?: boolean) => {
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: stakingInfo.delegated.map(
            (d) => new MsgWithdrawDelegatorReward(address, d.validator.address)
          ),
        },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchStakingInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, stakingInfo, fetchStakingInfo]
  )

  const claimAirdrops = React.useCallback(
    async (
      airdropsToClaim: Airdrop[],
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const key = new MnemonicKey()
      const msgs = flatten(
        airdropsToClaim.map((a) => {
          if (a.coin.denom === 'ANC') {
            return a.details.map(
              ({ amount, proof, stage }) =>
                fabricateAirdropClaim({ address, amount, proof: JSON.parse(proof), stage })(
                  anchorAddressProvider
                )[0]
            )
          } else {
            const mirAirdrop = new MirrorAirdrop({
              ...mirrorOptions,
              contractAddress: mirrorOptions.airdrop,
              key,
            })
            return a.details.map(({ amount, proof, stage }) =>
              mirAirdrop.claim(stage, amount, JSON.parse(proof))
            )
          }
        })
      ).map((msg) => new MsgExecuteContract(address, msg.contract, msg.execute_msg, msg.coins))
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        { msgs },
        address,
        simulate
      )
      if (!simulate) {
        fetchAssets()
        fetchAirdrops()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchAirdrops]
  )

  const provideLiquidity = React.useCallback(
    async (
      farm: Farm,
      amount: number,
      ustAmount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const isMAsset = farm.symbol.match(/^m/)

      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [
            new MsgExecuteContract(address, farm.addresses.token, {
              increase_allowance: {
                amount: (amount * 10 ** 6).toFixed(0),
                spender: isMAsset ? mirrorOptions.staking : farm.addresses.pair,
              },
            }),
            new MsgExecuteContract(
              address,
              isMAsset ? mirrorOptions.staking : farm.addresses.pair,
              {
                [isMAsset ? 'auto_stake' : 'provide_liquidity']: {
                  assets: [
                    {
                      amount: (amount * 10 ** 6).toFixed(0),
                      info: {
                        token: {
                          contract_addr: farm.addresses.token,
                        },
                      },
                    },
                    {
                      amount: (ustAmount * 10 ** 6).toFixed(0),
                      info: {
                        native_token: {
                          denom: 'uusd',
                        },
                      },
                    },
                  ],
                  slippage_tolerance: '0.01',
                  ...(isMAsset ? {} : { auto_stake: true }),
                },
              },
              [new Coin('uusd', new Int((ustAmount * 10 ** 6).toFixed(0)))]
            ),
          ],
        },
        address,
        simulate
      )

      if (!simulate) {
        fetchAssets()
        fetchFarmInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchFarmInfo]
  )

  const withdrawLiquidity = React.useCallback(
    async (
      farm: Farm,
      amount: number,
      password?: string,
      terraApp?: TerraApp,
      simulate?: boolean
    ) => {
      const isMAsset = farm.symbol.match(/^m/)

      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [
            isMAsset
              ? new MsgExecuteContract(address, mirrorOptions.staking, {
                  unbond: {
                    amount: (amount * 10 ** 6).toFixed(0),
                    asset_token: farm.addresses.token,
                  },
                })
              : new MsgExecuteContract(address, astroportGeneratorContract, {
                  withdraw: {
                    account: address,
                    amount: (amount * 10 ** 6).toFixed(0),
                    lp_token: farm.addresses.lpToken,
                  },
                }),
            new MsgExecuteContract(address, farm.addresses.lpToken, {
              send: {
                amount: (amount * 10 ** 6).toFixed(0),
                contract: farm.addresses.pair,
                msg: 'eyJ3aXRoZHJhd19saXF1aWRpdHkiOnt9fQ==',
              },
            }),
          ],
        },
        address,
        simulate
      )

      if (!simulate) {
        fetchAssets()
        fetchFarmInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchFarmInfo]
  )

  const claimFarmRewards = React.useCallback(
    async (farms: Farm[], password?: string, terraApp?: TerraApp, simulate?: boolean) => {
      const result = await signAndBroadcastTx(
        decryptSeedPhrase(password),
        terraApp,
        hdPath,
        {
          msgs: [
            ...farms
              .filter((f) => !f.symbol.match(/^m/))
              .map(
                (f) =>
                  new MsgExecuteContract(address, astroportGeneratorContract, {
                    withdraw: {
                      account: address,
                      amount: '0',
                      lp_token: f.addresses.lpToken,
                    },
                  })
              ),
            new MsgExecuteContract(address, mirrorOptions.staking, {
              withdraw: {},
            }),
          ],
        },
        address,
        simulate
      )

      if (!simulate) {
        fetchAssets()
        fetchFarmInfo()
      }
      return result
    },
    [fetchAssets, decryptSeedPhrase, address, hdPath, fetchFarmInfo]
  )

  // On logout
  React.useEffect(() => {
    if (!address) {
      setRawAssets([])
      setAvailableAssets(initialState.availableAssets)
      setAvailableCurrencies(initialState.availableCurrencies)
      setBorrowInfo(initialState.borrowInfo)
      setStakingInfo(initialState.stakingInfo)
      setValidators(initialState.validators)
    }
  }, [
    address,
    setRawAssets,
    setAvailableAssets,
    setAvailableCurrencies,
    setBorrowInfo,
    setValidators,
    setStakingInfo,
  ])

  return (
    <AssetsContext.Provider
      value={{
        assets,
        availableAssets,
        availableCurrencies,
        farmInfo,
        validators,
        borrowInfo,
        stakingInfo,
        airdrops,
        fetchAvailableAssets,
        fetchFarmInfo,
        fetchAssets,
        fetchBorrowInfo,
        fetchStakingInfo,
        fetchAirdrops,
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
        claimAirdrops,
        provideLiquidity,
        withdrawLiquidity,
        claimFarmRewards,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

const useAssetsContext = (): AssetsState => React.useContext(AssetsContext)

export { AssetsProvider, useAssetsContext }
