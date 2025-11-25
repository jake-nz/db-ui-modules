import { Typography } from 'antd'
import { TextProps } from 'antd/es/typography/Text'

const { Text } = Typography

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
})

const datetimeFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

export const normalizeDate = (date: Date | string | number) => {
  if (date instanceof Date) return date

  // Handle dates in epoch seconds
  if (typeof date === 'number' && date < 10000000000) date = date * 1000

  return new Date(date)
}

export const dateFormat = (date: null | undefined | Date | string | number, showTime = false, fallback = '') => {
  if (!date) return fallback
  try {
    const normalizedDate = normalizeDate(date)
    const formatter = showTime ? datetimeFormatter : dateFormatter
    return formatter.format(normalizedDate)
  } catch {
    return date.toString()
  }
}

<<<<<<< HEAD
export const Datetime = ({ children }: { children: Date | string | number | undefined | null }) => (
  <Text ellipsis>{dateFormat(children)}</Text>
=======
export const Datetime = ({
  children,
  showTime = false,
  ...props
}: {
  children: Date | string | number | undefined | null
  showTime?: boolean
} & Omit<TextProps, 'children'>) => (
  <Text ellipsis {...props}>
    {dateFormat(children, showTime)}
  </Text>
>>>>>>> 626f84b (feat(Datetime): Handle dates in epoch seconds)
)
