import { Camera } from 'expo-camera'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import HeaderBar from '../../components/HeaderBar'
import { useLocalesContext } from '../../contexts/LocalesContext'

const ScanQRCode: React.FC<{ onScan: (code: string) => void }> = ({ onScan }) => {
  const { t } = useLocalesContext()
  const [hasPermission, setHasPermission] = React.useState(false)

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
            setHasPermission(false)
            Actions.pop()
            onScan(data)
          }}
        />
      ) : null}
    </>
  )
}

export default ScanQRCode
