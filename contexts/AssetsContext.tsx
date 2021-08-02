import React from 'react'
import { Coin, MsgSwap, MnemonicKey, MsgSend, Wallet } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import { terraLCDClient as terra, mirrorOptions, anchorClient } from '../utils/terraConfig'
import { transformCoinsToAssets } from '../utils/transformAssets'
import { Asset, MirrorAsset } from '../types/assets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
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
    // TODO: support more denoms
    const userBalance = await anchorClient.earn.getTotalDeposit({
      market: MARKET_DENOMS.UUSD,
      address,
    })
    const apr = await anchorClient.earn.getAPY({
      market: MARKET_DENOMS.UUSD,
    })
    const mAssets = await fetchMirrorBalance(address)
    const result = await transformCoinsToAssets(
      [
        ...JSON.parse(balances.toJSON()),
        {
          denom: 'ausd',
          amount: (Number(userBalance) * 10 ** 6).toString(),
          apr,
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
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
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
    async (coin: { denom: string; amount: number }, toAddress: string, password: string) => {
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = terra.wallet(key)
      const msg = new MsgSend(key.accAddress, toAddress, { [coin.denom]: coin.amount * 10 ** 6 })
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
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = new Wallet(terra, key)
      const deposit = await anchorClient.earn
        .depositStable({ market: MARKET_DENOMS.UUSD, amount: String(amount) })
        .execute(wallet as any, {})
      fetchAssets()
      return deposit
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  const withdrawSavings = React.useCallback(
    async (amount: number, password: string) => {
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
      })
      const wallet = new Wallet(terra, key)
      const withdraw = await anchorClient.earn
        .withdrawStable({ market: MARKET_DENOMS.UUSD, amount: String(amount) })
        .execute(wallet as any, {})
      fetchAssets()
      return withdraw
    },
    [encryptedSecretPhrase, fetchAssets]
  )

  const swapMAsset = React.useCallback(
    async (symbol: string, amount: number, mode: 'buy' | 'sell', password: string) => {
      const key = new MnemonicKey({
        mnemonic: decryptMnemonic(encryptedSecretPhrase, password),
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
