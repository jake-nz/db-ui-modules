import { abilityFromSession } from './abilityFromSession'
import { useSessionSuspense } from '../auth/utils/useSessionSuspense'

export const useAbility = () => {
  const session = useSessionSuspense()
  return abilityFromSession(session)
}
