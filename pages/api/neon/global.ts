import {
  NextFetchEvent,
  NextRequest as Request,
  NextResponse as Response,
} from "next/server"
import type { Database } from "@/types/database"
import { Pool } from "@neondatabase/serverless"
import { Kysely, PostgresDialect } from "kysely"
import { findRegion } from "@/utils/find-region"
import { toNumber } from "@/utils/to-number"

export const config = {
  runtime: "edge",
}

const start = Date.now()
let coldStart = true

export default async function api(req: Request, event: NextFetchEvent) {
  const time = Date.now()
  const now = coldStart
  coldStart = false

  const pool = new Pool({
    connectionString: process.env.NEON_BD_URL,
  })

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  })

  const count = toNumber(new URL(req.url).searchParams.get("count"))

  let data = null
  for (let i = 0; i < count; i++) {
    data = await db
      .selectFrom("employees")
      .select(["emp_no", "first_name", "last_name"])
      .limit(10)
      .execute()
  }

  event.waitUntil(pool.end())

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationIsColdStart: now,
      invocationRegion: findRegion(req.headers.get("x-vercel-id") ?? ""),
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  )
}
