import { Anchor, tequila0004, AddressProviderFromJson } from '@anchor-protocol/anchor.js'
import { DEFAULT_TEQUILA_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js'
import { LCDClient } from '@terra-money/terra.js'

export const terraLCDClient = new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
})

export const anchorClient = new Anchor(
  terraLCDClient as any,
  new AddressProviderFromJson(tequila0004)
)

export const mirrorGraphqlUrl = 'https://tequila-graph.mirror.finance/graphql'

export const mirrorOptions = DEFAULT_TEQUILA_MIRROR_OPTIONS
