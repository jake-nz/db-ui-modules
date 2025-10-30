import { Rule } from 'antd/es/form'

const emailRequired: Rule = {
  required: true,
  message: 'Please enter your email',
}
const emailValid: Rule = {
  type: 'email',
  message: 'Please enter a valid email',
}

export const emailRules = [emailRequired, emailValid]

const passwordRequired: Rule = {
  required: true,
  message: 'Please enter your password',
}
const passwordMinLength: Rule = {
  min: 6,
  message: 'Passwords must be at least 6 characters',
}
export const passwordRules = [passwordRequired, passwordMinLength]

const passwordsMatch: Rule = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue('password') === value) return Promise.resolve()
    return Promise.reject(new Error('Passwords do not match'))
  },
})

export const confirmPasswordRules = [passwordRequired, passwordsMatch]
