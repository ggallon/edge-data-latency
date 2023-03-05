import { NextRequest as Request, NextResponse as Response } from "next/server"
import { findRegion } from "@/utils/find-region"
import { toNumber } from "@/utils/to-number"
import { getXataClient } from "@/xata/xata"

export const config = {
  runtime: "edge",
}

const xata = getXataClient()

const start = Date.now()
let coldStart = true

export default async function api(req: Request) {
  const time = Date.now()
  const now = coldStart
  coldStart = false

  const count = toNumber(new URL(req.url).searchParams.get("count"))

  let data = null
  for (let i = 0; i < count; i++) {
    data = await xata.db.employees
      .select(["emp_no", "first_name", "last_name"])
      .getMany({ pagination: { size: 10 }, consistency: "eventual" })
  }

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
