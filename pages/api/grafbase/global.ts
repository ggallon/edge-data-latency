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
    data = await fetch(process.env.GRAFBASE_BD_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.GRAFBASE_API_KEY,
      },
      body: JSON.stringify({
        query: `{
          employeeCollection(first: 10) {
            edges {
              node {
                id
                firstName
                lastName
                createdAt
                updatedAt
              }
            }
          }
        }`,
      }),
    }).then((res) => res.json())
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
