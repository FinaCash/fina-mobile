import { Anchor, bombay12, AddressProviderFromJson, columbus5 } from '@anchor-protocol/anchor.js'
import { DEFAULT_BOMBAY_MIRROR_OPTIONS, DEFAULT_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'
import get from 'lodash/get'

export const defaultHdPath = [44, 330, 0, 0, 0]
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
  gasAdjustment: 2,
})

export const unbondingPeriod = 21

export const terraFCDUrl = 'https://fcd.terra.dev'
export const terraHiveUrl = 'https://hive.terra.dev/graphql' // Astroport
export const astroApiUrl = 'https://api.astroport.fi/graphql'
export const astroportGeneratorContract = 'terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9'

export const coingeckoApiUrl = 'https://api.coingecko.com/api/v3'

export const anchorAddressProvider = new AddressProviderFromJson(columbus5)

export const anchorClient = new Anchor(terraLCDClient as any, anchorAddressProvider)

export const anchorApiUrl = 'https://api.anchorprotocol.com/api'
export const terraMantleUrl = 'https://mantle.terra.dev'

export const mirrorGraphqlUrl = 'https://graph.mirror.finance/graphql'

export const terraStationUrl = 'https://station.terra.money'

export const mirrorOptions = DEFAULT_MIRROR_OPTIONS

export const supportedTokens = {
  uluna: {
    coingeckoId: 'terra-luna',
    symbol: 'LUNA',
    denom: 'uluna',
    name: 'Terra LUNA',
    image: 'https://assets.terra.money/icon/600/Luna.png',
    addresses: {
      pair: 'terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552',
      lpToken: 'terra1m24f7k4g66gnh9f7uncp32p722v0kyt3q4l3u5',
    },
  },
  MIR: {
    coingeckoId: 'mirror-protocol',
    symbol: 'MIR',
    denom: 'MIR',
    name: 'Mirror Token',
    image: 'https://whitelist.mirror.finance/icon/MIR.png',
    addresses: {
      pair: mirrorOptions.assets.MIR.pair,
      token: mirrorOptions.assets.MIR.token,
      lpToken: mirrorOptions.assets.MIR.lpToken,
    },
  },
  ANC: {
    coingeckoId: 'anchor-protocol',
    symbol: 'ANC',
    denom: 'ANC',
    name: 'Anchor Token',
    image: 'https://whitelist.anchorprotocol.com/logo/ANC.png',
    addresses: {
      pair: anchorAddressProvider.ancUstPair(),
      token: anchorAddressProvider.ANC(),
      lpToken: anchorAddressProvider.ancUstLPToken(),
    },
  },
  ASTRO: {
    coingeckoId: 'astroport',
    symbol: 'ASTRO',
    denom: 'ASTRO',
    name: 'Astroport Token',
    image: 'https://app.astroport.fi/tokens/astro.png',
    addresses: {
      pair: 'terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7',
      token: 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
      lpToken: 'terra17n5sunn88hpy965mzvt3079fqx3rttnplg779g',
    },
  },
}

export const anchorOverseerContract = 'terra1tmnqgvg567ypvsvk6rwsga3srp7e3lg6u0elp8'
export const colleteralsInfo = {
  BETH: {
    symbol: 'bETH',
    image: 'https://app.terraswap.io/images/CW20/bETH.png',
    token: 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun',
    custody: 'terra10cxuzggyvvv44magvrh3thpdnk9cmlgk93gmx2',
    tradeable: true,
    digits: 6,
  },
  BLUNA: {
    symbol: 'bLUNA',
    image: 'https://app.terraswap.io/images/CW20/bLUNA.png',
    token: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
    custody: 'terra1ptjp2vfjrwh0j0faj9r6katm640kgjxnwwq9kn',
    tradeable: true,
    digits: 6,
  },
  SAVAX: {
    symbol: 'wasAVAX',
    image: 'https://app.astroport.fi/tokens/wasAVAX.png',
    token: 'terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58',
    custody: 'terra1t4x4393l2kx8e5rpdkjkmt8c4ghkkpak6mdwxn',
    digits: 8,
  },
  bATOM: {
    symbol: 'bATOM',
    image:
      'https://firebasestorage.googleapis.com/v0/b/thinka-v2.appspot.com/o/bATOM.png?alt=media&token=c566fcd5-28e1-4315-a076-4aaed5e82de2',
    token: 'terra18zqcnl83z98tf6lly37gghm7238k7lh79u4z9a',
    custody: 'terra1zdxlrtyu74gf6pvjkg9t22hentflmfcs86llva',
    digits: 6,
  },
}

export const defaultValidatorAddress = 'terravaloper1jkqr2vfg4krfd4zwmsf7elfj07cjuzss30ux8g'

export const getTransakUrl = (address: string) =>
  `https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=terra&walletAddress=${address}`

export const defaultAvatarUrl = 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'
