'use server'
import { database } from '@/services/database/database'

export const userFetcher = async (userId: string) =>
  database
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
    .where('users.id', '=', userId)
    .executeTakeFirstOrThrow()
