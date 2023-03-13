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
    data = await fetch(`${process.env.RESTDB_BD_URL}/rest/employees?max=10`, {
      method: "GET",
      headers: {
        "cache-control": "no-cache",
        "x-apikey": process.env.RESTDB_API_KEY,
      },
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
