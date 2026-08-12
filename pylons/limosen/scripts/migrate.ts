import fs from 'fs'
import path from 'path'
import {spawnSync} from 'child_process'
import readline from 'readline'

type RunOptions = {
  stdio?: 'inherit' | 'pipe'
  allowFailure?: boolean
  env?: NodeJS.ProcessEnv
}

type RunResult = {
  status: number
  stdout: string
  stderr: string
}

const COLOR = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

const ICON = {
  success: '[OK]',
  error: '[ERR]',
  warning: '[WARN]',
  info: '[INFO]'
}

function printInfo(msg: string) {
  console.log(`${COLOR.blue}${ICON.info} ${msg}${COLOR.reset}`)
}

function printSuccess(msg: string) {
  console.log(`${COLOR.green}${ICON.success} ${msg}${COLOR.reset}`)
}

function printWarning(msg: string) {
  console.log(`${COLOR.yellow}${ICON.warning} ${msg}${COLOR.reset}`)
}

function printError(msg: string) {
  console.error(`${COLOR.red}${ICON.error} ${msg}${COLOR.reset}`)
}

function printHeader() {
  console.log(`${COLOR.purple}Netsnek DB Toolkit${COLOR.reset}`)
  console.log(`${COLOR.cyan}================================${COLOR.reset}`)
}

function runCommand(command: string, args: string[], options: RunOptions = {}): RunResult {
  const needsCmdShim =
    process.platform === 'win32' && /\.(cmd|bat)$/i.test(command)
  const spawnCommand = needsCmdShim ? 'cmd.exe' : command
  const spawnArgs = needsCmdShim ? ['/d', '/s', '/c', command, ...args] : args

  const result = spawnSync(spawnCommand, spawnArgs, {
    stdio: options.stdio ?? 'inherit',
    env: options.env ?? process.env,
    encoding: 'utf8'
  })

  if (result.error) {
    throw result.error
  }

  const status = result.status ?? 0
  const stdout = typeof result.stdout === 'string' ? result.stdout : ''
  const stderr = typeof result.stderr === 'string' ? result.stderr : ''

  if (!options.allowFailure && status !== 0) {
    const details = stderr || stdout
    throw new Error(`Command failed (${command} ${args.join(' ')}): ${details}`.trim())
  }

  return {status, stdout, stderr}
}

function isEnoent(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(error && typeof error === 'object' && (error as NodeJS.ErrnoException).code === 'ENOENT')
}

function resolveNpmCliPath() {
  const execPath = process.env.npm_execpath
  if (!execPath) return null
  if (execPath.endsWith('npx-cli.js')) {
    const candidate = path.join(path.dirname(execPath), 'npm-cli.js')
    if (fileExists(candidate)) return candidate
  }
  return execPath
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent ?? ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('npm')) return 'npm'

  const execPath = resolveNpmCliPath() ?? ''
  const base = path.basename(execPath).toLowerCase()
  if (base.includes('pnpm')) return 'pnpm'
  if (base.includes('yarn')) return 'yarn'
  if (base.includes('npm')) return 'npm'

  return 'unknown'
}

function resolveLocalBin(binName: string) {
  const ext = process.platform === 'win32' ? '.cmd' : ''
  const candidate = path.resolve('node_modules', '.bin', `${binName}${ext}`)
  return fileExists(candidate) ? candidate : null
}

