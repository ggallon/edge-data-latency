import { NextApiRequest as Request, NextApiResponse as Response  } from 'next'
import { findRegion } from "@/utils/find-region";
import { toNumber } from "@/utils/to-number";

let coldStart = true;

const VERCEL_REGION = process.env.VERCEL_REGION ?? ""

export default async function api(req: Request, res: Response) {
  const time = Date.now();
  const isCold = coldStart
  coldStart = false;

  const count = req.query?.count as string;
  const countNumber = toNumber(count) ?? 0
  
  let data = null;
  for (let i = 0; i < countNumber; i++) {
    data = await fetch(
      process.env.FAUNA_API_URL,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${process.env.FAUNA_API_KEY}`,
        },
        body: JSON.stringify({
          query: `{
            listEmployees(_size: 10) {
              data {
                emp_no: _id
                first_name
                last_name
                inserted_at: _ts
                update_at: _ts
              }
            }
          }`,
        }),
      }
    ).then((res) => res.json());
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
