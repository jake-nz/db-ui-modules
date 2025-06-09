import { Typography } from 'antd'

const { Text } = Typography

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium'
})
export const dateFormat = (date: null | undefined | Date | string | number, fallback = '') => {
  if (!date) return fallback
  try {
    if (date instanceof Date) return dateFormatter.format(date)

    // Handle dates in epoch seconds
    if (typeof date === 'number' && date < 10000000000) date = date * 1000

    return dateFormatter.format(new Date(date))
  } catch {
    return date.toString()
  }
}

export const Datetime = ({ children }: { children: Date | string | number | undefined | null }) => <Text ellipsis>{dateFormat(children)}</Text>