function runNpx(args: string[], options?: RunOptions) {
  if (args.length === 0) {
    throw new Error('runNpx requires a command')
  }
  const [command, ...rest] = args
  if (!command) {
    throw new Error('runNpx requires a command')
  }

  try {
    return runCommand('npx', ['--yes', ...args], options)
  } catch (error) {
    if (!isEnoent(error)) throw error
  }

  const localBin = resolveLocalBin(command)
  if (localBin) {
    return runCommand(localBin, rest, options)
  }

  const manager = detectPackageManager()
  const npmCliPath = resolveNpmCliPath()

  if (manager === 'pnpm') {
    try {
      return runCommand('pnpm', ['dlx', command, ...rest], options)
    } catch (error) {
      if (!isEnoent(error)) throw error
    }
    if (npmCliPath) {
      return runCommand(process.execPath, [npmCliPath, 'exec', '--yes', '--', command, ...rest], options)
    }
    return runCommand('npm', ['exec', '--yes', '--', command, ...rest], options)
  }

  if (manager === 'yarn') {
    try {
      return runCommand('yarn', ['dlx', command, ...rest], options)
    } catch (error) {
      if (!isEnoent(error)) throw error
    }
    if (npmCliPath) {
      return runCommand(process.execPath, [npmCliPath, 'exec', '--yes', '--', command, ...rest], options)
    }
    return runCommand('npm', ['exec', '--yes', '--', command, ...rest], options)
  }

  if (npmCliPath) {
    return runCommand(process.execPath, [npmCliPath, 'exec', '--yes', '--', command, ...rest], options)
  }

  return runCommand('npm', ['exec', '--yes', '--', command, ...rest], options)
}

function runWrangler(args: string[], options?: RunOptions) {
  return runNpx(['wrangler', ...args], options)
}

function runWranglerLatest(args: string[], options?: RunOptions) {
  return runNpx(['wrangler@latest', ...args], options)
}

type D1ExecuteJson = Array<{
  results?: Array<Record<string, unknown>>
  success?: boolean
  meta?: unknown
  error?: unknown
}>

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

function d1ExecuteJson(args: {d1Name: string; location: '--local' | '--remote'; command: string}) {
  const result = runWrangler(
    ['d1', 'execute', args.d1Name, args.location, '--json', '-y', '--command', args.command],
    {stdio: 'pipe', allowFailure: true}
  )

  if (result.status !== 0) return null
  return parseJson<D1ExecuteJson>(result.stdout.trim())
}

function d1TableExists(args: {d1Name: string; location: '--local' | '--remote'; tableName: string}) {
  const json = d1ExecuteJson({
    d1Name: args.d1Name,
    location: args.location,
    command: `SELECT name FROM sqlite_master WHERE type='table' AND name='${args.tableName}';`
  })

  const rows = json?.[0]?.results
  return Array.isArray(rows) && rows.length > 0
}

function d1TableColumns(args: {d1Name: string; location: '--local' | '--remote'; tableName: string}) {
  const json = d1ExecuteJson({
    d1Name: args.d1Name,
    location: args.location,
    command: `PRAGMA table_info('${args.tableName}');`
  })

  const rows = json?.[0]?.results
  if (!Array.isArray(rows)) return null

  const cols = new Set<string>()
  for (const row of rows) {
    const name = (row as any)?.name
    if (typeof name === 'string' && name.length) cols.add(name)
  }
  return cols
}

function d1MigrationsCount(args: {d1Name: string; location: '--local' | '--remote'}) {
  const json = d1ExecuteJson({
    d1Name: args.d1Name,
    location: args.location,
    command: `SELECT COUNT(*) as count FROM d1_migrations;`
  })

  const rows = json?.[0]?.results
  const first = Array.isArray(rows) ? rows[0] : undefined
  const raw = first ? (first as any).count : undefined
  const n = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(n) ? n : null
}

function fileExists(filePath: string) {
  try {
    fs.accessSync(filePath)
    return true
  } catch {
    return false
  }
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, {recursive: true})
}

function formatTimestamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(
    d.getMinutes()
  )}${pad(d.getSeconds())}`
}

function loadEnv(envFile: string) {
  if (!fileExists(envFile)) {
    printWarning(`Env file ${envFile} not found (continuing)`)
    return
  }

  printInfo(`Loading environment from ${envFile}`)
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const withoutExport = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
    const eqIndex = withoutExport.indexOf('=')
    if (eqIndex === -1) continue
    const key = withoutExport.slice(0, eqIndex).trim()
    let value = withoutExport.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
  printSuccess('Environment loaded')
}

function getConfig() {
  return {
    migrationsDir: process.env.MIGRATIONS_DIR ?? 'prisma/migrations',
    flatMigDir: process.env.FLAT_MIG_DIR ?? 'migrations',
    backupDir: process.env.BACKUP_DIR ?? '.backup',
    // Prefer using the Wrangler binding from `wrangler.toml`.
    // You can override via D1_NAME (binding or database_name).
    d1Name: process.env.D1_NAME ?? 'DB'
  }
}

function validateEnv(envType: 'dev' | 'prod') {
  printInfo(`Validating ${envType} environment vars...`)
  if (envType === 'dev') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL missing')
    }
  } else {
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_DATABASE_ID) {
      throw new Error('Missing Cloudflare credentials (CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID)')
    }
    if (!process.env.CLOUDFLARE_D1_TOKEN) {
      const whoami = runWrangler(['whoami'], {stdio: 'pipe', allowFailure: true})
      if (whoami.status !== 0) {
        throw new Error("Run 'wrangler auth login' or export CLOUDFLARE_D1_TOKEN")
      }
    } else {
      process.env.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_D1_TOKEN
    }
  }
  printSuccess('Environment ok')
}

function checkDependencies() {
  printInfo('Checking dependencies...')
  runCommand(process.execPath, ['--version'], {stdio: 'pipe'})
  try {
    runCommand('npm', ['--version'], {stdio: 'pipe'})
  } catch (error) {
    if (isEnoent(error)) {
      const cliPath = resolveNpmCliPath()
      if (cliPath) {
        runCommand(process.execPath, [cliPath, '--version'], {stdio: 'pipe'})
      } else {
        printWarning('npm not found on PATH; continuing')
      }
    } else {
      throw error
    }
  }
  runWrangler(['--version'], {stdio: 'pipe'})
  printSuccess('All dependencies present')
}

function backupSqlite(dbFile: string) {
  const {backupDir} = getConfig()
  ensureDir(backupDir)
  const backupPath = path.join(backupDir, `${path.basename(dbFile)}.${formatTimestamp()}.bak`)
  printInfo(`SQLite backup -> ${backupPath}`)
  fs.copyFileSync(dbFile, backupPath)
}

function findDevDb(): string | null {
  const candidates = ['dev.db', 'prisma/dev.db', './dev.db']
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate)
    if (fileExists(resolved)) return resolved
  }
  return null
}

function generatePrismaClient() {
  printInfo('Generating Prisma client...')
  runNpx(['prisma', 'generate'])
  printSuccess('Prisma client ready')
}

function flattenMigrations() {
  const {migrationsDir, flatMigDir} = getConfig()
  const sourceDir = path.resolve(migrationsDir)
  if (!fileExists(sourceDir)) {
    printWarning('No Prisma migrations yet')
    return
  }

  const targetDir = path.resolve(flatMigDir)
  ensureDir(targetDir)
  printInfo(`Flattening migrations -> ${targetDir}`)

  const entries = fs.readdirSync(sourceDir, {withFileTypes: true})
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const sqlPath = path.join(sourceDir, entry.name, 'migration.sql')
    if (!fileExists(sqlPath)) continue
    const target = path.join(targetDir, `${entry.name}.sql`)
    fs.copyFileSync(sqlPath, target)
  }
}

function listSqlFiles(dir: string) {
  const resolved = path.resolve(dir)
  if (!fileExists(resolved)) return []
  return fs
    .readdirSync(resolved)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => path.join(resolved, file))
}

function hasSchemaChanges(): boolean {
  const result = runNpx(
    [
      'prisma',
      'migrate',
      'diff',
      '--from-migrations',
      'prisma/migrations',
      '--to-schema',
      'prisma/schema.prisma',
      '--exit-code'
    ],
    {stdio: 'inherit', allowFailure: true}
  )

  if (result.status === 0) return false
  if (result.status === 2) return true
  throw new Error('prisma migrate diff failed')
}

function ensureWranglerMigrationsDir(flatDir: string) {
  const resolvedFlat = path.resolve(flatDir)
  const migrationsDir = path.resolve('migrations')
  if (resolvedFlat === migrationsDir) return {created: false, path: migrationsDir}
  if (fileExists(migrationsDir)) return {created: false, path: migrationsDir}

  ensureDir(migrationsDir)
  for (const file of listSqlFiles(flatDir)) {
    const target = path.join(migrationsDir, path.basename(file))
    fs.copyFileSync(file, target)
  }
  return {created: true, path: migrationsDir}
}

async function confirmPrompt(message: string) {
  if (!process.stdin.isTTY) return false
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})
  const answer = await new Promise<string>((resolve) => rl.question(`${message} (y/N): `, resolve))
  rl.close()
  return /^y(es)?$/i.test(answer.trim())
}

async function promptInput(message: string) {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})
  const answer = await new Promise<string>((resolve) => rl.question(`${message}: `, resolve))
  rl.close()
  return answer.trim()
}

async function prepareDev() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('dev')

  if (!hasSchemaChanges()) {
    printInfo('Schema already up-to-date — skipping migration')
    flattenMigrations()
    printSuccess('Development database ready')
    return
  }

  const dbPath = findDevDb()
  if (dbPath) backupSqlite(dbPath)

  const migrationName = process.env.MIGRATION_NAME ?? 'auto_migration'
  printInfo("Running 'prisma migrate dev' (auto-creates migrations if needed)")
  runNpx(['prisma', 'migrate', 'dev', '--name', migrationName])

  // Wrangler expects flat SQL files in `migrations/`, so copy Prisma's folder-based
  // migrations before applying.
  flattenMigrations()

  printInfo("Applying new migrations to Wrangler local D1...")
  const {d1Name} = getConfig()
  runWrangler(['d1', 'migrations', 'apply', d1Name, '--local'], {stdio: 'inherit'})

  generatePrismaClient()
  printSuccess('Development database ready')
}

async function deployProd() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('prod')

  const ok = await confirmPrompt('This will UPDATE the production Cloudflare D1 database! Continue?')
  if (!ok) {
    printInfo('Cancelled')
    return
  }

  const {flatMigDir, d1Name} = getConfig()
  flattenMigrations()
  const flatDirPath = path.resolve(flatMigDir)
  if (!fileExists(flatDirPath)) {
    throw new Error(`Dir '${flatMigDir}' not found`)
  }

  const temp = ensureWranglerMigrationsDir(flatMigDir)

  try {
    // If the remote DB already has tables, but Wrangler's migration history is missing/empty,
    // Wrangler will try to re-apply the whole baseline and fail with "table already exists".
    // In that case, "adopt" the baseline once by backfilling d1_migrations, then apply normally.
    const transferExists = d1TableExists({d1Name, location: '--remote', tableName: 'Transfer'})
    const migCount = d1MigrationsCount({d1Name, location: '--remote'})

    if (transferExists && (!migCount || migCount === 0)) {
      const adoptFile = path.resolve('scripts', 'adopt-d1-migrations.sql')
      if (!fileExists(adoptFile)) {
        throw new Error(`Missing adopt script: ${adoptFile}`)
      }

      printWarning('Remote D1 DB has tables but no migration history (d1_migrations missing/empty).')
      printInfo('Adopting baseline migrations into d1_migrations...')
      runWrangler(['d1', 'execute', d1Name, '--remote', '-y', '--file', adoptFile], {stdio: 'inherit'})
    }

    // Sometimes a DB is created after a rename (so old columns never existed).
    // In that case, the rename migration would fail, even though the schema is already correct.
    // We detect that and mark those specific migrations as applied in d1_migrations.
    const transferCols = d1TableColumns({d1Name, location: '--remote', tableName: 'Transfer'})
    if (transferCols) {
      const markApplied: string[] = []

      // amountEUR -> price
      if (transferCols.has('price') && !transferCols.has('amountEUR')) {
        markApplied.push('20260120121000_rename_amount_eur_to_price.sql')
      }

      // payment/billingParty -> paymentMethode/payingParty
      if (
        transferCols.has('paymentMethode') &&
        transferCols.has('payingParty') &&
        !transferCols.has('payment') &&
        !transferCols.has('billingParty')
      ) {
        markApplied.push('20260120122000_rename_payment_fields.sql')
      }

      if (markApplied.length) {
        printInfo(`Remote schema already includes rename targets; marking ${markApplied.length} migration(s) as applied...`)
        // NOTE: Keep this on ONE line. On Windows, passing multi-line SQL through
        // `npx wrangler ... --command "<sql>"` can get mangled by cmd wrappers and
        // result in "incomplete input".
        const sql =
          `CREATE TABLE IF NOT EXISTS d1_migrations (` +
          `id INTEGER PRIMARY KEY AUTOINCREMENT, ` +
          `name TEXT UNIQUE, ` +
          `applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL` +
          `); ` +
          markApplied
            .map((name) => `INSERT OR IGNORE INTO d1_migrations (name) VALUES ('${name}');`)
            .join(' ')
        runWrangler(['d1', 'execute', d1Name, '--remote', '-y', '--command', sql], {stdio: 'inherit'})
      }
    }

    printInfo("Trying 'wrangler d1 migrations apply'...")
    runWrangler(['d1', 'migrations', 'apply', d1Name, '--remote'], {stdio: 'inherit'})
  } catch (error) {
    const msg = String((error as any)?.message ?? error)
    if (/already exists/i.test(msg) && /SQLITE_ERROR/i.test(msg)) {
      printWarning('It looks like this D1 database already has tables, but no Wrangler migration history yet.')
      printInfo('If this database was initialized outside of `wrangler d1 migrations apply`, adopt the baseline once:')
      printInfo(`  npx wrangler d1 execute ${d1Name} --remote --file ./scripts/adopt-d1-migrations.sql`)
      printInfo('Then re-run this deploy.')
    }
    throw error
  } finally {
    if (temp.created) {
      fs.rmSync(temp.path, {recursive: true, force: true})
    }
  }

  generatePrismaClient()
  printSuccess('Production database updated')
}

async function resetDev() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('dev')

  const ok = await confirmPrompt('All LOCAL data will be LOST! Really reset?')
  if (!ok) {
    printInfo('Cancelled')
    return
  }

  const dbPath = findDevDb()
  if (dbPath) backupSqlite(dbPath)

  runNpx(['prisma', 'migrate', 'reset', '--force'])
  flattenMigrations()
  generatePrismaClient()
  printSuccess('Dev database reset')
}

async function seedDev() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('dev')

  const resetFlag = process.env.SEED_RESET === '1' ? ['--reset'] : []
  printInfo('Seeding local database...')
  runNpx(['tsx', 'prisma/seed.ts', ...resetFlag])
  printSuccess('Local seed complete')
}

async function seedProd() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('prod')

  const ok = await confirmPrompt('This will SEED the production Cloudflare D1 database! Continue?')
  if (!ok) {
    printInfo('Cancelled')
    return
  }

  const cfg = getConfig()
  const resetFlag = process.env.SEED_RESET === '1' ? ['--reset'] : []
  const {backupDir, d1Name} = cfg
  ensureDir(backupDir)
  const outPath = path.join(backupDir, `seed_${formatTimestamp()}.sql`)

  printInfo(`Generating seed SQL -> ${outPath}`)
  runNpx(['tsx', 'prisma/seed.ts', '--sql', '--out', outPath, '--no-tx', ...resetFlag])

  printInfo(`Applying seed SQL to D1 (${d1Name})...`)
  runWrangler(['d1', 'execute', d1Name, '--file', outPath, '--remote'])
  printSuccess('Production seed applied')
}

async function checkStatus() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  printInfo('Local migrate status')
  runNpx(['prisma', 'migrate', 'status'], {allowFailure: true})
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_DATABASE_ID) {
    const {d1Name} = getConfig()
    printInfo('Remote (D1) migration status')
    runWrangler(['d1', 'migrations', 'list', d1Name, '--remote'], {
      stdio: 'inherit',
      allowFailure: true
    })
  }
}

async function createMigration(nameArg?: string) {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('dev')
  let name = nameArg || process.env.MIGRATION_NAME
  if (!name) {
    name = await promptInput('Migration name')
  }
  if (!name) throw new Error('Name required')
  runNpx(['prisma', 'migrate', 'dev', '--name', name, '--create-only'])
  flattenMigrations()
  printSuccess('Migration folder created & flattened')
}

async function prismaStudio() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  printInfo('Launching Prisma Studio...')
  runNpx(['prisma', 'studio'])
}

async function d1Info() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('prod')
  const {d1Name} = getConfig()
  printInfo(`Cloudflare D1 info (${d1Name})`)
  runWrangler(['d1', 'info', d1Name], {stdio: 'inherit', allowFailure: true})
  runWrangler(['d1', 'migrations', 'list', d1Name, '--remote'], {
    stdio: 'inherit',
    allowFailure: true
  })
}

async function backupD1() {
  printHeader()
  loadEnv(process.env.ENV_FILE ?? '.env')
  validateEnv('prod')
  const {backupDir, d1Name} = getConfig()
  ensureDir(backupDir)
  const outPath = path.join(backupDir, `d1_backup_${formatTimestamp()}.sql`)
  printInfo(`Exporting D1 -> ${outPath}`)
  runWranglerLatest(['d1', 'export', d1Name, '--remote', '--output', outPath])
  printSuccess(`Backup written to ${outPath}`)
}

function printHelp() {
  console.log(`
