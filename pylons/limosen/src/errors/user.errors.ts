// src/errors/user.errors.ts
import {AppError} from './general.errors'

export class UserNotFoundError extends AppError {
  constructor(message = 'User not found') {
    super(message, 'USER_NOT_FOUND', 404)
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(message = 'User already exists') {
    super(message, 'USER_ALREADY_EXISTS', 409)
  }
}
