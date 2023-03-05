import { Pool } from '@neondatabase/serverless';
import { Kysely, PostgresDialect } from 'kysely';
import { NextApiRequest as Request, NextApiResponse as Response } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";
import type { Database } from "@/types/database"

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const isCold = coldStart
  coldStart = false;

  const pool = new Pool({
    connectionString: process.env.NEON_BD_URL
  });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool })
  });

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  let fetchEnd = false
  for (let i = 0; i < countNumber; i++) {
    data = await db
      .selectFrom("employees")
      .select(["emp_no", "first_name", "last_name"])
      .limit(10)
      .execute();
    fetchEnd = (countNumber - 1) === i
  }

  res.setHeader('x-serverless-is-cold', isCold ? "1" : "0")
  const reponse = {
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: isCold,
    invocationRegion: VERCEL_REGION,
    vercel: findRegion(req.headers["x-vercel-id"] as string ?? ""),
  }

  if (data !== null && !!fetchEnd || countNumber === 0) {
    pool.end()
  }

  return res.status(200).json(reponse)
}
