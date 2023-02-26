import { Redis } from "@upstash/redis"
import { NextRequest as Request, NextResponse as Response } from "next/server";
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";

export const config = {
  runtime: "edge",
};

const redis = Redis.fromEnv()
const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await redis.json.get("employees", "$[*]")
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
