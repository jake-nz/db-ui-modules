import { auth } from '../auth/auth'
import { abilityFromSession } from './abilityFromSession'

export const getAbility = async () => {
  const session = await auth()
  return abilityFromSession(session)
}
