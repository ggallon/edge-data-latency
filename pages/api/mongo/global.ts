import { NextRequest as Request, NextResponse as Response } from "next/server"
import { findRegion } from "@/utils/find-region"
import { toNumber } from "@/utils/to-number"

export const config = {
  runtime: "edge",
}

const start = Date.now()

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"))
  const time = Date.now()

  let data = null
  for (let i = 0; i < count; i++) {
    data = await fetch(
      `${process.env.MONGO_DATA_API_URL}/endpoint/data/v1/action/find`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key": process.env.MONGO_DATA_API_TOKEN,
        },
        body: JSON.stringify({
          dataSource: "fasticons",
          database: "edge-data",
          collection: "employees",
          projection: {
            _id: 1,
            first_name: 1,
            last_name: 1,
          },
          limit: 10,
        }),
      }
    ).then((res) => res.json())
  }

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationRegion: findRegion(req.headers.get("x-vercel-id") ?? ""),
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  )
}
