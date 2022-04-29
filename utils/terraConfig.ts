import { Anchor, bombay12, AddressProviderFromJson, columbus5 } from '@anchor-protocol/anchor.js'
import { DEFAULT_BOMBAY_MIRROR_OPTIONS, DEFAULT_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'
import { Dapp } from '../types/misc'

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
      token: '',
      lpToken: 'terra1m24f7k4g66gnh9f7uncp32p722v0kyt3q4l3u5',
    },
    digits: 6,
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
    digits: 6,
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
    digits: 6,
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
    digits: 6,
  },
  MINE: {
    coingeckoId: 'pylon-protocol',
    symbol: 'MINE',
    denom: 'MINE',
    name: 'Pylon Protocol',
    image: 'https://assets.pylon.rocks/logo/MINE.png',
    addresses: {
      pair: 'terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48',
      token: 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy',
      lpToken: 'terra16unvjel8vvtanxjpw49ehvga5qjlstn8c826qe',
    },
    digits: 6,
  },
  MARS: {
    coingeckoId: 'mars-protocol',
    symbol: 'MARS',
    denom: 'MARS',
    name: 'Mars Protocol',
    image: 'https://app.astroport.fi/tokens/mars.png',
    addresses: {
      pair: 'terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds',
      token: 'terra12hgwnpupflfpuual532wgrxu2gjp0tcagzgx4n',
      lpToken: 'terra1ww6sqvfgmktp0afcmvg78st6z89x5zr3tmvpss',
    },
    digits: 6,
  },
  stLUNA: {
    coingeckoId: 'staked-luna',
    symbol: 'stLUNA',
    denom: 'stLUNA',
    name: 'Staked LUNA',
    image: 'https://static.lido.fi/stLUNA/stLUNA.png',
    addresses: {
      pair: 'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae',
      token: 'terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc',
      lpToken: 'terra1h2lasu3a5207yt7decg0s09z5ltw953nrgj820',
    },
    digits: 6,
  },
  weLDO: {
    coingeckoId: 'lido-dao',
    symbol: 'weLDO',
    denom: 'weLDO',
    name: 'Wormhole Lido',
    image: 'https://static.lido.fi/LDO/LDO.png',
    addresses: {
      token: 'terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z',
    },
    digits: 8,
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

export const nonUstFarms = [
  {
    symbol: 'BLUNA',
    denom: 'bLUNA',
    pairSymbol: 'LUNA',
    pairDenom: 'uluna',
    addresses: {
      token: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
      lpToken: 'terra1htw7hm40ch0hacm8qpgd24sus4h0tq3hsseatl',
      pair: 'terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w',
    },
  },
  {
    symbol: 'stLUNA',
    denom: 'stLUNA',
    pairSymbol: 'LUNA',
    pairDenom: 'uluna',
    addresses: {
      pair: 'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae',
      token: 'terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc',
      lpToken: 'terra1h2lasu3a5207yt7decg0s09z5ltw953nrgj820',
    },
    proxyRewardTokenDenom: 'weLDO',
  },
]

export const defaultValidatorAddress = ''

export const getTransakUrl = (address: string) =>
  `https://global.transak.com/?apiKey=db70aca0-ca84-4344-8dcc-036f470414fc&cryptoCurrencyList=UST,LUNA&defaultCryptoCurrency=UST&networks=terra&walletAddress=${address}`

export const dapps: Dapp[] = [
  {
    name: 'Anchor Protocol',
    description: 'Savings and Money market on Terra',
    url: 'https://app.anchorprotocol.com/',
    image: 'https://whitelist.anchorprotocol.com/logo/ANC.png',
  },
  {
    name: 'Mirror Protocol',
    description: 'Synthetics protocol for real-world assets',
    url: 'https://mirrorprotocol.app/',
    image: 'https://whitelist.mirror.finance/icon/MIR.png',
  },
  {
    name: 'Astroport',
    description: 'The meta AMM of Terra',
    url: 'https://app.astroport.fi/',
    image: 'https://app.astroport.fi/tokens/astro.png',
  },
  {
    name: 'TerraSwap',
    description: 'Uniswap-inspired AMM on Terra',
    url: 'https://app.terraswap.io/',
    image: 'https://icons.llama.fi/terraswap.png',
  },
  {
    name: 'TerraDrops',
    description: 'Airdrop hub for Terra projects',
    url: 'https://www.terradrops.io/',
    image: 'https://pbs.twimg.com/profile_images/1412417940356538378/JYg2tN2U_400x400.jpg',
  },
  {
    name: 'Lido',
    description: 'Liquidity for staked assets',
    url: 'https://terra.lido.fi/',
    image: 'https://blog.lido.fi/content/images/2020/10/lido.png',
  },
  {
    name: 'Stader',
    description: 'Maximize your returns on staking.',
    url: 'https://terra.staderlabs.com/lt-pools',
    image: 'https://pbs.twimg.com/profile_images/1478369852956020739/xCY_D-NG_400x400.jpg',
  },
  {
    name: 'PRISM Protocol',
    description: 'Split assets into yield and principal',
    url: 'https://prismprotocol.app/',
    image: 'https://icodrops.com/wp-content/uploads/2022/01/PrismProtocol_logo.jpeg',
  },
  {
    name: 'Mars Protocol',
    description: 'Lend, borrow and earn on Terra',
    url: 'https://app.marsprotocol.io/',
    image: 'https://app.astroport.fi/tokens/mars.png',
  },
  {
    name: 'Loop DEX',
    description: 'Tokenized Community & DEX on Terra',
    url: 'https://dex.loop.markets/',
    image: 'https://dex.loop.markets/log-loop.png',
  },
]

export const lunaBasePair = ['BLUNA', 'stLUNA']

export const terraScopeUrl = 'https://terrasco.pe/mainnet/'
