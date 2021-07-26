import React from 'react'
import { Coin, MsgSwap, MnemonicKey, MsgSend } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import get from 'lodash/get'
import { terraLCDClient as terra, anchorConfig, mirrorOptions } from '../utils/terraConfig'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset, MirrorAsset } from '../types/assets'
import { AnchorEarn, DENOMS } from '@anchor-protocol/anchor-earn'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'
import { useSettingsContext } from './SettingsContext'
import { fetchAvailableMirrorAssets, fetchMirrorBalance } from '../utils/fetchMirrorGql'

interface AssetsState {
  address: string
  assets: Asset[]
  availableMirrorAssets: MirrorAsset[]
  loaded: boolean
  login(secretPhrase: string, password: string): void
  logout(): void
  swap(from: Coin, to: Coin, password: string): void
  send(coin: { denom: string; amount: number }, address: string, password: string): void
  depositSavings(amount: number, password: string): void
  withdrawSavings(amount: number, password: string): void
  swapMAsset(symbol: string, amount: number, mode: 'buy' | 'sell', password: string): void
}

const initialState: AssetsState = {
  address: '',
  assets: [],
  availableMirrorAssets: [],
  loaded: false,
  login: () => null,
  logout: () => null,
  swap: () => null,
  send: () => null,
  depositSavings: () => null,
  withdrawSavings: () => null,
  swapMAsset: () => null,
}

const AssetsContext = React.createContext<AssetsState>(initialState)

const AssetsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address, {
    secure: true,
  })
  const [assets, setAssets] = usePersistedState<Asset[]>('assets', initialState.assets, {
    secure: true,
  })
  const [availableMirrorAssets, setAvailableMirrorAssets] = React.useState<MirrorAsset[]>([])
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
    const anchorEarn = new AnchorEarn({
      ...anchorConfig,
      address,
    })
    const userBalance = await anchorEarn.balance({
      currencies: [DENOMS.UST],
    })
    const market = await anchorEarn.market({
      currencies: [DENOMS.UST],
    })
    const mAssets = await fetchMirrorBalance(address)
    const result = await transformCoinsToAssets(
      [
        ...JSON.parse(balances.toJSON()),
        {
          denom: 'aust',
          amount: (
            Number(get(userBalance, 'total_deposit_balance_in_ust', '0')) *
            10 ** 6
          ).toString(),
          apy: Number(get(market, 'markets[0].APY', 0)),
        },
        ...mAssets,
      ],
      availableMirrorAssets,
      currency
    )
    setAssets(result)
  }, [address, setAssets, fetchMirrorBalance, availableMirrorAssets, currency])

  React.useEffect(() => {
    if (address && availableMirrorAssets) {
      fetchAssets()
    }
  }, [address, availableMirrorAssets])

  React.useEffect(() => {
    fetchAvailableMirrorAssets().then(setAvailableMirrorAssets)
  }, [setAvailableMirrorAssets])

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

  const send = React.useCallback(
    async (coin: { denom: string; amount: number }, adr: string, password: string) => {
      const key = new MnemonicKey({
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const wallet = terra.wallet(key)
      const msg = new MsgSend(key.accAddress, adr, { [coin.denom]: coin.amount * 10 ** 6 })
      const tx = await wallet.createAndSignTx({
        msgs: [msg],
        feeDenoms: ['uluna'],
        gasAdjustment: 1.5,
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
        ...anchorConfig,
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const deposit = await anchorEarn.deposit({
        amount: amount.toString(),
        currency: DENOMS.UST,
      })
      fetchAssets()
      return deposit
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  const withdrawSavings = React.useCallback(
    async (amount: number, password: string) => {
      const anchorEarn = new AnchorEarn({
        ...anchorConfig,
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const withdraw = await anchorEarn.withdraw({
        amount: amount.toString(),
        currency: DENOMS.UST,
      })
      fetchAssets()
      return withdraw
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  const swapMAsset = React.useCallback(
    async (symbol: string, amount: number, mode: 'buy' | 'sell', password: string) => {
      const key = new MnemonicKey({
        mnemonic: CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(CryptoJS.enc.Utf8),
      })
      const wallet = terra.wallet(key)
      const mirror = new Mirror({ ...mirrorOptions, key })
      const msg = mirror.assets[symbol].pair.swap(
        {
          amount: (Number(amount) * 10 ** 6).toString(),
          info:
            mode === 'buy'
              ? UST
              : {
                  token: {
                    contract_addr: mirror.assets[symbol].token.contractAddress as string,
                  },
                },
        },
        {}
      )
      const tx = await wallet.createAndSignTx({
        msgs: [msg],
      })
      const result = await terra.tx.broadcast(tx)
      fetchAssets()
      return result
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  return (
    <AssetsContext.Provider
      value={{
        address,
        assets,
        availableMirrorAssets,
        loaded,
        login,
        logout,
        swap,
        send,
        depositSavings,
        withdrawSavings,
        swapMAsset,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

const useAssetsContext = (): AssetsState => React.useContext(AssetsContext)

export { AssetsProvider, useAssetsContext }
