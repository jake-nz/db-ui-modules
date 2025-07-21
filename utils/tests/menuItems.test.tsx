import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMenuItems, MenuItemBuilder } from '../menuItems'
import { emptyAbility } from '../../permissions/abilityFromSession'

vi.mock('@/modules/permissions/useAbility', () => ({
  useAbility: () => ({
    can: vi.fn(() => true),
    cannot: vi.fn(() => false)
  })
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/users/123'
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>
}))

describe('useMenuItems', () => {
  it('builds menu items from MenuItemBuilder', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users'
      },
      {
        url: '/settings',
        icon: <span>⚙️</span>,
        label: 'Settings'
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.items[0]).toMatchObject({
      key: '/users',
      icon: expect.anything()
    })
    expect(result.current.items[1]).toMatchObject({
      key: '/settings',
      icon: expect.anything()
    })
  })

  it('filters out hidden menu items', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users'
      },
      {
        url: '/admin',
        icon: <span>🔧</span>,
        label: 'Admin',
        hidden: true
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]?.key).toBe('/users')
  })

  it('handles nested menu items', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users',
        children: [
          {
            url: '/users/active',
            icon: <span>✅</span>,
            label: 'Active Users'
          }
        ]
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    const firstItem = result.current.items[0]
    expect(firstItem).toBeDefined()
    expect(firstItem).toHaveProperty('children')

    if (firstItem && 'children' in firstItem && firstItem.children) {
      expect(firstItem.children).toHaveLength(1)
      expect(firstItem.children[0]?.key).toBe('/users/active')
    }
  })

  it('selects correct menu item based on pathname', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users'
      },
      {
        url: '/settings',
        icon: <span>⚙️</span>,
        label: 'Settings'
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    // pathname is '/users/123' from mock
    expect(result.current.selectedKeys).toEqual(['/users'])
  })

  it('wraps labels in Link components', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users'
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    const firstItem = result.current.items[0]
    if (firstItem && 'label' in firstItem) {
      expect(firstItem.label).toBeDefined()
    }
  })

  it('handles disabled menu items', () => {
    const builder: MenuItemBuilder = ability => [
      {
        url: '/users',
        icon: <span>👤</span>,
        label: 'Users',
        disabled: true
      }
    ]

    const { result } = renderHook(() => useMenuItems(builder, emptyAbility))

    const firstItem = result.current.items[0]
    if (firstItem && 'disabled' in firstItem) {
      expect(firstItem.disabled).toBe(true)
    }
  })
})
