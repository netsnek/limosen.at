// src/db/d1.ts
import {getEnv} from '@getcronit/pylon'
import type {D1Database} from '@cloudflare/workers-types'

export function d1(): D1Database {
  const env = getEnv() as any as {DB: D1Database}
  if (!env?.DB) throw new Error('D1 binding "DB" fehlt in env')
  return env.DB
}
