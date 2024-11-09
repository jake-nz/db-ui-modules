import { HomeOutlined, TruckOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { usePathname, useRouter } from 'next/navigation'
import { MenuInfo } from 'rc-menu/lib/interface'

const menuItems: ItemType[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Home'
  },

  {
    key: '/operators',
    icon: <TruckOutlined />,
    label: 'Operators'
  }
]

const getSelectedKeys = (pathname: string) => {
  if (pathname === '/') return ['/']
  const current = menuItems.find(
    item =>
      item?.key && item.key !== '/' && pathname.startsWith(item.key.toString())
  )
  if (current?.key) return [current.key.toString()]
}

export const Nav = () => {
  const router = useRouter()
  const pathname = usePathname()
  const go = ({ key }: MenuInfo) => router.push(key)

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      onClick={go}
      selectedKeys={getSelectedKeys(pathname || '/')}
      items={menuItems}
    />
  )
}
