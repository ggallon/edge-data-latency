import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

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
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(req: Request) {
  const time = Date.now();
  const data = await db
    .selectFrom("employees")
    .select(["emp_no", "first_name", "last_name"])
    .limit(10)
    .execute();

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationRegion:
        (req.headers.get("x-vercel-id") ?? "").split(":")[0] || null,
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  );
}
