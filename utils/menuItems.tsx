import { ItemType } from 'antd/es/menu/interface'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { abilityFromSession } from '../permissions/abilityFromSession'

type Ability = ReturnType<typeof abilityFromSession>

type MenuItem = {
  url: string
  icon: React.ReactNode
  label: React.ReactNode
  children?: MenuItem[] | MenuItemBuilder
  disabled?: boolean
  hidden?: boolean
}

export type MenuItemBuilder = (ability: Ability) => MenuItem[]

export const useMenuItems = (builder: MenuItemBuilder, ability: Ability) => {
  const mapMenuItems = (items: MenuItem[]): ItemType[] =>
    items
      .filter(mi => !mi.hidden)
      .map(({ url, label, children, ...mi }) => {
        if (typeof children === 'function') children = children(ability)

        return {
          ...mi,
          key: url,
          label: (
            <Link href={url} style={{ color: 'inherit' }}>
              {label}
            </Link>
          ),
          children: children && mapMenuItems(children)
        }
      })

  const items = mapMenuItems(builder(ability))

  const selectedKeys = useSelectedKeys(items)

  return { items, selectedKeys }
}

const useSelectedKeys = (menuItems: ItemType[]) => {
  const pathname = usePathname()
  if (!pathname || pathname === '/') return ['/']

  const getSelectedKeys = (items: ItemType[]): string[] | undefined => {
    for (const item of items) {
      if (!item || !item.key) continue
      if (item.key === '/') continue

      if ('children' in item && item.children) {
        const selected = getSelectedKeys(item.children)
        if (selected) return selected
      }

      const key = item.key.toString()
      if (pathname.startsWith(key)) return [key]
    }
  }

  return getSelectedKeys(menuItems)
}
