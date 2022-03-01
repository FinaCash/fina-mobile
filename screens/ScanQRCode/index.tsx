import { Camera } from 'expo-camera'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import get from 'lodash/get'
import HeaderBar from '../../components/HeaderBar'
import { useLocalesContext } from '../../contexts/LocalesContext'
import useSendToken from '../../utils/useSendToken'
import isAddressValid from '../../utils/isAddressValid'
import { Alert } from 'react-native'
import { getCurrentAssetDetail } from '../../utils/transformAssets'
import { useAssetsContext } from '../../contexts/AssetsContext'

const ScanQRCode: React.FC<{ onScan: (code: string) => void }> = ({ onScan }) => {
  const { t } = useLocalesContext()
  const { assets } = useAssetsContext()
  const [hasPermission, setHasPermission] = React.useState(false)
  const [prevData, setPrevData] = React.useState('')
  const sendToken = useSendToken()

  React.useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  return (
    <>
      <HeaderBar back title={t('scan')} />
      {hasPermission ? (
        <Camera
          style={{ flex: 1 }}
          onBarCodeScanned={({ data }) => {
            if (prevData === data) {
              return
            }
            setPrevData(data)
            let payCode: any
            try {
              payCode = JSON.parse(data)
              if (isAddressValid(payCode.address) && payCode.denom && payCode.amount) {
                if (
                  Number(
                    get(
                      assets.find((a) => a.coin.denom === payCode.denom),
                      'coin.amount',
                      '0'
                    )
                  ) >
                  Number(payCode.amount) * 10 ** 6
                ) {
                  sendToken({
                    recipient: {
                      name: '',
                      image: '',
                      address: payCode.address,
                      memo: payCode.memo,
                    },
                    asset: getCurrentAssetDetail({
                      denom: payCode.denom,
                      amount: '0',
                    }),
                    amount: Number(payCode.amount),
                  })
                } else {
                  Alert.alert(t('insufficient fund'))
                }
              } else {
                Alert.alert(t('invalid qr code'))
              }
            } catch (err) {
              if (isAddressValid(data)) {
                Actions.pop()
                onScan(data)
              } else {
                Alert.alert(t('invalid qr code'))
              }
            }
          }}
        />
      ) : null}
    </>
  )
}

export default ScanQRCode
