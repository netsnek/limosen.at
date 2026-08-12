// src/db/prisma.ts
import {getEnv} from '@getcronit/pylon'
import {PrismaClient} from '@prisma/client'
import {PrismaD1} from '@prisma/adapter-d1'
import type {D1Database} from '@cloudflare/workers-types'

export type Env = {DB: D1Database}

// global cache across requests in same isolate
const g = globalThis as unknown as {__prisma?: PrismaClient}

const uuid = () => crypto.randomUUID()
const withPrefix = (prefix: string) => `${prefix}${uuid()}`

function prefixForModel(model?: string) {
  switch (model) {
    case 'Car':
      return 'car:'
    case 'Transfer':
      return 'transfer:'
    case 'DriverData':
      return 'data:driver:'
    case 'CustomerData':
      return 'data:customer:'
    case 'DriverStats':
      return 'data:driver:stats:'
    case 'DriverLocation':
      return 'location:driver:'
    case 'CustomerLocation':
      return 'location:customer:'
    default:
      return null
  }
}

function ensureId(model: string | undefined, data: any) {
  const prefix = prefixForModel(model)
  if (!prefix || !data || data.id) return
  data.id = withPrefix(prefix)
}

function ensureMany(model: string | undefined, data: any) {
  const prefix = prefixForModel(model)
  if (!prefix || !data) return

  if (Array.isArray(data)) {
    for (const row of data) {
      if (row && !row.id) row.id = withPrefix(prefix)
    }
  } else {
    if (!data.id) data.id = withPrefix(prefix)
  }
}


export function getPrisma(env: Env) {
  if (!g.__prisma) {
    const adapter = new PrismaD1(env.DB)
    const base = new PrismaClient({adapter})

    g.__prisma = base.$extends({
      name: 'prefixed-ids',
      query: {
        $allModels: {
          async $allOperations({model, operation, args, query}) {
            if (operation === 'create') ensureId(model, (args as any)?.data)
            if (operation === 'createMany') ensureMany(model, (args as any)?.data)
            if (operation === 'upsert') ensureId(model, (args as any)?.create)
            return query(args)
          }
        }
      }
    }) as unknown as PrismaClient
  }

  return g.__prisma
}

export function prisma() {
  const env = getEnv() as any as Env
  if (!env?.DB) throw new Error('D1 binding "DB" fehlt in env')
  return getPrisma(env)
}