Usage: tsx scripts/migrate.ts <command> [options]

Core workflow
  prepare              Generate & apply dev migrations (must run first)
  deploy               Apply prepared migrations to Cloudflare D1

Seeding
  seed                 Seed local DB from prisma/seed.ts
  seed-deploy          Seed production D1 using generated SQL

Maintenance
  reset                Reset local dev DB (DESTROYS DATA)
  status               Show migration status (local & optionally remote)
  create [name]        Create migration folder only (no apply)
  studio               Open Prisma Studio

D1 utilities
  d1-info              Show production D1 info + migrations
  d1-backup            Dump production D1 schema/data to ${getConfig().backupDir}/

Common options
  --name <name>        Migration name (prepare/create)
  --env <file>         Alternate .env file (default .env)
  SEED_RESET=1         Delete existing data before seeding
`)
}

async function main() {
  const argv = process.argv.slice(2)
  let command = ''
  const rest: string[] = []
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === undefined) continue
    if (arg === '--name') {
      const next = argv[i + 1]
      if (!next) throw new Error('Missing value for --name')
      process.env.MIGRATION_NAME = next
      i += 1
      continue
    }
    if (arg === '--env') {
      const next = argv[i + 1]
      if (!next) throw new Error('Missing value for --env')
      process.env.ENV_FILE = next
      i += 1
      continue
    }
    if (!command) {
      command = arg
    } else {
      rest.push(arg)
    }
  }

  checkDependencies()

  switch (command) {
    case 'prepare':
    case 'dev':
      await prepareDev()
      break
    case 'deploy':
    case 'prod':
      await deployProd()
      break
    case 'seed':
      await seedDev()
      break
    case 'seed-deploy':
    case 'seed-prod':
      await seedProd()
      break
    case 'reset':
      await resetDev()
      break
    case 'status':
      await checkStatus()
      break
    case 'create':
      await createMigration(rest[0])
      break
    case 'studio':
      await prismaStudio()
      break
    case 'd1-info':
      await d1Info()
      break
    case 'd1-backup':
      await backupD1()
      break
    case '':
    case 'help':
    case '-h':
    case '--help':
      printHelp()
      break
    default:
      throw new Error(`Unknown command '${command}'`)
  }
}

main().catch((error) => {
  printError(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
