import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { findRegion } from "@/utils/find-region"
import { toNumber } from "@/utils/to-number"

export const config = {
  runtime: "edge",
}

// Make sure we use the Edge endpoints.
let url = process.env.NEXT_PUBLIC_CONVEX_URL
if (!url.endsWith("edge.convex.cloud")) {
  url = url.replace(/convex.cloud$/g, "edge.convex.cloud")
}

const convex = new ConvexHttpClient(url)

const start = Date.now()
let coldStart = true

export default async function api(req: Request) {
  const time = Date.now()
  const now = coldStart
  coldStart = false

  const count = toNumber(new URL(req.url).searchParams.get("count"))

  let data = null
  for (let i = 0; i < count; i++) {
    data = await convex.query("employees")(10)
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
