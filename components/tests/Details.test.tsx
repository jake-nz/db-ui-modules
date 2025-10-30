import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Details } from '../Details'

describe('Details', () => {
  it('renders key-value pairs as descriptions', () => {
    const details = {
      Name: 'John Doe',
      Email: 'john@example.com',
      Role: 'Admin',
    }

    render(<Details details={details} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('handles empty details object', () => {
    render(<Details details={{}} />)

    // Component should render without errors even with empty details
    expect(screen.queryByRole('term')).not.toBeInTheDocument()
  })

  it('handles ReactNode values', () => {
    const details = {
      Status: <span style={{ color: 'green' }}>Active</span>,
      'Created Date': <time>2023-01-01</time>,
    }

    render(<Details details={details} />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Created Date')).toBeInTheDocument()
    expect(screen.getByRole('time')).toBeInTheDocument()
  })

  it('passes through additional props to Descriptions component', () => {
    const details = { Name: 'Test' }

    render(<Details details={details} title="User Details" bordered />)

    expect(screen.getByText('User Details')).toBeInTheDocument()
  })

  it('uses single column layout by default', () => {
    const details = {
      Field1: 'Value1',
      Field2: 'Value2',
      Field3: 'Value3',
    }

    const { container } = render(<Details details={details} />)

    // Ant Design Descriptions with column=1 should render items in single column
    const descriptions = container.querySelector('.ant-descriptions')
    expect(descriptions).toBeInTheDocument()
  })
})
