import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";

interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}

interface Database {
  employees: EmployeeTable;
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.PSCALE_DB_HOST,
    username: process.env.PSCALE_DB_USERNAME,
    password: process.env.PSCALE_DB_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(req: Request, res: Response) {
  const query = req.query;
  const { count } = query;
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await db
      .selectFrom("employees")
      .select(["emp_no", "first_name", "last_name"])
      .limit(10)
      .execute();
  }

  res.setHeader('x-edge-is-cold', start === time ? "1" : "0")
  return res.status(200).json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
    invocationRegion: findRegion(req.headers["x-vercel-id"] ?? "")
  })
}
