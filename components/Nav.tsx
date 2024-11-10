import { HomeOutlined, TruckOutlined } from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { usePathname, useRouter } from 'next/navigation'

const menuItems: ItemType[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Home'
  },
  {
    key: '/outplants',
    icon: <TruckOutlined />,
    label: 'Outplants'
  },
  {
    key: '/regions',
    icon: <TruckOutlined />,
    label: 'Regions'
  },

  {
    key: '/reefs',
    icon: <TruckOutlined />,
    label: 'Reefs',
    disabled: true
  },
  {
    key: '/sites',
    icon: <TruckOutlined />,
    label: 'Sites',
    disabled: true
  },

  {
    key: '/operators',
    icon: <TruckOutlined />,
    label: 'Operators'
  },
  {
    key: '/species',
    icon: <TruckOutlined />,
    label: 'Species'
  },
  {
    key: '/users',
    icon: <TruckOutlined />,
    label: 'Users',
    disabled: true
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
  const go: MenuProps['onClick'] = ({ key }) => router.push(key)

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
