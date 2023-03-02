import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";
import { getXataClient } from "@/xata/xata"

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

const xata = getXataClient();

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const isCold = coldStart
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  for (let i = 0; i < countNumber; i++) {
    data = await xata.db.employees
      .select(["emp_no", "first_name", "last_name"])
      .getMany({ pagination: { size: 10 }, consistency: "eventual" });
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
