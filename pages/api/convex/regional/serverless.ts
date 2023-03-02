import { ConvexHttpClient } from "convex/browser";
import { NextRequest as Request, NextResponse as Response } from "next/server";
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

// Make sure we use the Edge endpoints.
let url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url.endsWith("edge.convex.cloud")) {
  url = url.replace(/convex.cloud$/g, "edge.convex.cloud");
}

const convex = new ConvexHttpClient(url);

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const isCold = coldStart
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0

  let data = null;
  for (let i = 0; i < countNumber; i++) {
    data = await convex.query("employees")(10);
  }

  res.setHeader('x-serverless-is-cold', isCold ? "1" : "0")
  return res.status(200).json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: isCold,
    invocationRegion: VERCEL_REGION,
    vercel: findRegion(req.headers["x-vercel-id"] as string ?? ""),
  })
}
