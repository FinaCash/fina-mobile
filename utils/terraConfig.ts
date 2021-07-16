import { CHAINS, NETWORKS } from '@anchor-protocol/anchor-earn'
import { DEFAULT_TEQUILA_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'

export const terraLCDClient = new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
})

export const anchorConfig = {
  chain: CHAINS.TERRA,
  network: NETWORKS.TEQUILA_0004,
}

export const mirrorGraphqlUrl = 'https://tequila-graph.mirror.finance/graphql'

export const mirrorOptions = DEFAULT_TEQUILA_MIRROR_OPTIONS

// Some mAssets use white text as icon which needs to have a dark background
export const darkBGIconMAssets = [
  'mSPY',
  'mIAU',
  'mVIXY',
  'MIR',
  'mGME',
  'mQQQ',
  'mSLV',
  'mUSO',
  'mAMD',
  'mDOT',
  'mSQ',
]
