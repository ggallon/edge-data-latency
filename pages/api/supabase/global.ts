import { NextRequest as Request, NextResponse as Response } from "next/server"
import type { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"
import { findRegion } from "@/utils/find-region"
import { toNumber } from "@/utils/to-number"

export const config = {
  runtime: "edge",
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const start = Date.now()

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"))
  const time = Date.now()

  let data = null
  for (let i = 0; i < count; i++) {
    const response = await supabase
      .from("employees")
      .select("emp_no,first_name,last_name")
      .limit(10)
    data = response.data
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
