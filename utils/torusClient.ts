import Openlogin from '@toruslabs/openlogin'
import Constants from 'expo-constants'

const openlogin = new Openlogin({
  clientId: Constants.manifest.extra!.torusProjectId,
  network: 'testnet', // valid values (testnet or mainnet)
})

export default openlogin
