import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";

const AWS_LAMBDA_FUNCTION_VERSION = process.env.AWS_LAMBDA_FUNCTION_VERSION ?? ""
const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

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
let coldStart = true;
let invocation_count = 0

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  invocation_count += 1
  let now = coldStart
  if (coldStart) {
    console.log("First time the handler was called since this function was deployed in this container");
  }
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  for (let i = 0; i < countNumber; i++) {
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
    invocationIsColdStart: [coldStart, now, invocation_count],
    invocationLambdaVersion: AWS_LAMBDA_FUNCTION_VERSION,
    invocationRegion: VERCEL_REGION,
    vercel: findRegion(req.headers["x-vercel-id"] as string ?? ""),
  })
}
