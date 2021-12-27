import { Anchor, bombay12, AddressProviderFromJson } from '@anchor-protocol/anchor.js'
import { DEFAULT_BOMBAY_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'

export const deafultHdPath = [44, 330, 0, 0, 0]
export const defaultPrefix = 'terra'

export const chainID = 'bombay-12'

export const terraLCDClient = new LCDClient({
  URL: 'https://bombay-lcd.terra.dev',
  chainID,
  gasPrices: {
    uusd: 0.15,
  },
  gasAdjustment: 2,
})

export const terraFCDUrl = 'https://bombay-fcd.terra.dev'

export const terraUstPairContract = 'terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff'

export const supportedTokens = {
  uluna: {
    symbol: 'LUNA',
    denom: 'uluna',
    name: 'Terra LUNA',
    image: 'https://assets.terra.money/icon/600/Luna.png',
    priceFetcher: async () => {
      const result = await fetch(`${terraFCDUrl}/v1/market/price?denom=uusd&interval=15m`).then(
        (r) => r.json()
      )
      return {
        price: result.lastPrice,
        prevPrice: result.lastPrice - Number(result.oneDayVariation),
      }
    },
  },
  MIR: {
    symbol: 'MIR',
    denom: 'MIR',
    name: 'Mirror Token',
    image: 'https://whitelist.mirror.finance/icon/MIR.png',
    priceFetcher: async () => null, // Price fetch handled in fetchMAssets
  },
  ANC: {
    symbol: 'ANC',
    denom: 'ANC',
    name: 'Anchor Token',
    image: 'https://whitelist.anchorprotocol.com/logo/ANC.png',
    priceFetcher: async () => {
      const result = await fetch(`${anchorApiUrl}/v1/anc/1d`).then((r) => r.json())
      return {
        price: Number(result[0].anc_price),
        prevPrice: Number(result[1].anc_price),
      }
    },
  },
}

export const anchorAddressProvider = new AddressProviderFromJson(bombay12)

export const anchorClient = new Anchor(terraLCDClient as any, anchorAddressProvider)

export const anchorApiUrl = 'https://api.anchorprotocol.com/api'
export const anchorAirdropApiUrl = 'https://airdrop.anchorprotocol.com/api/get?chainId=columbus-4'

export const mirrorGraphqlUrl = 'https://graph.mirror.finance/graphql'

export const terraStationUrl = 'https://station.terra.money'
export const terraStationChain = 'testnet'

export const mirrorOptions = DEFAULT_BOMBAY_MIRROR_OPTIONS

export const colleteralsInfo = {
  BETH: {
    img: 'https://app.terraswap.io/images/CW20/bETH.png',
  },
  BLUNA: {
    img: 'https://app.terraswap.io/images/CW20/bLUNA.png',
  },
}

export const defaultValidatorAddress = 'terravaloper1qxqrtvg3smlfdfhvwcdzh0huh4f50kfs6gdt4x'

export const getTransakUrl = (address: string) =>
  `https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=terra&walletAddress=${address}`
