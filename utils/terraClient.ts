import { LCDClient } from '@terra-money/terra.js'

export default new LCDClient({
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
})
