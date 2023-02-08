// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getData } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let data = await getData();
  res.status(200).json(data)
}
