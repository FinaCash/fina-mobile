import { CHAINS, NETWORKS } from '@anchor-protocol/anchor-earn'
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
export const getMirrorAssetImage = (symbol: string) =>
  `https://whitelist.mirror.finance/images/${symbol.replace(/^m/, '')}.png`
