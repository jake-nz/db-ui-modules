'use client'
import { Nav } from '@/components/Nav'
import { Alert, Layout as AntLayout, Button } from 'antd'
import { signOut } from 'next-auth/react'
import { WarningOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useAbility } from '@/services/auth/useAbility'
import { useSigninRedirect } from '@/auth/components/useSigninRedirect'

const { Header, Content, Footer } = AntLayout

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [env, setEnv] = useState<'production' | 'previous' | 'development'>(
    'production'
  )
  useEffect(() => {
    setEnv(
      ['coral-nurture.vercel.app', 'localhost'].includes(
        window.location.hostname
      )
        ? 'production'
        : window.location.hostname ===
            'coral-nurture-git-previous-jake-crosbys-projects.vercel.app'
          ? 'previous'
          : 'development'
    )
  }, [])
  const ability = useAbility() // Any ability, just enforcing login
  const signinRedirect = useSigninRedirect()
  if (!ability) return signinRedirect()

  // const print = pathname?.endsWith('/print')
  // if (print) return children

  return (
    <AntLayout className="layout" style={{ minHeight: '100vh' }}>
      {env !== 'production' && (
        <Alert
          type="error"
          message="Important"
          description={
            <>
              You are using a {env} version.{' '}
              <a href="https://coral-nurture.vercel.app/">
                Switch to the current live version
              </a>
            </>
          }
          icon={<WarningOutlined />}
          banner
        />
      )}
      <Header style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <Nav />
      </Header>
      <Content style={{ padding: '50px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => signOut()}>
          Log out
        </Button>
        {/* {env === 'production' && (
          <a href="https://coral-nurture-git-previous-jake-crosbys-projects.vercel.app">
            <Button type="link">Use previous version</Button>
          </a>
        )} */}
      </Footer>
    </AntLayout>
  )
}
