import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
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
    host: process.env.PSCALE_DB_HOST,
    username: process.env.PSCALE_DB_USERNAME,
    password: process.env.PSCALE_DB_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await db
      .selectFrom("employees")
      .select(["emp_no", "first_name", "last_name"])
      .limit(10)
      .execute();
  }

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationRegion: findRegion(req.headers.get("x-vercel-id") ?? "")
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}

function findRegion(vercelId: string | null) {
  const count = (vercelId.match(/::/g) || []).length;

  switch(count) {
    case 1:
      return vercelId.split("::")[0];
      break;
    case 2:
      return vercelId.split("::")[1];
      break;
    default:
      return null
  }
}
