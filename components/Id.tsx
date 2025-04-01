import { Typography } from 'antd'

import { TextProps } from 'antd/es/typography/Text'

const { Text } = Typography

type IdProps = { children: string } & Omit<TextProps, 'children'>

export const Id = ({ children, ...props }: IdProps) => (
  <Text code copyable ellipsis {...props}>
    {children}
  </Text>
)
