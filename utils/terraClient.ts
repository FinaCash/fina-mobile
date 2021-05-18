import { LCDClient } from '@terra-money/terra.js'
import { APIRequester } from '@terra-money/terra.js/dist/client/lcd/APIRequester'

export default new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
})

export const terraApiRequester = new APIRequester('https://tequila-fcd.terra.dev')
