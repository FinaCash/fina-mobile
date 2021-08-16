import { Anchor, tequila0004, AddressProviderFromJson } from '@anchor-protocol/anchor.js'
import { DEFAULT_TEQUILA_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'

export const terraLCDClient = new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
})

export const supportedTokens = {
  uluna: {
    symbol: 'LUNA',
    name: 'Terra LUNA',
    image: 'https://assets.terra.money/icon/600/Luna.png',
    coingeckoId: 'terra-luna',
  },
  MIR: {
    symbol: 'MIR',
    name: 'Mirror Token',
    image: 'https://whitelist.mirror.finance/icon/MIR.png',
    coingeckoId: 'mirror-protocol',
  },
  ANC: {
    symbol: 'ANC',
    name: 'Anchor Token',
    image: 'https://whitelist.anchorprotocol.com/logo/ANC.png',
    coingeckoId: 'anchor-protocol',
  },
}

export const anchorClient = new Anchor(
  terraLCDClient as any,
  new AddressProviderFromJson(tequila0004)
)

export const mirrorGraphqlUrl = 'https://tequila-graph.mirror.finance/graphql'

export const mirrorOptions = DEFAULT_TEQUILA_MIRROR_OPTIONS

// TODO: register transak api key
export const getTransakUrl = (address: string) =>
  `https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=mainnet&walletAddress=${address}`
