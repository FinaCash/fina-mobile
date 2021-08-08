import { Camera } from 'expo-camera'
import { t } from 'i18n-js'
import React from 'react'
import HeaderBar from '../../components/HeaderBar'

const ScanQRCode: React.FC<{ onScan: (code: string) => void }> = ({ onScan }) => {
  React.useEffect(() => {
    Camera.requestPermissionsAsync()
  }, [])

  return (
    <>
      <HeaderBar back title={t('scan')} />
      <Camera />
    </>
  )
}

export default ScanQRCode
