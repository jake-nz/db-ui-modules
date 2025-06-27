import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EditButton } from '../EditButton'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>
}))

describe('EditButton', () => {
  it('renders edit button with correct text', () => {
    render(<EditButton href="/users/123/edit" />)

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('renders with correct href', () => {
    render(<EditButton href="/users/123/edit" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/users/123/edit')
  })

  it('renders with form icon', () => {
    render(<EditButton href="/users/123/edit" />)

    const button = screen.getByRole('button')
    expect(button.querySelector('.anticon-form')).toBeInTheDocument()
  })

  it('has small size', () => {
    render(<EditButton href="/users/123/edit" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('ant-btn-sm')
  })
})
