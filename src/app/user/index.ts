import {UserModel} from './UserModel'
import {UserRepository} from './UserRepository'
import {UserService} from './UserService'
import {routes} from './routes'
import {initSession} from './packages/session'
import * as error from './user-error'
import * as schemas from './schemas'
import {UserRole, UserRole as Role} from './UserRole'
import type {FastifyInstance} from 'fastify'
import type {Session} from './packages/session'


export class User {
  private readonly service: UserService
  private readonly UserRole: typeof Role
  public readonly error: typeof import('./user-error')
  private readonly schemas: typeof import('./schemas')
  private readonly Session: Session

  constructor(
    service: UserService,
    UserRole: typeof Role,
    error: typeof import('./user-error'),
    schemas: typeof import('./schemas'),
    Session: Session
  ) {
    this.service = service
    this.UserRole = UserRole
    this.error = error
    this.schemas = schemas
    this.Session = Session

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service, this.schemas)
  }

  async authorization(sessionId: string) {
    return this.service.authorization(sessionId)
  }

  getUserRole() {
    return this.UserRole
  }

  getUserErrors() {
    return this.error
  }
}

export async function initUser(): Promise<User> {
  const Session = await initSession()
  const service = new UserService(new UserRepository(UserModel), Session.service)
  await service.upsertSuperadmin()

  return new User(
    service,
    UserRole,
    error,
    schemas,
    Session
  )
}