import { ForbiddenError, subject as setSubjectType } from '@casl/ability'
import type { AppAbility, PermissionsBase } from './types'

const getSubject = <S>(subjectType: string, specificSubject?: S) =>
  specificSubject ? setSubjectType(subjectType, specificSubject) : subjectType

export type CanArgs<P extends PermissionsBase> = [
  action: P['Action'],
  subjectType: P['Subject'],
  specificSubject?: any,
  field?: string
]

// Set a default message for forbidden errors that includes the action and subject type
ForbiddenError.setDefaultMessage(error => `Permission required: ${error.action} ${error.subjectType}`)

/**
 * Takes an ability and returns an object with all the ability methods
 * can and cannot are modified so they can take a subject type and optional subject
 * assertCan is added that throws if the ability doesn't allow the action
 * returning an object also make the ability destructurable
 */
export const extendAbility = <P extends PermissionsBase>(ability: AppAbility<P>) => {
  const assertCan: (...args: CanArgs<P>) => void = (action, subjectType, specificSubject, field) => {
    ForbiddenError.from(ability as AppAbility<PermissionsBase>).throwUnlessCan(
      action,
      getSubject(subjectType, specificSubject),
      field
    )
  }

  const can: (...args: CanArgs<P>) => boolean = (action, subjectType, specificSubject, field) =>
    (ability as AppAbility<PermissionsBase>).can(action, getSubject(subjectType, specificSubject), field)

  const cannot: (...args: CanArgs<P>) => boolean = (action, subjectType, specificSubject, field) =>
    (ability as AppAbility<PermissionsBase>).cannot(action, getSubject(subjectType, specificSubject), field)

  return {
    can,
    cannot,
    assertCan,
    rules: ability.rules,
    rulesFor: ability.rulesFor.bind(ability),
    relevantRuleFor: ability.relevantRuleFor.bind(ability),
    possibleRulesFor: ability.possibleRulesFor.bind(ability),
    detectSubjectType: ability.detectSubjectType.bind(ability),
    update: ability.update.bind(ability),
    on: ability.on.bind(ability)
  }
}
