import {AccessError, AuthorizationError, InvalidDataError} from 'core/error'


export const UserAuthorizationError = AuthorizationError.extends(
  {},
  {
    code: 2000,
    error: 'UserAuthorizationError'
  }
)

export const UserRightsError = AccessError.extends(
  {},
  {
    error: 'UserRightsError',
    code: 2001,
    message: 'You don\'t have enough permissions to perform this action'
  }
)

export const IncorrectUserCredentials = InvalidDataError.extends(
  {},
  {
    error: 'IncorrectUserCredentials',
    code: 2002,
    message: 'Invalid login or password'
  }
)