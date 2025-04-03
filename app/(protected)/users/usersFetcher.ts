'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const usersFetcher = async ({ page, filters, sorter }: ListQuery) => {
  let query = database
    .selectFrom('users')
    .leftJoin('operators', 'users.operatorId', 'operators.id')
    .select([
      'users.id',
      'users.name',
      'users.email',
      'users.role',
      'users.operatorId',
      'operators.name as operatorName'
    ])
    .orderBy(['users.name'])

  if (filters.operatorName)
    query = query.where(
      'users.operatorId',
      'in',
      filters.operatorName as string[]
    )

  return paginate(query, page).execute()
}
