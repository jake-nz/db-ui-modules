import { WarningOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import { useRelease } from './useRelease'

export const ReleaseBanner = () => {
  const { currentRelease, production } = useRelease()

  if (currentRelease === 'production') return null

  return (
    <Alert
      type="error"
      closable
      message={
        <>
          You are using a {currentRelease} version. <a href={production}> Switch to the current live version</a>
        </>
      }
      icon={<WarningOutlined />}
      banner
    />
  )
}
