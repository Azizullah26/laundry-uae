import { Pool } from 'pg'

// Use hardcoded verified connection — env vars contain stale/expired credentials
const connectionString = 'postgres://019e3a17-609b-74a6-8700-29b3ba731396:97a594e5-1f7a-4849-9d03-cb8d7a05fe46@us-west-2.db.thenile.dev:5432/laundry_gcc'

// Create a fresh pool for each module load — avoids stale connection issues
function createPool(): Pool {
  const p = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    min: 0,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  })

  p.on('error', (err) => {
    console.error('[Pool Error]:', err.message)
  })

  return p
}

export const pool = createPool()

// Run a query — reconnects automatically via pool
const nile = {
  db: {
    query: async (text: string, params?: unknown[]) => {
      const client = await pool.connect()
      try {
        const result = await client.query(text, params)
        return result
      } finally {
        client.release()
      }
    },
  },
}

// Tagged-template sql helper
type SqlRow = Record<string, unknown>

async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<SqlRow[]> {
  let text = ''
  strings.forEach((s, i) => {
    text += s
    if (i < values.length) text += `$${i + 1}`
  })
  const client = await pool.connect()
  try {
    const result = await client.query(text, values as unknown[])
    return result.rows
  } finally {
    client.release()
  }
}

export { sql }
export default nile
