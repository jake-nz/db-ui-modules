import ColonyIcon from '@/components/icons/coral.svg'
import MapPin from '@/components/icons/map-pin-line.svg'
import Boat from '@/components/icons/sailboat-line.svg'
import ReefIcon from '@/components/icons/reef.svg'
import Globe from '@/components/icons/globe.svg'
import Icon, {
  HomeOutlined,
  UserOutlined,
  NodeExpandOutlined
} from '@ant-design/icons'
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
    icon: <Icon component={ColonyIcon} />,
    label: 'Outplants'
  },
  {
    key: '/regions',
    icon: <Icon component={Globe} />,
    label: 'Regions'
  },

  {
    key: '/reefs',
    icon: <Icon component={ReefIcon} />,
    label: 'Reefs',
    disabled: true
  },
  {
    key: '/sites',
    icon: <Icon component={MapPin} />,
    label: 'Sites'
    // disabled: true
  },

  {
    key: '/operators',
    icon: <Icon component={Boat} />,
    label: 'Operators'
  },
  {
    key: '/species',
    icon: <NodeExpandOutlined />,
    label: 'Species'
  },
  {
    key: '/users',
    icon: <UserOutlined />,
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
