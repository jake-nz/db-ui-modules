import { subject } from '@casl/ability'
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
import { Menu } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { usePathname, useRouter } from 'next/navigation'
import { useAbility } from '@/services/auth/useAbility'
import { Abilty } from '@/services/auth/permissions'

type MenuItem = ItemType & { show?: boolean }

const getMenuItems: (ability: Abilty) => ItemType[] = ({ can }) => {
  const items: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: '/outplants',
      icon: <Icon component={ColonyIcon} />,
      label: 'Outplants',
      show: can('read', 'Outplant')
    },
    {
      key: '/regions',
      icon: <Icon component={Globe} />,
      label: 'Regions',
      show: can('read', 'Region')
    },

    {
      key: '/reefs',
      icon: <Icon component={ReefIcon} />,
      label: 'Reefs',
      show: can('read', 'Reef')
    },
    {
      key: '/sites',
      icon: <Icon component={MapPin} />,
      label: 'Sites',
      show: can('read', 'Site')
    },
    {
      key: '/operators',
      icon: <Icon component={Boat} />,
      label: 'Operators',
      show: can('read', 'Operator')
    },
    {
      key: '/species',
      icon: <NodeExpandOutlined />,
      label: 'Species',
      show: can('read', 'Species')
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
      show: can('read', 'User')
    }
  ]

  return items
    .filter(item => item?.show !== false)
    .map(({ show, ...item }) => item)
}

const getSelectedKeys = (menuItems: ItemType[], pathname: string) => {
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
  const ability = useAbility()

  const menuItems = ability ? getMenuItems(ability) : []

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      onClick={({ key }) => router.push(key)}
      selectedKeys={getSelectedKeys(menuItems, pathname || '/')}
      items={menuItems}
    />
  )
}
