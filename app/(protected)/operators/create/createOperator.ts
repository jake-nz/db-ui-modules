'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

export type NewOperatorFields = {
  name: string
  region: string
}

/**
 * Creates a URL-friendly slug from a string
 * - Converts to lowercase
 * - Removes special characters
 * - Replaces spaces with hyphens
 * - Removes leading/trailing hyphens
 */
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')          // Trim hyphens from start
    .replace(/-+$/, '');         // Trim hyphens from end
}

export const createOperator = async (values: NewOperatorFields) => {
  await assertUserAbility({ create: 'Operator' })

  const { id } = await database
    .insertInto('operators')
    .values({
      id: slugify(values.name),
      name: values.name,
      region: values.region
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return id
}
