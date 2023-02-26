import { Redis } from "@upstash/redis"
import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";
import type { Database } from "@/types/planetscale"

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

const redis = Redis.fromEnv()

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const now = coldStart
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  for (let i = 0; i < countNumber; i++) {
    data = await redis.json.get("employees", "$[*]")
  }

  res.setHeader('x-serverless-is-cold', now ? "1" : "0")
  return res.status(200).json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: now,
    invocationRegion: VERCEL_REGION,
    vercel: findRegion(req.headers["x-vercel-id"] as string ?? ""),
  })
}
