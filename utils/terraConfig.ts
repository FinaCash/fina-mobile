import { Anchor, bombay12, AddressProviderFromJson, columbus5 } from '@anchor-protocol/anchor.js'
import { DEFAULT_BOMBAY_MIRROR_OPTIONS, DEFAULT_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'
import get from 'lodash/get'

export const deafultHdPath = [44, 330, 0, 0, 0]
export const defaultPrefix = 'terra'

export const chainID = 'columbus-5'
export const networkName = 'mainnet'

export const terraLCDUrl = 'https://lcd.terra.dev'
export const terraLCDClient = new LCDClient({
  URL: terraLCDUrl,
  chainID,
  gasPrices: {
    uusd: 0.15,
  },
  gasAdjustment: 1.5,
})

export const terraFCDUrl = 'https://fcd.terra.dev'
export const terraHiveUrl = 'https://hive.terra.dev/graphql' // Astroport
export const astroportGeneratorContract = 'terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9'
export const terraUstPairContract = 'terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552'

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
    priceFetcher: async () => {
      const result = await fetch(
        `${terraLCDUrl}/terra/wasm/v1beta1/contracts/${mirrorOptions.assets.MIR.pair}/store?query_msg=eyJwb29sIjp7fX0%3D`
      ).then((r) => r.json())
      const price =
        Number(get(result, ['query_result', 'assets', 1, 'amount'], '0')) /
        Number(get(result, ['query_result', 'assets', 0, 'amount'], '0'))
      return { price }
    },
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

export const anchorAddressProvider = new AddressProviderFromJson(columbus5)

export const anchorClient = new Anchor(terraLCDClient as any, anchorAddressProvider)

export const anchorApiUrl = 'https://api.anchorprotocol.com/api'
export const anchorAirdropApiUrl = 'https://airdrop.anchorprotocol.com/api/get?chainId=columbus-4'
export const terraMantleUrl = 'https://mantle.terra.dev'

export const mirrorGraphqlUrl = 'https://graph.mirror.finance/graphql'

export const terraStationUrl = 'https://station.terra.money'

export const mirrorOptions = DEFAULT_MIRROR_OPTIONS

export const colleteralsInfo = {
  BETH: {
    img: 'https://app.terraswap.io/images/CW20/bETH.png',
  },
  BLUNA: {
    img: 'https://app.terraswap.io/images/CW20/bLUNA.png',
  },
}

export const defaultValidatorAddress = 'terravaloper1jkqr2vfg4krfd4zwmsf7elfj07cjuzss30ux8g'

export const getTransakUrl = (address: string) =>
  `https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=terra&walletAddress=${address}`
