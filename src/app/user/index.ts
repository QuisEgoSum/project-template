import {UserModel} from './UserModel'
import {UserRepository} from './UserRepository'
import {UserService} from './UserService'
import {routes} from './routes'
import type {FastifyInstance} from 'fastify'


export const service = new UserService(new UserRepository(UserModel))
export async function router(fastify: FastifyInstance) {
  return routes(fastify, service)
}