'use client'
import { notification } from 'antd'
import { ArgsProps } from 'antd/es/notification'
import { useRef } from 'react'

type Action = (...args: any) => Promise<any>

type Notification = ArgsProps

type TryNotify<ActionType extends Action> = {
  action: ActionType
  start: Notification
  success: Notification | ((response: ReturnType<ActionType>) => Notification)
  error: Notification
}

export const useTryNotify = <ActionType extends Action>({
  action,
  start,
  success,
  error
}: TryNotify<ActionType>) => {
  const [notifications, notificationContext] = notification.useNotification()
  const key = useRef(Math.random().toString(36).substring(2)).current

  const tryNotify = async (...args: Parameters<ActionType>) => {
    notifications.info({ key, closable: false, ...start })

    try {
      const response = await action(...args)
      if (typeof success === 'function') success = success(response)
      notifications.success({ key, ...success })

      return { success: true, response }
    } catch (err) {
      console.error(err)

      notifications.error({
        description: getMessage(err),
        key,
        duration: 0,
        ...error
      })

      return { success: false, response: err }
    }
  }

  return [tryNotify, notificationContext] as const
}

const getMessage = (err: any) => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Unknown error'
}
