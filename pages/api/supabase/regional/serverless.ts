import { createClient } from "@supabase/supabase-js";
import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";
import type { Database } from "@/types/planetscale"

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const isCold = coldStart
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  for (let i = 0; i < countNumber; i++) {
    const response = await supabase
      .from("employees")
      .select("emp_no,first_name,last_name")
      .limit(10);
    data = response.data;
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
